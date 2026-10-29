from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from app.services.crypto_service import crypto_service

router = APIRouter()

# Request/Response Schemas
class KEMKeygenResponse(BaseModel):
    public_key: str
    private_key: str
    algorithm: str

class KEMEncapsulateRequest(BaseModel):
    public_key: str = Field(..., description="Recipient's ML-KEM-768 public key (Base64)")

class KEMEncapsulateResponse(BaseModel):
    ciphertext: str
    shared_secret: str
    shared_secret_hash: str
    algorithm: str

class KEMDecapsulateRequest(BaseModel):
    private_key: str = Field(..., description="Recipient's ML-KEM-768 private key (Base64)")
    ciphertext: str = Field(..., description="Encapsulated key ciphertext (Base64)")

class KEMDecapsulateResponse(BaseModel):
    shared_secret: str
    shared_secret_hash: str
    algorithm: str

class EncryptReportRequest(BaseModel):
    plaintext: str = Field(..., description="Sensitive medical lab report data (JSON string or text)")
    shared_secret: str = Field(..., description="Derived shared secret (Base64)")
    associated_data: Optional[str] = Field("", description="Metadata to bind to ciphertext (e.g., patient ID)")

class EncryptReportResponse(BaseModel):
    ciphertext: str
    iv: str
    auth_tag: str
    associated_data: str
    algorithm: str

class DecryptReportRequest(BaseModel):
    ciphertext: str
    iv: str
    auth_tag: str
    shared_secret: str
    associated_data: Optional[str] = ""

class DecryptReportResponse(BaseModel):
    plaintext: str

class SignReportRequest(BaseModel):
    data: str = Field(..., description="Ciphertext or report data to sign")
    private_key: str = Field(..., description="Signer's ML-DSA-65 private key (Base64)")

class SignReportResponse(BaseModel):
    signature: str
    data_hash: str
    algorithm: str

class VerifySignatureRequest(BaseModel):
    data: str
    signature: str
    public_key: str

class VerifySignatureResponse(BaseModel):
    valid: bool
    algorithm: str


@router.get("/status", tags=["Post-Quantum Cryptography"])
async def get_crypto_status():
    """Return cryptographic capabilities and standards compliance."""
    return crypto_service.get_capabilities()


@router.post("/kem/keygen", response_model=KEMKeygenResponse, tags=["ML-KEM-768 (Key Encapsulation)"])
async def generate_kem_keys():
    """Generate NIST FIPS 203 ML-KEM-768 keypair."""
    try:
        return crypto_service.generate_kem_keypair()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/kem/encapsulate", response_model=KEMEncapsulateResponse, tags=["ML-KEM-768 (Key Encapsulation)"])
async def encapsulate_key(req: KEMEncapsulateRequest):
    """Encapsulate symmetric shared secret using recipient public key."""
    try:
        return crypto_service.encapsulate_kem(req.public_key)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/kem/decapsulate", response_model=KEMDecapsulateResponse, tags=["ML-KEM-768 (Key Encapsulation)"])
async def decapsulate_key(req: KEMDecapsulateRequest):
    """Decapsulate symmetric shared secret using private key."""
    try:
        return crypto_service.decapsulate_kem(req.private_key, req.ciphertext)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/encrypt", response_model=EncryptReportResponse, tags=["AES-256-GCM (Authenticated Encryption)"])
async def encrypt_report(req: EncryptReportRequest):
    """Encrypt lab report data using AES-256-GCM."""
    try:
        return crypto_service.encrypt_aes_gcm(req.plaintext, req.shared_secret, req.associated_data or "")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/decrypt", response_model=DecryptReportResponse, tags=["AES-256-GCM (Authenticated Encryption)"])
async def decrypt_report(req: DecryptReportRequest):
    """Decrypt and verify AES-256-GCM medical report."""
    try:
        plaintext = crypto_service.decrypt_aes_gcm(
            req.ciphertext, req.iv, req.auth_tag, req.shared_secret, req.associated_data or ""
        )
        return {"plaintext": plaintext}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/dsa/keygen", tags=["ML-DSA-65 (Digital Signatures)"])
async def generate_dsa_keys():
    """Generate NIST FIPS 204 ML-DSA-65 signing keypair."""
    try:
        return crypto_service.generate_dsa_keypair()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/dsa/sign", response_model=SignReportResponse, tags=["ML-DSA-65 (Digital Signatures)"])
