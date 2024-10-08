from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from models import Device
from method.schemas import DeviceData

# 특정 디바이스 정보 수정
async def update_device(device_id: int, device_update: DeviceData, db: AsyncSession):
    device = await _get_device_by_id(device_id, db)
    device.name = device_update.name
    device.description = device_update.description
    device.schedule = device_update.schedule
    await db.commit()
    await db.refresh(device)
    return device

# 특정 디바이스 조회
async def _get_device_by_id(device_id: int, db: AsyncSession):
    result = await db.execute(select(Device).filter(Device.id == device_id))
    device = result.scalar_one_or_none()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return device
