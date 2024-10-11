from jose import jwt
from typing import Optional
from datetime import datetime, timedelta, timezone

def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    if user and user["password"] == password:
        return user
    return None

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta if expires_delta else datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

fake_users_db = {
    "user1": {
        "username": "user1",
        "password": "password1"
    }
}

SECRET_KEY = "project_worthy"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MIN = 30