import asyncio
import json
from fastapi import WebSocket
from typing import Set


class WebSocketManager:
    def __init__(self):
        self.connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.connections.discard(websocket)

    async def broadcast(self, message: dict):
        dead = set()
        for ws in self.connections:
            try:
                await ws.send_json(message)
            except Exception:
                dead.add(ws)
        self.connections -= dead

    async def stream_metrics(self, simulator):
        while True:
            try:
                update = simulator.get_stream_update()
                await self.broadcast(update)
                await asyncio.sleep(2)
            except Exception:
                await asyncio.sleep(2)
