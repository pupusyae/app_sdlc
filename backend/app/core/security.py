from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
import base64
import hashlib
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _get_fernet() -> Fernet:
    key = hashlib.sha256(settings.ENCRYPTION_KEY.encode()).digest()
    return Fernet(base64.urlsafe_b64encode(key))


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_jwt(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_jwt(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])


def encrypt_api_key(api_key: str) -> str:
    f = _get_fernet()
    return f.encrypt(api_key.encode()).decode()


def decrypt_api_key(encrypted: str) -> str:
    if not encrypted:
        return ""
    f = _get_fernet()
    return f.decrypt(encrypted.encode()).decode()