async def sign_report(req: SignReportRequest):
    """Sign lab report ciphertext using ML-DSA-65."""
    try:
        return crypto_service.sign_dsa(req.data, req.private_key)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


class VerifyReportRequest(BaseModel):
    report_id: Optional[str] = Field(None, description="Optional UUID of the report in database")
    encrypted_payload: str = Field(..., description="Exact AES-256-GCM ciphertext payload")
    pqc_signature: str = Field(..., description="ML-DSA-65 digital signature")
    signer_public_key: str = Field(..., description="Lab technician ML-DSA-65 public key")

class VerifyReportResponse(BaseModel):
    valid: bool
    algorithm: str
    message: str
    report_id: Optional[str] = None
    database_updated: bool = False


@router.post("/dsa/verify", response_model=VerifySignatureResponse, tags=["ML-DSA-65 (Digital Signatures)"])
async def verify_signature(req: VerifySignatureRequest):
    """Verify ML-DSA-65 signature on report."""
    valid = crypto_service.verify_dsa(req.data, req.signature, req.public_key)
    return {"valid": valid, "algorithm": "ML-DSA-65"}


@router.post("/report/verify", response_model=VerifyReportResponse, tags=["ML-DSA-65 (Digital Signatures)"])
async def verify_report_integrity(req: VerifyReportRequest):
    """
    Cryptographically verify a medical report's ML-DSA-65 lattice signature.
    Fails closed if the signature, key, or ciphertext is missing, invalid, or tampered with.
    If valid and report_id is provided with service credentials, updates is_verified in the database.
    """
    if not req.encrypted_payload or not req.pqc_signature or not req.signer_public_key:
        raise HTTPException(
            status_code=400,
            detail="Cryptographic verification failed: Missing payload, signature, or public key."
        )

    # Perform strict ML-DSA-65 verification
    is_valid = crypto_service.verify_dsa(req.encrypted_payload, req.pqc_signature, req.signer_public_key)
    if not is_valid:
        from app.services.security_service import security_service
        import uuid
        req_id = f"req-{uuid.uuid4().hex[:8]}"
        ev = {
            "report_id": req.report_id or "unknown",
            "violation": "ML-DSA-65 lattice signature mismatch or payload tampering detected",
            "algorithm": "NIST FIPS 204 (ML-DSA-65 / Dilithium3)"
        }
        security_service.record_event(
            event_type="INVALID_DIGITAL_SIGNATURE",
            severity="CRITICAL",
            outcome="BLOCKED",
            endpoint="/api/pqc/report/verify",
            observed_source_ip="client",
            evidence=ev,
            request_id=req_id
        )
        security_service.create_alert(
            rule_name="CRYPTOGRAPHIC_SIGNATURE_TAMPER",
            rule_description="Lattice digital signature verification failed. Bit-flip or unauthorized alteration detected.",
            observed_source_ip="client",
            endpoint="/api/pqc/report/verify",
            request_id=req_id,
            evidence=ev,
            severity="CRITICAL",
            confidence="CONFIRMED_HIGH",
            defensive_action="Verification failed closed; report was not marked verified in database.",
            recommended_action="Audit laboratory technician device certificates; inspect network channel for MITM tampering."
        )
        raise HTTPException(
            status_code=400,
            detail="Cryptographic signature verification failed: ML-DSA-65 signature is invalid or payload has been tampered with."
        )

    db_updated = False
    from app.core.config import settings
    if req.report_id and settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        try:
            import requests
            headers = {
                "apikey": settings.SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }
            url = f"{settings.SUPABASE_URL}/rest/v1/lab_results?id=eq.{req.report_id}"
            patch_res = requests.patch(url, headers=headers, json={"is_verified": True}, timeout=5)
            if patch_res.status_code in (200, 204):
                db_updated = True
        except Exception as e:
            # Cryptographic verification still succeeded even if network update failed
            pass

    return {
        "valid": True,
        "algorithm": "ML-DSA-65 (NIST FIPS 204)",
        "message": "Cryptographic signature successfully validated against lattice public key.",
        "report_id": req.report_id,
        "database_updated": db_updated
    }


@router.get("/quantum/demo", tags=["QpiAI Quantum Demonstration"])
async def quantum_demonstration(qubits: int = 4):
    """Run QpiAI Quantum circuit demo and threat comparison."""
    return crypto_service.run_qpiai_quantum_demo(num_qubits=min(max(qubits, 2), 16))

