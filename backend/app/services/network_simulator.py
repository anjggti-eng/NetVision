import random
import math
import time
from datetime import datetime, timedelta


DEVICES = [
    {"id": "mikrotik-01", "name": "MikroTik CCR1072", "ip": "192.168.1.1", "type": "router"},
    {"id": "mikrotik-02", "name": "MikroTik RB4011", "ip": "192.168.1.2", "type": "router"},
    {"id": "switch-01", "name": "Switch Core CRS326", "ip": "192.168.1.10", "type": "switch"},
    {"id": "switch-02", "name": "Switch Access CRS328", "ip": "192.168.1.11", "type": "switch"},
    {"id": "switch-03", "name": "Switch Distribution CRS317", "ip": "192.168.1.12", "type": "switch"},
    {"id": "ap-01", "name": "AP Omada EAP670", "ip": "192.168.2.10", "type": "ap"},
    {"id": "ap-02", "name": "AP Omada EAP660", "ip": "192.168.2.11", "type": "ap"},
    {"id": "ap-03", "name": "AP Omada EAP245", "ip": "192.168.2.12", "type": "ap"},
    {"id": "ap-04", "name": "AP Omada EAP225", "ip": "192.168.2.13", "type": "ap"},
    {"id": "server-01", "name": "DNS Server", "ip": "192.168.1.20", "type": "server"},
    {"id": "server-02", "name": "DHCP Server", "ip": "192.168.1.21", "type": "server"},
    {"id": "server-03", "name": "NVR Storage", "ip": "192.168.1.22", "type": "server"},
    {"id": "fw-01", "name": "Firewall FortiGate", "ip": "192.168.1.254", "type": "firewall"},
]

TOPOLOGY_EDGES = [
    ("mikrotik-01", "switch-01"), ("mikrotik-01", "switch-02"),
    ("mikrotik-01", "fw-01"), ("mikrotik-02", "switch-02"),
    ("switch-01", "switch-03"), ("switch-02", "switch-03"),
    ("switch-01", "server-01"), ("switch-01", "server-02"),
    ("switch-02", "server-03"), ("switch-03", "ap-01"),
    ("switch-03", "ap-02"), ("switch-02", "ap-03"),
    ("switch-01", "ap-04"), ("mikrotik-01", "mikrotik-02"),
]


