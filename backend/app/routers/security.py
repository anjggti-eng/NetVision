from fastapi import APIRouter, Query
from ..services.network_simulator import simulator

router = APIRouter(prefix="/api/security", tags=["security"])


@router.get("/events")
async def get_events(limit: int = Query(50)):
    return simulator.get_security_events(limit)


@router.get("/stats")
async def get_security_stats():
    events = simulator.get_security_events(100)
    return {
        "total_events": len(events),
        "by_severity": {
            "critical": sum(1 for e in events if e["severity"] == "critical"),
            "warning": sum(1 for e in events if e["severity"] == "warning"),
            "info": sum(1 for e in events if e["severity"] == "info"),
        },
        "by_type": {
            etype: sum(1 for e in events if e["type"] == etype)
            for etype in set(e["type"] for e in events)
        },
    }
