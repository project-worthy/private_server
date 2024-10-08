from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from models import Device

# 특정 디바이스 삭제
async def remove_device(device_id: int, db: AsyncSession):
    device = await _get_device_by_id(device_id, db)
    await db.delete(device)
    await db.commit()
    return {"message": "Device removed successfully"}

# 특정 디바이스 조회 (삭제 전 확인)
async def _get_device_by_id(device_id: int, db: AsyncSession):
    result = await db.execute(select(Device).filter(Device.id == device_id))
    device = result.scalar_one_or_none()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return device
