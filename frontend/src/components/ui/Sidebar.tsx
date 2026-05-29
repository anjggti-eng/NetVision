'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Network,
  Wifi,
  Shield,
  Bot,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/topology', label: 'Topologia', icon: Network },
  { href: '/wifi', label: 'Wi-Fi Analytics', icon: Wifi },
  { href: '/security', label: 'Security Center', icon: Shield },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, metrics } = useStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#060B17]/90 border-r border-primary/10 transition-all duration-300 z-50 flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/10">
        {sidebarOpen && (
          <div className="flex items-center gap-2 pl-1">
            <span className="font-black text-sm text-white font-mono tracking-widest uppercase">
              Teste de Rede
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-[#060B17]/60 text-slate-500 hover:text-slate-200 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="flex-1 p-3 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-slate-500 hover:text-white hover:bg-[#060B17]/60'
              }`}
            >
              <Icon size={20} className="shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-semibold">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {sidebarOpen && (
        <div className="p-4 border-t border-primary/10 bg-[#060B17]/60/50 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Core Observability
          </div>
          
          {/* Telemetry panel */}
          {metrics && (
            <div className="space-y-1.5 text-[9px] font-mono text-slate-500 font-bold border-y border-primary/20/50 py-2 select-none">
              <div className="flex justify-between">
                <span>CPU CORE LOAD:</span>
                <span className="text-primary">{metrics.cpu_usage?.toFixed(1) ?? '0.0'}%</span>
              </div>
              <div className="flex justify-between">
                <span>SYSTEM MEMORY:</span>
                <span className="text-secondary">{metrics.memory_usage?.toFixed(1) ?? '42.5'}%</span>
              </div>
              <div className="flex justify-between">
                <span>RTT PING:</span>
                <span className="text-success">{metrics.latency ?? '0.0'}ms</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
            <span>CORE NODE</span>
            <span>v1.0.0</span>
          </div>
        </div>
      )}
    </aside>
  );
}
