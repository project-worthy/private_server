from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from typing import Optional, Dict
from database import *
from method import *
from func import *

import socketio

# Initalize SocketIO server with ASGI
sio = socketio.AsyncServer(
    async_mode="asgi", 
    cors_allowed_origins="*", 
    transports=["websocket", "polling"],
    logger=True, 
    engineio_logger=True
)
socket_app = socketio.ASGIApp(sio ,socketio_path="/")

# Initialize FastAPI app with lifespan (database initialization)
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:7000",
    "http://mindou.pe.kr"
]

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 Token Bearer for Authorization
SECRET_KEY = "project_worthy"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Dictionary to track connected IoT devices
connected_iot_devices = {}

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
# 쿠키 또는 헤더에서 JWT 토큰 추출하는 함수
def get_token(request: Request) -> str:
    token = request.cookies.get("access_token")  # 쿠키에서 토큰 추출
    if not token:
        auth_header = request.headers.get("Authorization")  # 헤더 확인
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]  # 'Bearer ' 이후의 토큰 부분 추출
        else:
            print("INFO:     Missing Token", flush=True)
            raise HTTPException(status_code=401, detail="Missing token")
    return token

# JWT 토큰 검증 함수
def verify_token(token: str) -> Dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            print("INFO:     Invalid Token", flush=True)
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload  # 검증된 payload 반환
    except JWTError:
        print("INFO:     Invalid or expired Token", flush=True)
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# /secure 엔드포인트: 인증된 사용자만 접근 가능
@app.get("/secure")
async def secure_route(request: Request):
    token = get_token(request)  # 쿠키 또는 헤더에서 JWT 추출
    payload = verify_token(token)  # 토큰 검증 및 디코딩
    print(f"INFO:     Payload: {payload}", flush=True)
    return {"message": f"Hello {payload['sub']}, you have access to this route!"}

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # SocketIO server Transmission
# IoT device namespace handlers
@sio.event(namespace="/iot")
async def connect(sid, environ):
    device_id = environ.get('HTTP_DEVICE_ID')  # Get device ID from headers
    connected_iot_devices[device_id] = sid     # Track the device's socket ID
    print(f"INFO:     IoT Device {device_id} connected with SID {sid}.", flush=True)

    # query_string = environ.get('QUERY_STRING', '')
    # params = dict(param.split('=') for param in query_string.split('&'))
    # device_id = params.get('device_id', f'unknown-{sid}')
    # connected_iot_devices[device_id] = sid
    # print(f"INFO:     IoT Device({device_id}) connected with SID({sid}).")
    # await sio.emit("ack", {"message": "Connection successful!"}, to=sid, namespace="/iot")
    # print(f"INFO:     IoT Device connected with SID({sid}).")

@sio.event(namespace="/iot")
async def disconnect(sid):
    device_id = next((key for key, value in connected_iot_devices.items() if value == sid), None)
    if device_id:
        del connected_iot_devices[device_id]
    print(f"INFO:     IoT Device {device_id} disconnected.", flush=True)

@sio.on("iot_event", namespace="/iot")
async def iot_event(sid, data):
    print(f"INFO:     Received data from IoT Device {sid}: {data}", flush=True)
    await sio.emit("iot_event", "turn_off", namespace="/iot")

# Example of emitting data to all connected devices
# async def broadcast_to_all_devices(event, message):
#     for sid in connected_iot_devices.items():
#         await sio.emit(event, message, to=sid, namespace="/iot")

# AI Server Namespace ("/ai")
@sio.event(namespace="/ai")
async def connect_ai(sid, environ):
    print(f"INFO:     AI Server {sid} connected.", flush=True)

@sio.event(namespace="/ai")
async def disconnect_ai(sid):
    print(f"INFO:     AI Server {sid} disconnected.", flush=True)

@sio.on("ai_event", namespace="/ai")
async def ai_event(sid, data):
    print(f"INFO:     Received command from AI Server {sid}: {data}", flush=True)
    
    # Extract target IoT device and command from data
    target_device_id = data.get("device_id")
    command = data.get("command")
    
    # Check if target IoT device is connected
    if target_device_id in connected_iot_devices:
        target_sid = connected_iot_devices[target_device_id]
        
        # Send command to the specified IoT device
        await sio.emit("iot_command", {"command": command}, room=target_sid, namespace="/iot")
        print(f"INFO:     Sent command to IoT Device {target_device_id}: {command}", flush=True)
    else:
        print(f"INFO:     IoT Device {target_device_id} is not connected.", flush=True)

# Mount SocketIO app at "/ws" for WebSocket communication
app.mount("/ws", socket_app)