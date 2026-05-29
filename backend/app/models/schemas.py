from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Device(BaseModel):
    id: str
    name: str
    ip: str
    type: str
    status: str
    uptime: str
    cpu: float
    memory: float
    last_seen: str


class ThroughputPoint(BaseModel):
    timestamp: str
    download: float
    upload: float


class DashboardMetrics(BaseModel):
    devices_online: int
    devices_total: int
    wan_status: str
    throughput_download: float
    throughput_upload: float
    cpu_usage: float
    packet_loss: float
    latency: float


class TopologyNode(BaseModel):
    id: str
    label: str
    type: str
    status: str
    ip: str
    x: float
    y: float


class TopologyLink(BaseModel):
    source: str
    target: str
    type: str
    speed: str
    status: str


class TopologyData(BaseModel):
    nodes: list[TopologyNode]
    links: list[TopologyLink]


class WiFiClient(BaseModel):
    id: str
    mac: str
    name: str
    ssid: str
    rssi: int
    channel: int
    band: str
    connected_at: str


class SecurityEvent(BaseModel):
    id: str
    type: str
    severity: str
    source_ip: str
    destination: str
    timestamp: str
    description: str


class Alert(BaseModel):
    id: str
    type: str
    severity: str
    message: str
    device: str
    timestamp: str
    acknowledged: bool


class AIRequest(BaseModel):
    message: str


class AIResponse(BaseModel):
    reply: str
    confidence: float
    suggestions: list[str]
