from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from models import Device

# 여러 디바이스 삭제
async def remove_device(device_id: str, db: AsyncSession):
    device_ids = _parse_device_id(device_id)
    if device_ids:
        devices = await _get_devices_by_ids(device_ids, db)
        for device in devices:
            await db.delete(device)
        await db.commit()
        return {"message": f"Devices with IDs {device_ids} removed successfully"}
    else:
        raise HTTPException(status_code=400, detail="No valid device IDs provided")

# 디바이스 ID 파싱 (search.py와 동일한 방식)
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

# 여러 디바이스 조회 (삭제 전 확인)
async def _get_devices_by_ids(device_ids, db: AsyncSession):
    result = await db.execute(select(Device).filter(Device.id.in_(device_ids)))
    devices = result.scalars().all()
    if not devices:
        raise HTTPException(status_code=404, detail="No devices found with the given IDs")
    return devices
