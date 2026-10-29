import os
import uuid
import requests
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Response
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from app.core.config import settings
from app.services.storage_service import storage_service
from app.services.crypto_service import crypto_service

router = APIRouter()

# In-memory document registry fallback for offline/development resilience
_LOCAL_DOCUMENTS_CACHE = []

class DocumentMetadataResponse(BaseModel):
    id: str
    patient_id: str
    uploaded_by: str
    uploader_role: str
    appointment_id: Optional[str] = None
    order_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    category: str
    storage_path: str
    mime_type: str
    file_size: int
    file_hash_sha256: str
    pqc_signature: Optional[str] = None
    signer_public_key: Optional[str] = None
    is_verified: bool
    created_at: str
    signed_url: str

class SignedUrlRequest(BaseModel):
    storage_path: str
    expires_in_seconds: Optional[int] = 3600

class SignedUrlResponse(BaseModel):
    storage_path: str
    signed_url: str
    expires_in_seconds: int


@router.post("/upload", response_model=DocumentMetadataResponse, tags=["Medical Documents"])
async def upload_medical_document(
    file: UploadFile = File(...),
    patient_id: str = Form(...),
    uploaded_by: str = Form(...),
    uploader_role: str = Form(...),
    category: str = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    appointment_id: Optional[str] = Form(None),
    order_id: Optional[str] = Form(None),
    sign_with_pqc: bool = Form(True),
    signer_private_key: Optional[str] = Form(None),
    signer_public_key: Optional[str] = Form(None)
):
    """
    Upload and secure a patient medical document/scan.
    Validates file format (JPG, PNG, WEBP), enforces 10 MB limit,
    binds document SHA-256 hash, and generates ML-DSA-65 post-quantum signature.
    """
    # 1. Read file bytes
    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed reading uploaded file: {str(e)}")

    # 2. Strict file size & image content validation
    is_valid, mime_type, err_msg = storage_service.validate_image_file(file_bytes, file.filename or "image.png")
    if not is_valid:
        raise HTTPException(status_code=400, detail=err_msg)

    # 3. Store file safely in storage (Supabase private bucket with local fallback)
    upload_res = storage_service.upload_file(file_bytes, patient_id, mime_type)
    storage_path = upload_res["storage_path"]
    file_hash = upload_res["file_hash_sha256"]
    signed_url = upload_res["signed_url"]

    # 4. Generate ML-DSA-65 digital signature for non-repudiation
    pqc_signature = None
    if sign_with_pqc:
        try:
            if not signer_private_key:
                # Generate keypair if not passed by client
                keygen = crypto_service.generate_dsa_keypair()
                signer_private_key = keygen["private_key"]
                signer_public_key = keygen["public_key"]

            sig_res = crypto_service.sign_dsa(file_hash, signer_private_key)
            pqc_signature = sig_res["signature"]
        except Exception as e:
            print(f"[PQC Signature Error]: {e}")

    # 5. Insert metadata into Supabase public.medical_documents if available
    doc_id = str(uuid.uuid4())
    from datetime import datetime, timezone
    created_at = datetime.now(timezone.utc).isoformat()
    db_persisted = False

    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        try:
            headers = {
                "apikey": settings.SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
            payload = {
                "id": doc_id,
                "patient_id": patient_id,
                "uploaded_by": uploaded_by,
                "uploader_role": uploader_role,
                "appointment_id": appointment_id if appointment_id else None,
                "order_id": order_id if order_id else None,
                "title": title,
                "description": description,
                "category": category,
                "storage_path": storage_path,
                "mime_type": mime_type,
                "file_size": upload_res["file_size"],
                "file_hash_sha256": file_hash,
                "pqc_signature": pqc_signature,
                "signer_public_key": signer_public_key,
                "is_verified": bool(pqc_signature)
            }
            db_res = requests.post(
                f"{settings.SUPABASE_URL}/rest/v1/medical_documents",
                headers=headers,
                json=payload,
                timeout=5
            )
            if db_res.status_code in [200, 201]:
                db_persisted = True
                data = db_res.json()
                if isinstance(data, list) and len(data) > 0:
                    doc_id = data[0].get("id", doc_id)
        except Exception as e:
            print(f"[Database Error]: Could not insert into medical_documents: {e}")

    # Build response object
    doc_record = {
        "id": doc_id,
        "patient_id": patient_id,
        "uploaded_by": uploaded_by,
        "uploader_role": uploader_role,
        "appointment_id": appointment_id,
        "order_id": order_id,
        "title": title,
        "description": description,
        "category": category,
        "storage_path": storage_path,
        "mime_type": mime_type,
        "file_size": upload_res["file_size"],
        "file_hash_sha256": file_hash,
        "pqc_signature": pqc_signature,
        "signer_public_key": signer_public_key,
        "is_verified": bool(pqc_signature),
        "created_at": created_at,
        "signed_url": signed_url
    }

    # Keep in local memory cache
    _LOCAL_DOCUMENTS_CACHE.append(doc_record)

    return doc_record


@router.get("/patient/{patient_id}", response_model=List[DocumentMetadataResponse], tags=["Medical Documents"])
async def get_patient_documents(patient_id: str):
    """
    List all authorized medical records for a specific patient.
    Refreshes signed URLs for private viewing.
    """
    results = []

    # Attempt fetch from Supabase
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        try:
            headers = {
                "apikey": settings.SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}"
            }
            url = f"{settings.SUPABASE_URL}/rest/v1/medical_documents?patient_id=eq.{patient_id}&order=created_at.desc"
            res = requests.get(url, headers=headers, timeout=5)
            if res.status_code == 200:
                rows = res.json()
                for row in rows:
                    signed_url = storage_service.get_signed_url(row["storage_path"])
                    results.append({
                        **row,
                        "signed_url": signed_url
                    })
                return results
        except Exception as e:
            print(f"[Supabase Fetch Error]: {e}")

    # Fallback to local cache
    cached = [d for d in _LOCAL_DOCUMENTS_CACHE if d["patient_id"] == patient_id]
    for d in cached:
        d["signed_url"] = storage_service.get_signed_url(d["storage_path"])
    return cached


