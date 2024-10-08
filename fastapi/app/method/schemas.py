from pydantic import BaseModel

# 디바이스 데이터 스키마
class DeviceData(BaseModel):
    name: str
    description: str
    schedule: str
