import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .routers import dashboard, topology, wifi, security, ai
from .services.network_simulator import simulator
from .websocket.manager import WebSocketManager

ws_manager = dashboard.ws_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(ws_manager.stream_metrics(simulator))
    yield
    task.cancel()


app = FastAPI(
    title="NetVision AI",
    description="Plataforma de Observabilidade para Redes Corporativas",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(topology.router)
app.include_router(wifi.router)
app.include_router(security.router)
app.include_router(ai.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
