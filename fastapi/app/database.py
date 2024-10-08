import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+asyncmy://root:1234@mysql:3306/iot_device_db"

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)
Base = declarative_base()

async def init_db(delay=5):
    while True:
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
                print("INFO:     Database connection successful and table creation complete.")
                break
        except Exception as e:
            print(f"INFO:     Database connection failure. ({e})")
            print(f"INFO:     Retrying in {delay} seconds...")
            await asyncio.sleep(delay)

async def get_db():
    async with SessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()
