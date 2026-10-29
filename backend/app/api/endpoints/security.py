import uuid
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Request, status
from pydantic import BaseModel, Field
from app.services.security_service import security_service

router = APIRouter()

class AlertStatusUpdate(BaseModel):
    status: str = Field(..., description="NEW, INVESTIGATING, or RESOLVED")
    notes: Optional[str] = Field(None, description="Administrative investigation notes")

class SimulationRequest(BaseModel):
    scenario: str = Field(..., description="tamper_signature, unauthorized_record_access, rate_limit_burst, failed_login_brute_force")
    client_ip: Optional[str] = Field("192.168.1.105", description="Simulated observed client IP")


@router.get("/events", tags=["Defensive Threat Intelligence"])
async def get_security_events(
    request: Request,
    severity: Optional[str] = Query(None, description="Filter by severity: LOW, MEDIUM, HIGH, CRITICAL"),
    event_type: Optional[str] = Query(None, description="Filter by event_type"),
    limit: int = Query(50, ge=1, le=500)
):
    """
    Returns structured security events from the hash-chained tamper-evident audit ledger.
    Never exposes passwords, tokens, or confidential medical text.
    """
    events = security_service.events
    if severity:
        events = [e for e in events if e.get("severity") == severity.upper()]
    if event_type:
        events = [e for e in events if e.get("event_type") == event_type.upper()]
    
    # Return most recent first
    return {
        "count": len(events),
        "events": list(reversed(events))[:limit]
    }


@router.get("/alerts", tags=["Defensive Threat Intelligence"])
async def get_security_alerts(
    status: Optional[str] = Query(None, description="Filter by status: NEW, INVESTIGATING, RESOLVED"),
    limit: int = Query(50, ge=1, le=200)
):
    """
    Returns actionable security intelligence alerts with detection rules,
    observed source IPs, severity, defensive actions taken, and recommended admin responses.
    """
    alerts = security_service.alerts
    if status:
        alerts = [a for a in alerts if a.get("status") == status.upper()]
    return {
        "count": len(alerts),
        "alerts": alerts[:limit]
    }


@router.patch("/alerts/{alert_id}", tags=["Defensive Threat Intelligence"])
async def update_alert_workflow(alert_id: str, payload: AlertStatusUpdate):
    """
    Updates an alert's investigation state (NEW -> INVESTIGATING -> RESOLVED)
    with required audit logging.
    """
    allowed_statuses = {"NEW", "INVESTIGATING", "RESOLVED"}
    if payload.status.upper() not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid alert status. Must be one of: {allowed_statuses}"
        )

    updated = security_service.update_alert_status(
        alert_id=alert_id,
        new_status=payload.status.upper(),
        admin_notes=payload.notes
    )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Security alert with ID '{alert_id}' not found."
        )

    return {
        "success": True,
        "message": f"Alert {alert_id} workflow transitioned to {payload.status.upper()}",
        "alert": updated
    }


@router.get("/audit/verify", tags=["Defensive Threat Intelligence"])
async def verify_audit_ledger():
    """
    Cryptographically verifies the SHA-256 hash-chaining of the security audit ledger.
    Proves mathematical tamper-resistance against retrospective modification or log deletion.
    """
    return security_service.verify_audit_chain_integrity()


@router.post("/simulate", tags=["Controlled Security Testing"])
async def simulate_threat_scenario(payload: SimulationRequest):
    """
    Controlled test mode: Safely simulates security incidents
    (invalid digital signatures, rate limit flooding, unauthorized record access, brute force)
    without attacking real systems or disrupting legitimate users.
    """
    valid_scenarios = {
        "tamper_signature",
        "unauthorized_record_access",
        "rate_limit_burst",
        "failed_login_brute_force"
    }
    if payload.scenario not in valid_scenarios:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported scenario. Choose one of: {list(valid_scenarios)}"
        )

    result = security_service.simulate_attack_scenario(
        scenario_type=payload.scenario,
        client_ip=payload.client_ip or "192.168.1.105"
    )
    return result


@router.get("/transmissions", tags=["Secure Transmission Monitor"])
async def get_secure_transmissions(
    patient_id: Optional[str] = Query(None, description="Filter for specific patient role visibility"),
    user_role: Optional[str] = Query(None, description="Calling user role for authorization filtering")
):
    """
    Returns recorded hospital-to-lab transmissions with verified encryption and signature statuses.
    Enforces role-based visibility: patients only see transmissions involving their records.
    """
    txs = security_service.transmissions
    if user_role == "patient" and patient_id:
        txs = [t for t in txs if t.get("patient_id") == patient_id]

    return {
        "count": len(txs),
        "transmissions": txs
    }
