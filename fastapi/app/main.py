from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from typing import Optional
from database import *
from method import *
from func import *

import socketio

# Initalize SocketIO server with ASGI
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
socket_app = socketio.ASGIApp(sio ,socketio_path="/")

# Initialize FastAPI app with lifespan (database initialization)
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 Token Bearer for Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="access")

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # MySQL query transmission
# Search IoT device
@app.get("/search") 
async def search_device_route(
    request: Request,
    device_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    parameter_validation(request=request)
    return await search_device(device_id, skip, limit, db)

# Add new IoT device
@app.post("/create") 
async def create_device_route(device: DeviceData, db: AsyncSession = Depends(get_db)):
    return await create_device(device, db)

# Edit specific IoT device
@app.put("/update") 
async def update_device_route(request: Request, device_id: int, device_update: DeviceData, db: AsyncSession = Depends(get_db)):
    parameter_validation(request=request)
    return await update_device(device_id, device_update, db)

# Remove specific IoT device
@app.delete("/remove") 
async def delete_device_route(request: Request, device_id: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    parameter_validation(request=request)
    return await remove_device(device_id, db)

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # External Server Transmission
# Login
@app.post("/access")
async def access_token_route(form_data: OAuth2PasswordRequestForm = Depends()):
    return await access_token(form_data)

# Verify token
@app.get("/verify")
async def verify_token_route(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    return await verify_token(token)

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # SocketIO server Transmission
# Dictionary to track connected IoT devices
connected_iot_devices = {}

# IoT Device Namespace ("/iot")
@sio.on("connect", namespace="/iot")
async def connect_iot(sid, environ):
    device_id = environ.get('HTTP_DEVICE_ID')  # Get device ID from headers
    connected_iot_devices[device_id] = sid     # Track the device's socket ID
    print(f"IoT Device {device_id} connected with SID {sid}.")

@sio.on("disconnect", namespace="/iot")
async def disconnect_iot(sid):
    device_id = next((key for key, value in connected_iot_devices.items() if value == sid), None)
    if device_id:
        del connected_iot_devices[device_id]
    print(f"IoT Device {device_id} disconnected.")

@sio.on("iot_event", namespace="/iot")
async def iot_event(sid, data):
    print(f"Received data from IoT Device {sid}: {data}")
    # Handle data from IoT device if necessary

# AI Server Namespace ("/ai")
@sio.on("connect", namespace="/ai")
async def connect_ai(sid, environ):
    print(f"AI Server {sid} connected.")

@sio.on("ai_event", namespace="/ai")
async def ai_event(sid, data):
    print(f"Received command from AI Server {sid}: {data}")
    
    # Extract target IoT device and command from data
    target_device_id = data.get("device_id")
    command = data.get("command")
    
    # Check if target IoT device is connected
    if target_device_id in connected_iot_devices:
        target_sid = connected_iot_devices[target_device_id]
        
        # Send command to the specified IoT device
        await sio.emit("iot_command", {"command": command}, room=target_sid, namespace="/iot")
        print(f"Sent command to IoT Device {target_device_id}: {command}")
    else:
        print(f"IoT Device {target_device_id} is not connected.")

@sio.on("disconnect", namespace="/ai")
async def disconnect_ai(sid):
    print(f"AI Server {sid} disconnected.")

# Mount SocketIO app at "/ws" for WebSocket communication
app.mount("/ws", socket_app)