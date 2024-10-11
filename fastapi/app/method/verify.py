from jose import JWTError
from login import *
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer


async def verify_token(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"message": "Token is valid", "username": username}