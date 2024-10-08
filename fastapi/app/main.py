from fastapi import FastAPI, HTTPException, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import init_db, get_db
from typing import Optional
from method import *

app = FastAPI()

@app.get("/search") # IoT 장비 정보 탐색
async def search_device_route(
    request: Request,
    device_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    if request.query_params: # 파라미터 유효성 검사
        invalid_params = [param for param in request.query_params if param != "device_id" and param not in ["skip", "limit"]]
        if invalid_params:
            raise HTTPException(status_code=400, detail=f"Invalid query parameter(s): {', '.join(invalid_params)}")
    return await search_device(device_id, skip, limit, db)

@app.post("/create") # 새 IoT 장비 추가
async def create_device_route(device: DeviceData, db: AsyncSession = Depends(get_db)):
    return await create_device(device, db)

@app.put("/update/{device_id}") # 특정 IoT 장비 정보 수정
async def update_device_route(device_id: int, device_update: DeviceData, db: AsyncSession = Depends(get_db)):
    return await update_device(device_id, device_update, db)

@app.delete("/remove/{device_id}") # 특정 IoT 장비 삭제
async def delete_device_route(device_id: int, db: AsyncSession = Depends(get_db)):
    return await remove_device(device_id, db)

@app.on_event("startup")
async def on_startup():
    await init_db()
