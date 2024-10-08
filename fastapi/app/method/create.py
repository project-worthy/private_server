from sqlalchemy.ext.asyncio import AsyncSession
from models import Device
from method.schemas import DeviceData

# 새로운 디바이스 추가
async def create_device(device: DeviceData, db: AsyncSession):
    db_device = Device(name=device.name, description=device.description, schedule=device.schedule)
    db.add(db_device)
    await db.commit()
    await db.refresh(db_device)
    return db_device
