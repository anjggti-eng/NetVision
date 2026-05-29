from fastapi import APIRouter, Query
from ..services.network_simulator import simulator
from ..services.device_discovery import DeviceDiscoveryService

router = APIRouter(prefix="/api/topology", tags=["topology"])
discovery = DeviceDiscoveryService()


@router.get("/data")
async def get_topology():
    return simulator.get_topology()


@router.get("/scan")
async def scan_subnet(subnet: str = Query("192.168.1.0/24")):
    return discovery.scan_subnet(subnet)


@router.get("/ping")
async def ping_device(ip: str = Query("192.168.1.1")):
    return discovery.ping(ip)
