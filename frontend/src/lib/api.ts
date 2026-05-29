import type {
  DashboardMetrics,
  Device,
  ThroughputPoint,
  TopologyData,
  WiFiClient,
  SecurityEvent,
  Alert,
  AIResponse,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  dashboard: {
    metrics: () => fetchJSON<DashboardMetrics>(`${BASE_URL}/api/dashboard/metrics`),
    devices: () => fetchJSON<Device[]>(`${BASE_URL}/api/dashboard/devices`),
    throughput: (minutes = 60) =>
      fetchJSON<ThroughputPoint[]>(`${BASE_URL}/api/dashboard/throughput?minutes=${minutes}`),
    alerts: () => fetchJSON<Alert[]>(`${BASE_URL}/api/dashboard/alerts`),
  },
  topology: {
    data: () => fetchJSON<TopologyData>(`${BASE_URL}/api/topology/data`),
    scan: (subnet = '192.168.1.0/24') =>
      fetchJSON(`${BASE_URL}/api/topology/scan?subnet=${subnet}`),
    ping: (ip: string) =>
      fetchJSON(`${BASE_URL}/api/topology/ping?ip=${ip}`),
  },
  wifi: {
    clients: () => fetchJSON<WiFiClient[]>(`${BASE_URL}/api/wifi/clients`),
    stats: () => fetchJSON(`${BASE_URL}/api/wifi/stats`),
  },
  security: {
    events: (limit = 50) =>
      fetchJSON<SecurityEvent[]>(`${BASE_URL}/api/security/events?limit=${limit}`),
    stats: () => fetchJSON(`${BASE_URL}/api/security/stats`),
  },
  ai: {
    chat: (message: string) =>
      fetchJSON<AIResponse>(`${BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      }),
  },
};
