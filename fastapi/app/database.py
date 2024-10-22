import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URLS = [
    "mysql+asyncmy://root:1234@mysql:3306/iot_device_db",       # docker network bridge
    "mysql+asyncmy://root:1234@localhost:3306/iot_device_db"    # docker host network
]

engines = [create_async_engine(url, echo=True) for url in DATABASE_URLS]
SessionLocals = [
    sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)
    for engine in engines
]
Base = declarative_base()

async def init_db(delay=5, retries=12): # 1 min
    for n in range(retries):
        tasks = []
        for engine in engines:
            tasks.append(init_connection(engine))

        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for idx, result in enumerate(results):
            if isinstance(result, Exception):
                print(f"INFO:     Connection failed to {DATABASE_URLS[idx]}. ({n + 1}) \n{result}", flush=True)
            else:
                print(f"INFO:     Connected to {DATABASE_URLS[idx]} and tables created.", flush=True)
                return

        print(f"INFO:     Retrying all connections in {delay} seconds...", flush=True)
        await asyncio.sleep(delay)

    print("ERROR:    All connection attempts failed.", flush=True)
    exit(1)

async def init_connection(engine):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    """둘 중 하나의 데이터베이스에 연결하여 세션을 반환.""" 
    for SessionLocal in SessionLocals:
        async with SessionLocal() as db:
            try:
                yield db
                return
            except Exception as e:
                print(f"WARNING:  Failed to get DB session. {e}", flush=True)
