import random
import time
from datetime import datetime, timedelta
from typing import Optional


class AlertEngine:
    def __init__(self):
        self.alert_history = []
        self.thresholds = {
            "cpu_max": 85,
            "latency_max": 150,
            "packet_loss_max": 5,
            "bandwidth_max": 900,
        }

    def evaluate(self, metrics: dict) -> Optional[dict]:
        alerts = []
        if metrics.get("cpu_usage", 0) > self.thresholds["cpu_max"]:
            alerts.append(self._create_alert("cpu_high", "critical", f"CPU em {metrics['cpu_usage']}%"))
        if metrics.get("latency", 0) > self.thresholds["latency_max"]:
            alerts.append(self._create_alert("latency", "warning", f"Latência de {metrics['latency']}ms"))
        if metrics.get("packet_loss", 0) > self.thresholds["packet_loss_max"]:
            alerts.append(self._create_alert("packet_loss", "critical", f"Perda de {metrics['packet_loss']}%"))
        if metrics.get("throughput_download", 0) > self.thresholds["bandwidth_max"]:
            alerts.append(self._create_alert("bandwidth", "warning", f"Banda de {metrics['throughput_download']}Mbps"))
        return alerts

    def _create_alert(self, alert_type: str, severity: str, message: str) -> dict:
        alert = {
            "id": f"alert-{int(time.time())}-{random.randint(1000, 9999)}",
            "type": alert_type,
            "severity": severity,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "acknowledged": False,
        }
        self.alert_history.append(alert)
        return alert
