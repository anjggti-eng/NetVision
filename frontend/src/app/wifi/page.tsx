'use client';

import { useEffect, useState } from 'react';
import { Wifi, Signal, Radio, Users } from 'lucide-react';
import MetricCard from '@/components/ui/MetricCard';
import WiFiClientsChart from '@/components/charts/WiFiClientsChart';
import { api } from '@/lib/api';
import type { WiFiClient } from '@/types';
import AppLayout from '@/components/AppLayout';

export default function WiFiPage() {
  const [clients, setClients] = useState<WiFiClient[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.wifi.clients().then(setClients).catch(console.error);
    api.wifi.stats().then(setStats).catch(console.error);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Wi-Fi Analytics</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
            Telemetria de clientes sem fio, RSSI e distribuição por banda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Clientes Conectados"
            value={stats?.total_clients ?? clients.length}
            icon={<Wifi size={20} />}
            color="primary"
            trend="up"
            trendValue={`${stats?.by_band?.['5GHz'] ?? 0} em 5GHz`}
          />
          <MetricCard
            title="RSSI Médio"
            value={stats?.avg_rssi ?? 0}
            unit="dBm"
            icon={<Signal size={20} />}
            color={Math.abs(stats?.avg_rssi ?? 0) > 65 ? 'warning' : 'success'}
          />
          <MetricCard
            title="2.4GHz"
            value={stats?.by_band?.['2.4GHz'] ?? 0}
            icon={<Radio size={20} />}
            color="secondary"
          />
          <MetricCard
            title="5/6GHz"
            value={(stats?.by_band?.['5GHz'] ?? 0) + (stats?.by_band?.['6GHz'] ?? 0)}
            icon={<Users size={20} />}
            color="primary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />
            <div className="hud-bracket-bl" />
            <div className="hud-bracket-br" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-mono">Distribuição RSSI (Sinal dBm)</h3>
            <div className="h-64">
              <WiFiClientsChart clients={clients} />
            </div>
          </div>

          <div className="glass-card p-5 relative overflow-hidden">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />
            <div className="hud-bracket-bl" />
            <div className="hud-bracket-br" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-mono">Distribuição por SSID</h3>
            <div className="space-y-4">
              {stats?.by_ssid &&
                Object.entries(stats.by_ssid).map(([ssid, count]) => (
                  <div key={ssid}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500 font-mono">{ssid}</span>
                      <span className="text-slate-200 font-mono font-bold">{count as number}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse-slow"
                        style={{
                          width: `${((count as number) / (clients.length || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="glass-card p-5 relative overflow-hidden">
            <div className="hud-bracket-tl" />
            <div className="hud-bracket-tr" />
            <div className="hud-bracket-bl" />
            <div className="hud-bracket-br" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-mono">Distribuição por Banda</h3>
            <div className="space-y-4">
              {['2.4GHz', '5GHz', '6GHz'].map((band) => {
                const count = stats?.by_band?.[band] ?? 0;
                const pct = clients.length > 0 ? (count / clients.length) * 100 : 0;
                return (
                  <div key={band}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500 font-mono">{band}</span>
                      <span className="text-slate-200 font-mono font-bold">{count} clientes</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          band === '2.4GHz'
                            ? 'bg-warning'
                            : band === '5GHz'
                            ? 'bg-primary'
                            : 'bg-secondary'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="glass-card p-5 relative overflow-hidden">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />
          
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-mono">
            Connected Wireless Nodes Registry ({clients.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase border-b border-primary/10 text-left">
                  <th className="py-3 pr-4 font-semibold">Dispositivo</th>
                  <th className="py-3 pr-4 font-semibold">MAC</th>
                  <th className="py-3 pr-4 font-semibold">SSID</th>
                  <th className="py-3 pr-4 font-semibold">RSSI</th>
                  <th className="py-3 pr-4 font-semibold">Canal</th>
                  <th className="py-3 pr-4 font-semibold">Banda</th>
                  <th className="py-3 pr-4 font-semibold">Conectado há</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-primary/10 hover:bg-[#060B17]/60 transition-colors">
                    <td className="py-3 pr-4 font-medium text-slate-200 font-semibold">
                      <div className="flex items-center gap-2">
                        <Signal size={14} className="text-primary" />
                        <span>{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-500 font-mono">{client.mac}</td>
                    <td className="py-3 pr-4 text-slate-500 font-medium">{client.ssid}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`font-mono font-semibold ${
                          client.rssi > -50
                            ? 'text-success'
                            : client.rssi > -65
                            ? 'text-warning'
                            : 'text-danger'
                        }`}
                      >
                        {client.rssi} dBm
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-500 font-mono font-medium">{client.channel}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold ${
                          client.band === '2.4GHz'
                            ? 'bg-warning/10 text-warning'
                            : client.band === '5GHz'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary/10 text-secondary'
                        }`}
                      >
                        {client.band}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-500 font-medium">
                      {Math.floor(
                        (Date.now() - new Date(client.connected_at).getTime()) / 60000
                      )}{' '}
                      min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