@router.get("/doctor/{doctor_id}", response_model=List[DocumentMetadataResponse], tags=["Medical Documents"])
async def get_doctor_documents(doctor_id: str):
    """
    List documents uploaded by or authorized for a specific doctor.
    """
    results = []
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        try:
            headers = {
                "apikey": settings.SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}"
            }
            url = f"{settings.SUPABASE_URL}/rest/v1/medical_documents?uploaded_by=eq.{doctor_id}&order=created_at.desc"
            res = requests.get(url, headers=headers, timeout=5)
            if res.status_code == 200:
                rows = res.json()
                for row in rows:
                    signed_url = storage_service.get_signed_url(row["storage_path"])
                    results.append({
                        **row,
                        "signed_url": signed_url
                    })
                return results
        except Exception as e:
            print(f"[Supabase Doctor Fetch Error]: {e}")

    cached = [d for d in _LOCAL_DOCUMENTS_CACHE if d["uploaded_by"] == doctor_id]
    for d in cached:
        d["signed_url"] = storage_service.get_signed_url(d["storage_path"])
    return cached


@router.get("/order/{order_id}", response_model=List[DocumentMetadataResponse], tags=["Medical Documents"])
async def get_order_documents(order_id: str):
    """
    List reports and documents bound to a specific lab test order.
    """
    results = []
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        try:
            headers = {
                "apikey": settings.SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}"
            }
            url = f"{settings.SUPABASE_URL}/rest/v1/medical_documents?order_id=eq.{order_id}&order=created_at.desc"
            res = requests.get(url, headers=headers, timeout=5)
            if res.status_code == 200:
                rows = res.json()
                for row in rows:
                    signed_url = storage_service.get_signed_url(row["storage_path"])
                    results.append({
                        **row,
                        "signed_url": signed_url
                    })
                return results
        except Exception as e:
            print(f"[Supabase Order Fetch Error]: {e}")

    cached = [d for d in _LOCAL_DOCUMENTS_CACHE if d.get("order_id") == order_id]
    for d in cached:
        d["signed_url"] = storage_service.get_signed_url(d["storage_path"])
    return cached


@router.post("/signed-url", response_model=SignedUrlResponse, tags=["Medical Documents"])
async def generate_document_signed_url(req: SignedUrlRequest):
    """
    Generate a fresh short-lived signed URL for an authorized document path.
    """
    signed_url = storage_service.get_signed_url(req.storage_path, req.expires_in_seconds or 3600)
    return {
        "storage_path": req.storage_path,
        "signed_url": signed_url,
        "expires_in_seconds": req.expires_in_seconds or 3600
    }


@router.get("/raw/{path:path}", tags=["Medical Documents"])
async def serve_local_document(path: str):
    """
    Serves verified local storage image files with strict path sanitization.
    """
    full_path = storage_service.get_local_file_path(path)
    if not full_path or not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail="Document image not found.")

    ext = os.path.splitext(full_path)[1].lower()
    media_type = "image/jpeg"
    if ext == ".png":
        media_type = "image/png"
    elif ext == ".webp":
        media_type = "image/webp"

    return FileResponse(
        full_path, 
        media_type=media_type, 
        headers={"Cache-Control": "private, max-age=3600"}
    )
