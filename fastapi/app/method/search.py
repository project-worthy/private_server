from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from models import Device

# 디바이스 리스트 조회
async def search_device(device_id: str, skip: int, limit: int, db: AsyncSession):
    device_ids = _parse_device_id(device_id)
    if device_ids:
        return await _get_devices_by_ids(device_ids, db)
    else:
        return await _get_all_devices(skip, limit, db)

# 디바이스 ID 파싱
def _parse_device_id(device_id: str):
    if device_id is None:
        return set()

    device_ids = set()
    ranges = device_id.split(",")
    for range_str in ranges:
        if '-' in range_str:
            start, end = range_str.split('-')
            try:
                start, end = int(start), int(end)
                device_ids.update(range(start, end + 1))
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid range format. Use 'start-end'.")
        else:
            try:
                device_ids.add(int(range_str))
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid device_id format.")
    return device_ids

# 여러 디바이스 조회
async def _get_devices_by_ids(device_ids, db: AsyncSession):
    result = await db.execute(select(Device).filter(Device.id.in_(device_ids)))
    devices = result.scalars().all()
    if not devices:
        raise HTTPException(status_code=404, detail="No devices found with the given IDs")
    return devices

# 전체 디바이스 조회
async def _get_all_devices(skip: int, limit: int, db: AsyncSession):
    result = await db.execute(select(Device).offset(skip).limit(limit))
    devices = result.scalars().all()
    if not devices:
        return {"message": "Device not exist in Database"}
    return devices
