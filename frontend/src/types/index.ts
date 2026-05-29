export interface Device {
  id: string;
  name: string;
  ip: string;
  type: string;
  status: string;
  uptime: string;
  cpu: number;
  memory: number;
  last_seen: string;
}

export interface DashboardMetrics {
  devices_online: number;
  devices_total: number;
  wan_status: string;
  throughput_download: number;
  throughput_upload: number;
  cpu_usage: number;
  memory_usage: number;
  packet_loss: number;
  latency: number;
}

export interface ThroughputPoint {
  timestamp: string;
  download: number;
  upload: number;
}

export interface TopologyNode {
  id: string;
  label: string;
  type: string;
  status: string;
  ip: string;
  x: number;
  y: number;
}

export interface TopologyLink {
  source: string;
  target: string;
  type: string;
  speed: string;
  status: string;
}

export interface TopologyData {
  nodes: TopologyNode[];
  links: TopologyLink[];
}

export interface WiFiClient {
  id: string;
  mac: string;
  name: string;
  ssid: string;
  rssi: number;
  channel: number;
  band: string;
  connected_at: string;
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: string;
  source_ip: string;
  destination: string;
  timestamp: string;
  description: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: string;
  message: string;
  device: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface AIResponse {
  reply: string;
  confidence: number;
  suggestions: string[];
}

export interface StreamUpdate {
  metrics: DashboardMetrics;
  device_count: number;
  alerts_count: number;
  timestamp: string;
}
