# main.py

import asyncio
from typing import Optional
from fastapi import FastAPI, HTTPException, WebSocket, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String
from pydantic import BaseModel

# MySQL 데이터베이스 URL: asyncmy 사용
DATABASE_URL = "mysql+asyncmy://root:1234@mysql:3306/iot_devices_db"


engine = create_async_engine(DATABASE_URL, echo=True) # Async SQLAlchemy 엔진 생성
SessionLocal = sessionmaker( # AsyncSession을 위한 세션 생성
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)
Base = declarative_base() # 베이스 클래스 생성 (모든 ORM 클래스가 이 클래스를 상속받음)
app = FastAPI() # FastAPI 앱 생성


# ORM 모델 정의 (IoT 장비 정보를 담는 테이블)
class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(String(255))
    schedule = Column(String(255))


# 디바이스 정보 데이터
class DeviceData(BaseModel):
    name: str
    description: str
    schedule: str


# 데이터베이스 테이블 생성 함수 (재시도 기능 포함)
async def init_db(delay=5):
    while True:
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
                print("INFO:     Database connection successful and table creation complete.")
                
                break  # 성공 시 루프 탈출

        except Exception as e:
            print(f"INFO:     Database connection failure. ({e})")
            print(f"INFO:     Retrying in {delay} seconde...")
            await asyncio.sleep(delay)  # 재시도 전 대기


# 비동기 데이터베이스 세션 생성 함수
async def get_db():
    async with SessionLocal() as db:
        try:
            yield db

        finally:
            await db.close()


# 모든 디바이스 리스트 조회
@app.get("/devices")
async def read_devices(
    request: Request,
    device_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    # 쿼리 파라미터가 있는지 확인
    if request.query_params: # 쿼리 파라미터 유효성 검사
        invalid_params = [param for param in request.query_params if param != "device_id" and param not in ["skip", "limit"]]
        if invalid_params:
            raise HTTPException(status_code=400, detail=f"Invalid query parameter(s): {', '.join(invalid_params)}")

    if device_id: # '1,2,3' 형태로 들어온 문자열을 파싱하여 리스트로 변환
        device_ids = [int(id) for id in device_id.split(",")]
        # 여러 개의 디바이스 정보 조회
        result = await db.execute(select(Device).filter(Device.id.in_(device_ids)))
        devices = result.scalars().all()
        if not devices:
            raise HTTPException(status_code=404, detail="No devices found with the given IDs")
        
        return devices
    
    else:
        # 모든 디바이스 리스트 조회
        result = await db.execute(select(Device).offset(skip).limit(limit))
        devices = result.scalars().all()
        if not devices:
            return {"message": "Device not exist in Database"}
        
        return devices

# 새로운 디바이스 추가
@app.post("/create")
async def create_device(device: DeviceData, db: AsyncSession = Depends(get_db)):
    db_device = Device(name=device.name, description=device.description, schedule=device.schedule)
    db.add(db_device)
    await db.commit()
    await db.refresh(db_device)

    return db_device


# 특정 디바이스 정보 수정
@app.put("/update/{device_id}")
async def update_device(device_id: int, device_update: DeviceData, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Device).filter(Device.id == device_id))
    device = result.scalar_one_or_none()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device.name = device_update.name
    device.description = device_update.description
    device.schedule = device_update.schedule
    await db.commit()
    await db.refresh(device)

    return device


# 특정 디바이스 삭제
@app.delete("/remove/{device_id}")
async def delete_device(device_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Device).filter(Device.id == device_id))
    device = result.scalar_one_or_none()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    
    await db.delete(device)
    await db.commit()

    return {"message": "Device deleted successfully"}


# IoT 디바이스 웹소켓 통신
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        print(f"Message received: {data}")
        await websocket.send_text(f"Message text was: {data}")


# 앱 시작 시 데이터베이스 초기화
@app.on_event("startup")
async def on_startup():
    await init_db()

# execute code: uvicorn main:app --host 0.0.0.0 --port 8000
