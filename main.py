from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel as bm
from typing import List
from datetime import datetime as td, timedelta as dt, timezone as tz
from jose import JWTError, jwt

# JWT 토큰 인코딩/디코딩을 위한 비밀 키
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()

# 토큰 기반 인증을 위한 OAuth2 스킴
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# 샘플 데이터 모델
class Item(bm):
    id: int
    name: str
    description: str

# 메모리 내 데이터베이스 시뮬레이션
fake_items_db = [
    {"id": 1, "name": "Item 1", "description": "Description for Item 1"},
    {"id": 2, "name": "Item 2", "description": "Description for Item 2"},
]

# 토큰 생성 함수
def create_access_token(data: dict, expires_delta: dt = None):
    to_encode = data.copy()
    if expires_delta:
        expire = td.now(tz=tz.utc) + expires_delta
    else:
        expire = td.now(tz=tz.utc) + dt(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 현재 사용자 정보를 가져오는 의존성
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="자격 증명을 확인할 수 없습니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = payload.get("sub")
        if user is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return user

# 로그인 엔드포인트: 토큰을 얻기 위한
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # 간단히, 모든 사용자 이름/비밀번호로 토큰을 생성
    access_token_expires = dt(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": form_data.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

# 인증이 필요한 아이템 조회 API 엔드포인트
@app.get("/items/", response_model=List[Item])
async def read_items(token: str = Depends(oauth2_scheme)):
    return fake_items_db

# IoT 장비와의 통신을 위한 예제 엔드포인트
@app.post("/iot/send-data/")
async def send_data_to_iot(data: Item, current_user: str = Depends(get_current_user)):
    # 여기서 IoT 장비에 데이터를 전송하는 로직을 구현
    return {"message": f"데이터가 IoT 장비에 전송되었습니다: {data.name}"}
