'use client';

import { useEffect, useState } from 'react';
import {
  Monitor,
  Activity,
  ArrowDownUp,
  Cpu,
  AlertTriangle,
  Server,
  Settings,
  ArrowUpRight,
  Shield,
  Layers,
  Radio,
  Zap,
} from 'lucide-react';
import MetricCard from '@/components/ui/MetricCard';
import ThroughputChart from '@/components/charts/ThroughputChart';
import RadialGauge from '@/components/charts/RadialGauge';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import type { ThroughputPoint, Device } from '@/types';
import AppLayout from '@/components/AppLayout';

export default function DashboardPage() {
  const { metrics, alerts } = useStore();
  const [throughput, setThroughput] = useState<ThroughputPoint[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeTab, setActiveTab] = useState<'cpu' | 'interface'>('interface');
  const [deviceListTab, setDeviceListTab] = useState<'all' | 'online' | 'offline'>('all');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[SYS] OBSERVABILITY KERNEL ACTIVE",
    "[NET] IP GATEWAY ADDRESS LISTENING ON PORT 8291",
    "[SYS] CORE PROCESSOR NOMINAL STATUS SYNCED"
  ]);

  useEffect(() => {
    api.dashboard.throughput(60).then(setThroughput).catch(console.error);
    api.dashboard.devices().then(setDevices).catch(console.error);
  }, []);

  // Update Console Log Feed every 2 seconds matching the WS stream
  useEffect(() => {
    const logTemplates = [
      () => `[INFO] WS metric updated. DL: ${metrics?.throughput_download ?? 96}M / UL: ${metrics?.throughput_upload ?? 20}M`,
      () => `[SYS] health evaluated: ${metrics?.devices_online ?? 6}/${metrics?.devices_total ?? 12} nodes nominal`,
      () => `[SEC] FortiGate firewall synced. Event status: SECURE`,
      () => `[PING] core ping RTT: ${metrics?.latency ?? 6.6}ms, loss: 0%`,
      () => `[WIFI] EAP670 clients RSSI avg: ${metrics?.latency ? -Math.round(55 + metrics.latency / 8) : -60}dBm`,
      () => `[ALERT] checking logs: 0 critical / ${alerts.length} warnings active`
    ];

    const interval = setInterval(() => {
      const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      setConsoleLogs((prev) => {
        const next = [...prev, template()];
        if (next.length > 5) {
          next.shift();
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [metrics, alerts]);

  const filteredDevices = devices.filter((d) => {
    if (deviceListTab === 'online') return d.status === 'online';
    if (deviceListTab === 'offline') return d.status === 'offline';
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-white tracking-wider flex items-center gap-2 font-mono">
              <span>SYS NODE // ACTIVE</span>
              <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs font-bold font-mono">SYS-01</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
              Sistema de Observabilidade de Infraestrutura // HUD LAYER
            </p>
          </div>
          {metrics && (
            <div className="flex items-center gap-2 text-xs font-semibold bg-[#0A1020]/95 border border-primary/10 px-3 py-1.5 rounded-full shadow-sm">
              <span className="status-dot online animate-pulse" />
              <span className="text-slate-500 font-mono">
                {metrics.devices_online}/{metrics.devices_total} CORE ONLINE
              </span>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT SECTION (Col Span 8) */}
          <div className="lg:col-span-8 flex flex-col justify-between gap-6">
            
            {/* Condition Monitoring Card (Main Chart Panel) */}
            <div className="glass-card p-6 flex flex-col justify-between flex-1 relative overflow-hidden">
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={12} className="text-primary" />
                    Network Health Index
                  </h3>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                    SYS CHECK // {new Date().toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  
                  {/* Small Info Badges */}
                  <div className="flex gap-6 mt-4">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Uptime</span>
                      <span className="text-xs font-bold text-slate-200 font-mono">2D 36h</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Status</span>
                      <span className="text-xs font-bold text-success font-mono uppercase">Nominal</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Nós Ativos</span>
                      <span className="text-xs font-bold text-slate-200 font-mono">{metrics?.devices_total ?? 12}</span>
                    </div>
                  </div>
                </div>

                {/* Big Digital Index Score */}
                <div className="text-right flex items-baseline gap-1 bg-[#060B17]/60 border border-primary/10 px-3.5 py-1.5 rounded-xl relative">
                  <span className="text-5xl font-black text-white font-mono tracking-tighter leading-none">
                    92
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    NHI
                  </span>
                </div>
              </div>

              {/* Dotted Grid Throughput Chart */}
              <div className="mt-4 flex-1 flex items-end">
                <ThroughputChart data={throughput} />
              </div>
            </div>

            {/* Bottom Row: 3 Split Cards (Grid md:cols-3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
              
              {/* Card 1: Device preview card */}
              <div className="glass-card p-5 flex items-center justify-between hover:glow-border transition-all duration-300">
                <div className="hud-bracket-tl" />
                <div className="hud-bracket-tr" />
                <div className="hud-bracket-bl" />
                <div className="hud-bracket-br" />
                
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    Core Router
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono">
                    CON // 120S RTT
                  </p>
                  <h4 className="text-xs font-bold text-slate-200 mt-2 font-mono">
                    CCR1072 GATEWAY
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3">
                    <span className="status-dot online animate-pulse" />
                    <span className="font-semibold text-slate-500 text-[10px] uppercase">Normal</span>
                  </div>
                </div>

                {/* Render the vertical vented device model */}
                <div className="w-12 h-16 bg-[#060B17]/60 border border-primary/10 rounded-lg shadow-inner flex flex-col justify-center gap-1.5 p-2 relative overflow-hidden shrink-0">
                  <div className="flex-1 flex flex-col gap-1 items-center justify-center">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-0.5 bg-slate-800 rounded-sm transform -rotate-12 shadow-sm"
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-success border border-white shadow-sm" />
                </div>
              </div>

              {/* Card 2: Live Observability Console Log Feed */}
              <div className="bg-[#050914] border border-primary/20 rounded-2xl p-4 h-[126px] flex flex-col justify-between shadow-[inset_0_0_15px_rgba(0,229,255,0.12)] relative overflow-hidden">
                <div className="hud-bracket-tl" />
                <div className="hud-bracket-tr" />
                <div className="hud-bracket-bl" />
                <div className="hud-bracket-br" />
                
                <div className="flex justify-between items-center border-b border-primary/10 pb-1 z-10">
                  <span className="text-[8px] font-bold text-primary tracking-widest uppercase font-mono">
                    Observability Console Logs
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                </div>
                
                <div className="flex-1 flex flex-col justify-end gap-1.5 mt-2 font-mono text-[7px] text-slate-500 select-none pointer-events-none z-10 leading-tight">
                  {consoleLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-1">
                      <span className="text-primary font-bold">&gt;</span>
                      <span className={index === consoleLogs.length - 1 ? 'text-primary' : 'text-slate-500'}>{log}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Subnet Terrain scanner card */}
              <div className="bg-primary text-white p-5 rounded-2xl flex flex-col justify-between hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 relative overflow-hidden h-[126px]">
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">
                      Gateway Subnet
                    </span>
                    <p className="text-[9px] text-white/50 font-mono">
                      PING CYCLE // 10S
                    </p>
                    <h4 className="text-xs font-bold mt-2 font-mono">
                      192.168.1.0/24 MAIN
                    </h4>
                  </div>
                  <button className="p-1.5 rounded-full bg-[#0A1020]/95/10 hover:bg-[#0A1020]/95/20 text-white transition-colors">
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                {/* 3D terrain wireframe SVG mesh */}
                <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-45 z-0">
                  <svg viewBox="0 0 200 80" className="w-full h-full">
                    <ellipse cx="100" cy="65" rx="80" ry="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                    <ellipse cx="100" cy="65" rx="50" ry="9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                    <ellipse cx="100" cy="65" rx="20" ry="4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                    <path d="M10,65 L190,65 M20,55 L180,55 M30,45 L170,45 M40,35 L160,35 M50,25 L150,25" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                    <path d="M10,65 L80,15 M50,65 L90,15 M100,65 L100,15 M150,65 L110,15 M190,65 L120,15" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                    <path d="M25,65 Q55,20 85,60 T145,50 T175,65" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.75" />
                    <path d="M15,65 Q45,15 80,50 T135,35 T185,65" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
                    <line x1="100" y1="65" x2="100" y2="20" stroke="#FFFFFF" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
                    <circle cx="100" cy="20" r="2.5" fill="#FFFFFF" />
                  </svg>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SECTION (Col Span 4) */}
          <div className="lg:col-span-4 flex">
            
            {/* Specs Card */}
            <div className="glass-card p-5 relative overflow-hidden flex flex-col justify-between flex-grow">
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />
              
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-black text-white tracking-wider uppercase">System Core</h2>
                  <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-success uppercase tracking-widest font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span>SYS SECURE // NOMINAL</span>
                  </div>
                </div>
              </div>

              {/* Glowing Blue Isometric 3D Wireframe Router SVG (Image 4 styling) */}
              <div className="my-6 border border-primary/10 bg-[#060B17]/60 rounded-xl p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.02)] flex justify-center items-center relative h-40">
                <svg viewBox="0 0 200 150" className="w-full h-full text-primary">
                  {/* Concentric levitation scanner grid lines */}
                  <ellipse cx="100" cy="120" rx="75" ry="18" fill="none" stroke="rgba(0, 82, 255, 0.1)" strokeWidth="1" />
                  <ellipse cx="100" cy="120" rx="55" ry="13" fill="none" stroke="rgba(0, 82, 255, 0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <ellipse cx="100" cy="120" rx="30" ry="7" fill="none" stroke="rgba(0, 82, 255, 0.3)" strokeWidth="0.5" />
                  <line x1="100" y1="120" x2="100" y2="105" stroke="rgba(0, 82, 255, 0.2)" strokeWidth="0.75" strokeDasharray="1.5 1.5" />

                  {/* Isometric Router Chassis */}
                  {/* Top Face */}
                  <polygon points="50,90 100,68 150,90 100,112" fill="#FFFFFF" stroke="#0052FF" strokeWidth="1.5" />
                  {/* Left Front Face */}
                  <polygon points="50,90 100,112 100,124 50,102" fill="rgba(255,255,255,0.05)" stroke="#0052FF" strokeWidth="1.5" />
                  {/* Right Front Face */}
                  <polygon points="100,112 150,90 150,102 100,124" fill="#1E293B" stroke="#0052FF" strokeWidth="1.5" />

                  {/* Isometric Antennas (3 upright poles) */}
                  {/* Left Antenna */}
                  <g transform="translate(68, 80)">
                    <line x1="0" y1="0" x2="0" y2="-45" stroke="#0052FF" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="0" y1="0" x2="0" y2="-45" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75" strokeLinecap="round" />
                  </g>
                  {/* Center Antenna */}
                  <g transform="translate(100, 72)">
                    <line x1="0" y1="0" x2="0" y2="-52" stroke="#0052FF" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="0" y1="0" x2="0" y2="-52" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75" strokeLinecap="round" />
                  </g>
                  {/* Right Antenna */}
                  <g transform="translate(132, 80)">
                    <line x1="0" y1="0" x2="0" y2="-45" stroke="#0052FF" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="0" y1="0" x2="0" y2="-45" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75" strokeLinecap="round" />
                  </g>

                  {/* Front-Right status indicator LEDs */}
                  <circle cx="110" cy="116.5" r="1.5" fill="#10B981" />
                  <circle cx="120" cy="112" r="1.5" fill="#0052FF" />
                  <circle cx="130" cy="107.5" r="1.5" fill="#0052FF" />
                  <circle cx="140" cy="103" r="1.5" fill="#F59E0B" />
                </svg>
              </div>

              {/* Tag Specifications Grid */}
              <div className="grid grid-cols-2 gap-2 z-10">
                <div className="bg-[#060B17]/60 border border-primary/10 rounded-lg p-2 text-center">
                  <span className="text-[8px] font-bold text-slate-500 block uppercase tracking-wider">Device IP</span>
                  <span className="text-[10px] font-bold text-slate-300 font-mono">192.168.1.1</span>
                </div>
                <div className="bg-[#060B17]/60 border border-primary/10 rounded-lg p-2 text-center">
                  <span className="text-[8px] font-bold text-slate-500 block uppercase tracking-wider">Model ID</span>
                  <span className="text-[10px] font-bold text-slate-300 font-mono">CCR1072</span>
                </div>
                <div className="bg-[#060B17]/60 border border-primary/10 rounded-lg p-2 text-center">
                  <span className="text-[8px] font-bold text-slate-500 block uppercase tracking-wider">Firmware</span>
                  <span className="text-[10px] font-bold text-slate-300 font-mono">v7.12.1</span>
                </div>
                <div className="bg-[#060B17]/60 border border-primary/10 rounded-lg p-2 text-center">
                  <span className="text-[8px] font-bold text-slate-500 block uppercase tracking-wider">Serial ID</span>
                  <span className="text-[10px] font-bold text-slate-300 font-mono">7C14-EF12</span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex bg-[#060B17]/60 rounded-xl p-1 mt-4 border border-primary/10">
                <button
                  onClick={() => setActiveTab('cpu')}
                  className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors ${
                    activeTab === 'cpu'
                      ? 'bg-[#0A1020]/95 text-white shadow-sm border border-primary/10'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  CPU telemetry
                </button>
                <button
                  onClick={() => setActiveTab('interface')}
                  className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors ${
                    activeTab === 'interface'
                      ? 'bg-[#0A1020]/95 text-white shadow-sm border border-primary/10'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Port telemetry
                </button>
              </div>

              {/* Interactive Performance Arc Area */}
              <div className="mt-4 flex-1 flex flex-col justify-center items-center">
                {activeTab === 'interface' ? (
                  <>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center max-w-[200px] mb-2 leading-relaxed font-mono">
                      PORT SPEED // STABLE RANGE
                    </p>
                    <RadialGauge
                      value={metrics?.throughput_download ?? 96.4}
                      max={150}
                      unit="Mbps"
                      subLabel="Download Speed"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center max-w-[200px] mb-2 leading-relaxed font-mono">
                      CPU CORES // NOMINAL LOAD
                    </p>
                    <RadialGauge
                      value={metrics?.cpu_usage ?? 42.5}
                      max={100}
                      unit="%"
                      subLabel="CPU Utilization"
                    />
                  </>
                )}
              </div>

              {/* Latency & Temperature Card Row */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#060B17]/60 border border-primary/10 rounded-xl p-3 flex flex-col justify-between shadow-sm">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    SYS LATENCY
                  </span>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-slate-200 font-mono">
                      {metrics?.latency ?? 6.6}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 ml-0.5 font-mono">MS</span>
                  </div>
                </div>
                {/* Glowing Amber Temperature Card (Light mode) */}
                <div className="bg-primary text-white rounded-xl p-3 flex flex-col justify-between shadow-sm shadow-primary/20">
                  <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider font-mono">
                    CORE TEMP
                  </span>
                  <div className="mt-2">
                    <span className="text-xl font-bold font-mono">
                      42.5
                    </span>
                    <span className="text-[9px] font-bold text-white/80 ml-0.5 font-mono">°C</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Detailed Devices Table */}
        <div className="glass-card p-6">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Connected Nodes Registry
            </h3>
            <div className="flex gap-1 bg-[#060B17]/60 p-1 rounded-lg border border-primary/10">
              {(['all', 'online', 'offline'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDeviceListTab(tab)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${
                    deviceListTab === tab
                      ? 'bg-[#0A1020]/95 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab === 'all' ? 'Todos' : tab === 'online' ? 'Online' : 'Offline'}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase border-b border-primary/10 text-left font-semibold">
                  <th className="py-3 pr-4">Node Address</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">Host IP</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">CPU Load</th>
                  <th className="py-3 pr-4">Memory Load</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="border-b border-primary/10 hover:bg-[#060B17]/60 transition-colors">
                    <td className="py-3 pr-4 font-bold text-slate-200">
                      <div className="flex items-center gap-2">
                        <Server size={14} className="text-slate-500" />
                        <span>{device.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-500 capitalize">{device.type}</td>
                    <td className="py-3 pr-4 text-slate-500 font-mono font-medium">{device.ip}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1.5 font-semibold ${
                          device.status === 'online' ? 'text-success' : 'text-danger'
                        }`}
                      >
                        <span className={`status-dot ${device.status}`} />
                        <span className="uppercase text-[9px] tracking-wider">{device.status}</span>
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-950/60 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              device.cpu > 80
                                ? 'bg-danger'
                                : device.cpu > 50
                                ? 'bg-warning'
                                : 'bg-success'
                            }`}
                            style={{ width: `${device.cpu}%` }}
                          />
                        </div>
                        <span className="text-slate-500 font-mono font-bold text-[10px]">
                          {device.cpu}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-950/60 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${device.memory}%` }}
                          />
                        </div>
                        <span className="text-slate-500 font-mono font-bold text-[10px]">
                          {device.memory}%
                        </span>
                      </div>
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
