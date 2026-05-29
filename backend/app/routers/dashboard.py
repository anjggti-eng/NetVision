from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..services.network_simulator import simulator
from ..websocket.manager import WebSocketManager

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])
ws_manager = WebSocketManager()


@router.get("/metrics")
async def get_metrics():
    return simulator.get_dashboard_metrics()


@router.get("/devices")
async def get_devices():
    return simulator.get_devices()


@router.get("/throughput")
async def get_throughput(minutes: int = 60):
    return simulator.get_throughput_history(minutes)


@router.get("/alerts")
async def get_alerts():
    return simulator.get_alerts()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