class NetworkSimulator:
    def __init__(self):
        self.start_time = time.time()
        self.device_states = {d["id"]: True for d in DEVICES}
        self.history = {d["id"]: {"cpu": [], "throughput": []} for d in DEVICES}

    def get_devices(self):
        now = datetime.now()
        results = []
        for d in DEVICES:
            online = self.device_states[d["id"]]
            results.append({
                **d,
                "status": "online" if online else "offline",
                "uptime": self._generate_uptime(online),
                "cpu": round(random.uniform(5, 85), 1) if online else 0,
                "memory": round(random.uniform(20, 90), 1) if online else 0,
                "last_seen": (now - timedelta(seconds=random.randint(0, 30))).isoformat(),
            })
        return results

    def get_dashboard_metrics(self):
        online = sum(1 for v in self.device_states.values() if v)
        total = len(DEVICES)
        return {
            "devices_online": online,
            "devices_total": total,
            "wan_status": random.choices(["online", "degraded", "offline"], weights=[0.85, 0.12, 0.03])[0],
            "throughput_download": round(random.uniform(100, 950), 1),
            "throughput_upload": round(random.uniform(20, 200), 1),
            "cpu_usage": round(random.uniform(15, 75), 1),
            "memory_usage": round(random.uniform(30, 85), 1),
            "packet_loss": round(random.uniform(0, 3), 2),
            "latency": round(random.uniform(1, 40), 1),
        }

    def get_throughput_history(self, minutes=60):
        now = datetime.now()
        points = []
        for i in range(minutes):
            t = now - timedelta(minutes=minutes - i)
            base_dl = 500 + 200 * math.sin(i / 10) + random.gauss(0, 50)
            base_ul = 100 + 40 * math.sin(i / 12) + random.gauss(0, 20)
            points.append({
                "timestamp": t.isoformat(),
                "download": round(max(0, base_dl), 1),
                "upload": round(max(0, base_ul), 1),
            })
        return points

    def get_topology(self):
        nodes = []
        for d in DEVICES:
            online = self.device_states[d["id"]]
            nodes.append({
                "id": d["id"],
                "label": d["name"],
                "type": d["type"],
                "status": "online" if online else "offline",
                "ip": d["ip"],
                "x": random.uniform(5, 95),
                "y": random.uniform(5, 95),
            })
        links = []
        for src, tgt in TOPOLOGY_EDGES:
            src_online = self.device_states.get(src, False)
            tgt_online = self.device_states.get(tgt, False)
            links.append({
                "source": src,
                "target": tgt,
                "type": random.choice(["fiber", "copper", "uplink"]),
                "speed": random.choice(["1Gbps", "10Gbps", "100Mbps"]),
                "status": "up" if (src_online and tgt_online) else "down",
            })
        return {"nodes": nodes, "links": links}

    def get_wifi_clients(self):
        now = datetime.now()
        clients = []
        for i in range(random.randint(8, 25)):
            clients.append({
                "id": f"client-{i:03d}",
                "mac": f"AA:BB:CC:{random.randint(0x10, 0xFF):02X}:{random.randint(0x00, 0xFF):02X}:{random.randint(0x00, 0xFF):02X}",
                "name": random.choice([
                    "Note-Lucas", "iPhone-Paula", "Android-Carlos",
                    "iPad-Gerencia", "Note-Vendas", "Desktop-Financeiro",
                    "Note-TI", "iPhone-Diretoria", "Android-Suporte",
                    "Note-RH", "Desktop-Dev", "MacBook-Design",
                ]),
                "ssid": random.choice(["CorpNet", "CorpNet-5G", "Guest-WiFi"]),
                "rssi": random.randint(-75, -30),
                "channel": random.choice([1, 6, 11, 36, 40, 44, 48, 149, 153, 157, 161]),
                "band": random.choice(["2.4GHz", "5GHz", "6GHz"]),
                "connected_at": (now - timedelta(minutes=random.randint(1, 480))).isoformat(),
            })
        return clients

    def get_security_events(self, limit=50):
        now = datetime.now()
        event_types = [
            ("firewall_hit", "info"),
            ("brute_force", "critical"),
            ("port_scan", "warning"),
            ("blocked_ip", "warning"),
            ("dns_query", "info"),
            ("vpn_connect", "info"),
            ("anomaly", "critical"),
        ]
        events = []
        for i in range(limit):
            etype, severity = random.choice(event_types)
            sev_roll = random.random()
            if sev_roll < 0.1:
                severity = "critical"
            elif sev_roll < 0.3:
                severity = "warning"
            else:
                severity = "info"
            events.append({
                "id": f"evt-{int(time.time())}-{i:04d}",
                "type": etype,
                "severity": severity,
                "source_ip": f"{random.randint(10, 223)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}",
                "destination": random.choice([
                    "MikroTik CCR1072", "DNS Server", "Web Server",
                    "Mail Server", "Firewall FortiGate",
                ]),
                "timestamp": (now - timedelta(seconds=random.randint(0, 3600))).isoformat(),
                "description": random.choice([
                    f"Porta {random.randint(1, 65535)} bloqueada",
                    f"Tentativa de login inválida #{random.randint(1, 100)}",
                    f"Escaneamento de porta detectado de {random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}",
                    f"IP externo bloqueado por comportamento suspeito",
                    f"Conexão VPN estabelecida com tunnel {random.randint(1, 10)}",
                    f"Tráfego anômalo detectado no protocolo {random.choice(['TCP/443', 'UDP/53', 'TCP/22', 'ICMP'])}",
                    f"Requisição DNS para domínio malicioso detectada",
                ]),
            })
        return sorted(events, key=lambda e: e["timestamp"], reverse=True)

    def get_alerts(self):
        now = datetime.now()
        alert_types = [
            ("latency", "warning"),
            ("packet_loss", "critical"),
            ("device_offline", "critical"),
            ("bandwidth", "warning"),
            ("cpu_high", "warning"),
            ("security", "critical"),
        ]
        alerts = []
        for i in range(random.randint(3, 8)):
            atype, severity = random.choice(alert_types)
            device = random.choice(DEVICES)
            alerts.append({
                "id": f"alert-{int(time.time())}-{i}",
                "type": atype,
                "severity": severity,
                "message": {
                    "latency": f"Latência alta detectada em {device['name']}: {random.randint(100, 500)}ms",
                    "packet_loss": f"Perda de pacotes em {device['name']}: {random.uniform(5, 30):.1f}%",
                    "device_offline": f"Dispositivo {device['name']} offline",
                    "bandwidth": f"Banda excedida em {device['name']}: {random.randint(800, 2000)}Mbps",
                    "cpu_high": f"CPU elevada em {device['name']}: {random.randint(80, 99)}%",
                    "security": f"Ataque detectado originado de {random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}",
                }[atype],
                "device": device["name"],
                "timestamp": (now - timedelta(seconds=random.randint(0, 900))).isoformat(),
                "acknowledged": random.random() < 0.3,
            })
        return sorted(alerts, key=lambda a: a["timestamp"], reverse=True)

    def get_stream_update(self):
        return {
            "metrics": self.get_dashboard_metrics(),
            "device_count": sum(1 for v in self.device_states.values() if v),
            "alerts_count": len(self.get_alerts()),
            "timestamp": datetime.now().isoformat(),
        }

    def _generate_uptime(self, online):
        if not online:
            return "0s"
        seconds = int(time.time() - self.start_time) + random.randint(86400, 2592000)
        days = seconds // 86400
        hours = (seconds % 86400) // 3600
        return f"{days}d {hours}h"


simulator = NetworkSimulator()

