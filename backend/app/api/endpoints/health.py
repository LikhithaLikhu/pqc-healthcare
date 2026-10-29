import requests
from fastapi import APIRouter
from app.core.config import settings
from app.services.crypto_service import crypto_service

router = APIRouter()

@router.get("/health", tags=["System Health"])
async def health_check():
    """
    Health check endpoint returning system status, post-quantum engines,
    and live Supabase PostgreSQL connectivity.
    """
    capabilities = crypto_service.get_capabilities()
    db_connected = False
    
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        try:
            headers = {
                "apikey": settings.SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}"
            }
            # Fast ping to Supabase rest schema
            res = requests.get(f"{settings.SUPABASE_URL}/rest/v1/", headers=headers, timeout=3)
            db_connected = (res.status_code == 200)
        except Exception:
            db_connected = False

    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "cryptographic_engines": capabilities,
        "database_connected": db_connected
    }
