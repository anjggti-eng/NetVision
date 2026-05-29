'use client';

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Ban, Activity } from 'lucide-react';
import MetricCard from '@/components/ui/MetricCard';
import SecurityTimeline from '@/components/charts/SecurityTimeline';
import { api } from '@/lib/api';
import type { SecurityEvent } from '@/types';
import AppLayout from '@/components/AppLayout';

export default function SecurityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    api.security.events(100).then(setEvents).catch(console.error);
    api.security.stats().then(setStats).catch(console.error);
  }, []);

  const filteredEvents =
    filter === 'all' ? events : events.filter((e) => e.severity === filter);

  const timelineData = [
    { time: '00h', critical: 2, warning: 5, info: 12 },
    { time: '04h', critical: 0, warning: 3, info: 8 },
    { time: '08h', critical: 4, warning: 8, info: 15 },
    { time: '12h', critical: 1, warning: 6, info: 20 },
    { time: '16h', critical: 3, warning: 10, info: 18 },
    { time: '20h', critical: 5, warning: 7, info: 14 },
  ];

  const severityColors: Record<string, string> = {
    critical: 'bg-danger/10 text-danger border-danger/20 font-bold',
    warning: 'bg-warning/10 text-warning border-warning/20 font-bold',
    info: 'bg-primary/10 text-primary border-primary/20 font-bold',
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-lg font-black text-white tracking-wider flex items-center gap-2 font-mono">
            <span>SYS NODE // SECURITY CENTER</span>
            <span className="text-danger bg-danger/10 px-2 py-0.5 rounded text-xs font-bold font-mono">DEFENSE-01</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
            Inspeção de Pacotes, Detecção de Intrusão e Análise de Segurança // HUD LAYER
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Eventos"
            value={stats?.total_events ?? events.length}
            icon={<Shield size={20} />}
            color="primary"
          />
          <MetricCard
            title="Críticos"
            value={stats?.by_severity?.critical ?? 0}
            icon={<AlertTriangle size={20} />}
            color="danger"
          />
          <MetricCard
            title="Alertas"
            value={stats?.by_severity?.warning ?? 0}
            icon={<Ban size={20} />}
            color="warning"
          />
          <MetricCard
            title="Informativo"
            value={stats?.by_severity?.info ?? 0}
            icon={<Activity size={20} />}
            color="secondary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />
            <div className="hud-bracket-bl" />
            <div className="hud-bracket-br" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-mono">
              Timeline de Eventos (24h)
            </h3>
            <div className="h-64">
              <SecurityTimeline data={timelineData} />
            </div>
          </div>

          <div className="glass-card p-5 relative overflow-hidden">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />
            <div className="hud-bracket-bl" />
            <div className="hud-bracket-br" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-mono">
              Distribuição por Severidade
            </h3>
            <div className="space-y-4">
              {['critical', 'warning', 'info'].map((severity) => {
                const count = stats?.by_severity?.[severity] ?? 0;
                const total = stats?.total_events ?? 1;
                const pct = (count / total) * 100;
                return (
                  <div key={severity}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500 font-mono capitalize">
                        {severity === 'critical'
                          ? 'Crítico'
                          : severity === 'warning'
                          ? 'Alerta'
                          : 'Info'}
                      </span>
                      <span className="text-slate-200 font-mono font-bold">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          severity === 'critical'
                            ? 'bg-danger'
                            : severity === 'warning'
                            ? 'bg-warning'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-5 relative overflow-hidden">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />
            <div className="hud-bracket-bl" />
            <div className="hud-bracket-br" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-mono">
              Eventos por Tipo
            </h3>
            <div className="space-y-2">
              {stats?.by_type &&
                Object.entries(stats.by_type).map(([type, count]) => (
                  <div
                    key={type}
                    className="flex justify-between items-center p-2.5 rounded-lg bg-[#060B17]/60 border border-primary/10 font-mono"
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      {type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{count as number}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-5 relative overflow-hidden">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Threat Operations Feed ({filteredEvents.length})
            </h3>
            <div className="flex gap-1 bg-[#060B17]/60 p-1 rounded-lg border border-primary/10">
              {(['all', 'critical', 'warning', 'info'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${
                    filter === s
                      ? 'bg-[#0A1020]/95 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s === 'all' ? 'Todos' : s === 'critical' ? 'Crítico' : s === 'warning' ? 'Alerta' : 'Info'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {filteredEvents.slice(0, 20).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#060B17]/60 border border-primary/10 hover:bg-slate-950/60/50 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    event.severity === 'critical'
                      ? 'bg-danger'
                      : event.severity === 'warning'
                      ? 'bg-warning'
                      : 'bg-primary'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">{event.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-mono font-medium">{event.source_ip}</span>
                    <span className="text-xs text-slate-300">→</span>
                    <span className="text-xs text-slate-500 font-mono font-medium">{event.destination}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[9px] px-2.5 py-0.5 rounded-full border ${
                      severityColors[event.severity]
                    }`}
                  >
                    {event.severity === 'critical'
                      ? 'CRÍTICO'
                      : event.severity === 'warning'
                      ? 'ALERTA'
                      : 'INFO'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-semibold">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
