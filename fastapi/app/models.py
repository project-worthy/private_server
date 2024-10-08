from sqlalchemy import Column, Integer, String
from database import Base

class Device(Base):
    __tablename__ = "device"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(String(255))
    schedule = Column(String(255))
