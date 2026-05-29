'use client';

import { Bell, AlertTriangle, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import type { Alert } from '@/types';

export default function Header() {
  const { metrics, alerts } = useStore();
  const [showAlerts, setShowAlerts] = useState(false);

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <header className="h-16 bg-[#060B17]/90 border-b border-primary/10 flex items-center justify-between px-6 z-40 relative">
      <div className="flex items-center gap-4">
        {metrics && (
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <div className="flex items-center gap-1.5">
              <span
                className={`status-dot ${
                  metrics.wan_status === 'online'
                    ? 'online'
                    : metrics.wan_status === 'degraded'
                    ? 'degraded'
                    : 'offline'
                }`}
              />
              <span>WAN:</span>
              <span
                className={`font-bold ${
                  metrics.wan_status === 'online'
                    ? 'text-success'
                    : metrics.wan_status === 'degraded'
                    ? 'text-warning'
                    : 'text-danger'
                }`}
              >
                {metrics.wan_status === 'online'
                  ? 'Online'
                  : metrics.wan_status === 'degraded'
                  ? 'Degradado'
                  : 'Offline'}
              </span>
            </div>
            <div className="text-slate-200">|</div>
            <div className="text-slate-500">
              Latência:{' '}
              <span className="text-white font-bold font-mono tracking-tighter text-sm ml-1">
                {metrics.latency}ms
              </span>
            </div>
            <div className="text-slate-200">|</div>
            <div className="text-slate-500">
              Perda:{' '}
              <span className="text-white font-bold font-mono tracking-tighter text-sm ml-1">
                {metrics.packet_loss}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 rounded-full hover:bg-[#060B17]/60 text-slate-500 hover:text-white transition-colors"
          >
            {criticalAlerts > 0 ? (
              <AlertTriangle size={18} className="text-warning animate-pulse" />
            ) : (
              <Bell size={18} />
            )}
            {criticalAlerts > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-danger text-[10px] flex items-center justify-center font-bold text-white shadow-sm">
                {criticalAlerts}
              </span>
            )}
          </button>

          {showAlerts && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowAlerts(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-96 glass-card border border-primary/10 rounded-xl z-50 max-h-96 overflow-y-auto p-2 shadow-lg">
                <div className="p-3 border-b border-primary/10 font-bold text-xs uppercase tracking-wider text-white">
                  Alertas do Sistema ({alerts.length})
                </div>
                {alerts.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs font-semibold uppercase">
                    Nenhum alerta ativo
                  </div>
                ) : (
                  alerts.slice(0, 10).map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <button className="p-2 rounded-full border border-primary/15 hover:bg-[#060B17]/60 text-slate-500 hover:text-slate-200 transition-colors">
          <LogOut size={16} />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-primary/10">
          <div className="w-8 h-8 rounded-lg bg-slate-950/60 text-slate-300 flex items-center justify-center text-xs font-bold font-mono shadow-sm">
            NV
          </div>
        </div>
      </div>
    </header>
  );
}

function AlertItem({ alert }: { alert: Alert }) {
  return (
    <div className="p-3 border-b border-primary/10 hover:bg-[#060B17]/60 transition-colors rounded-lg">
      <div className="flex items-start gap-2.5">
        <div
          className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
            alert.severity === 'critical'
              ? 'bg-danger'
              : alert.severity === 'warning'
              ? 'bg-warning'
              : 'bg-primary'
          }`}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-200 truncate">{alert.message}</p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
            {alert.device} · {new Date(alert.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
