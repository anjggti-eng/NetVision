'use client';

import { useState } from 'react';
import NetworkTopology from '@/components/topology/NetworkTopology';
import { api } from '@/lib/api';
import { Search, Radio, Wifi } from 'lucide-react';
import AppLayout from '@/components/AppLayout';

export default function TopologyPage() {
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [subnet, setSubnet] = useState('192.168.1.0/24');
  const [pingIp, setPingIp] = useState('192.168.1.1');
  const [pingResult, setPingResult] = useState<any>(null);

  const handleScan = async () => {
    setScanning(true);
    try {
      const result = await api.topology.scan(subnet);
      setScanResults(result);
    } catch (e) {
      console.error(e);
    }
    setScanning(false);
  };

  const handlePing = async () => {
    try {
      const result = await api.topology.ping(pingIp);
      setPingResult(result);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-lg font-black text-white tracking-wider flex items-center gap-2 font-mono">
            <span>SYS NODE // TOPOLOGY</span>
            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs font-bold font-mono">MAP-01</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
            Mapeamento Dinâmico de Topologia e Roteamento // INTERACTIVE HUD LAYER
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="glass-card p-5 relative overflow-hidden">
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />
              <NetworkTopology />
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />
              
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
                <Radio size={12} className="text-primary animate-pulse" />
                ICMP Ping Telemetry
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  value={pingIp}
                  onChange={(e) => setPingIp(e.target.value)}
                  className="w-full bg-[#060B17]/60 border border-primary/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primary/50 font-mono"
                  placeholder="IP do dispositivo"
                />
                <button
                  onClick={handlePing}
                  className="w-full bg-primary/10 text-primary text-xs font-bold px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors font-mono"
                >
                  TRANSMIT PING
                </button>
                {pingResult && (
                  <div className="text-[10px] space-y-1.5 mt-2 p-2.5 bg-[#060B17]/60 border border-primary/10 rounded-lg font-mono">
                    <div className="flex justify-between text-slate-500">
                      <span>STATUS:</span>
                      <span className={pingResult.alive ? 'text-success font-bold' : 'text-danger font-bold'}>
                        {pingResult.alive ? 'ACTIVE / ALIVE' : 'INACTIVE / TIMEOUT'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>RTT LATENCY:</span>
                      <span className="text-white font-bold">{pingResult.latency_ms} ms</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>PACKET LOSS:</span>
                      <span className="text-danger font-bold">{pingResult.packet_loss_pct}%</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>PACKET TTL:</span>
                      <span className="text-white font-bold">{pingResult.ttl}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-4 relative overflow-hidden">
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />
              
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
                <Search size={12} className="text-primary" />
                Subnet Scan Discovery
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  value={subnet}
                  onChange={(e) => setSubnet(e.target.value)}
                  className="w-full bg-[#060B17]/60 border border-primary/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primary/50 font-mono"
                  placeholder="Subnet"
                />
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full bg-primary/10 text-primary text-xs font-bold px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 font-mono"
                >
                  {scanning ? 'SCANNING MESH...' : 'START SCAN'}
                </button>
                {scanResults.length > 0 && (
                  <div className="mt-2 max-h-48 overflow-y-auto space-y-1.5">
                    {scanResults.map((device, i) => (
                      <div key={i} className="p-2.5 bg-[#060B17]/60 border border-primary/10 rounded-lg text-[10px] font-mono relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            <span className="text-slate-200 font-bold">{device.hostname}</span>
                          </div>
                          <span className="text-[8px] text-slate-500 uppercase">{device.vendor}</span>
                        </div>
                        <div className="text-slate-500 mt-0.5">{device.ip}</div>
                        <div className="text-[8px] text-slate-500 mt-0.5">{device.os}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
