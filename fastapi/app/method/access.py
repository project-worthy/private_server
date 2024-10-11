from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from login import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MIN


async def access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MIN)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}