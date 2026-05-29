from fastapi import APIRouter
from ..services.network_simulator import simulator

router = APIRouter(prefix="/api/wifi", tags=["wifi"])


@router.get("/clients")
async def get_wifi_clients():
    return simulator.get_wifi_clients()


@router.get("/stats")
async def get_wifi_stats():
    clients = simulator.get_wifi_clients()
    total = len(clients)
    rssi_values = [c["rssi"] for c in clients]
    return {
        "total_clients": total,
        "avg_rssi": round(sum(rssi_values) / len(rssi_values), 1) if rssi_values else 0,
        "by_band": {
            "2.4GHz": sum(1 for c in clients if c["band"] == "2.4GHz"),
            "5GHz": sum(1 for c in clients if c["band"] == "5GHz"),
            "6GHz": sum(1 for c in clients if c["band"] == "6GHz"),
        },
        "by_ssid": {
            ssid: sum(1 for c in clients if c["ssid"] == ssid)
            for ssid in set(c["ssid"] for c in clients)
        },
    }
