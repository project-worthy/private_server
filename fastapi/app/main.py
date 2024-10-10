from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from database import init_db, get_db
from typing import Optional
from method import *
#import socketio

# init server application
# sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
# socket_app = socketio.ASGIApp(sio)
app = FastAPI()

# cors policy control
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define function `lifespan`
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)

# Search IoT device
@app.get("/search") 
async def search_device_route(
    request: Request,
    device_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    if request.query_params: # parameter validation
        invalid_params = [param for param in request.query_params if param != "device_id" and param not in ["skip", "limit"]]
        if invalid_params:
            raise HTTPException(status_code=400, detail=f"Invalid query parameter(s): {', '.join(invalid_params)}")
        
    return await search_device(device_id, skip, limit, db)

# Add new IoT device
@app.post("/create") 
async def create_device_route(device: DeviceData, db: AsyncSession = Depends(get_db)):
    return await create_device(device, db)

# Edit specific IoT device
@app.put("/update") 
async def update_device_route(request: Request, device_id: int, device_update: DeviceData, db: AsyncSession = Depends(get_db)):
    if request.query_params: # parameter validation
        invalid_params = [param for param in request.query_params if param != "device_id" and param not in ["skip", "limit"]]
        if invalid_params:
            raise HTTPException(status_code=400, detail=f"Invalid query parameter(s): {', '.join(invalid_params)}")
        
    return await update_device(device_id, device_update, db)

# Remove specific IoT device
@app.delete("/remove") 
async def delete_device_route(request: Request, device_id: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    if request.query_params: # parameter validation
        invalid_params = [param for param in request.query_params if param != "device_id" and param not in ["skip", "limit"]]
        if invalid_params:
            raise HTTPException(status_code=400, detail=f"Invalid query parameter(s): {', '.join(invalid_params)}")
        
    return await remove_device(device_id, db)

# # client connect event
# @sio.event
# async def connect(sid, etc):
#     print(f"INFO:     Client {sid} connected")

# # client disconnect event
# @sio.event
# async def disconnect(sid):
#     print(f"INFO:     Client {sid} disconnected")

# # mounted socketio app to FastAPI app (path: "/ws")
# app.mount("/ws", socket_app) 