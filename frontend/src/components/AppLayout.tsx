'use client';

import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { useStore } from '@/store/useStore';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useStore();

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      {/* Global High-Tech Scanning sweep and scanlines */}
      <div className="scanline" />
      <div className="tech-sweep" />
      
      <Sidebar />
      <div
        className="min-h-screen transition-all duration-300 relative z-10"
        style={{ paddingLeft: sidebarOpen ? '16rem' : '4rem' }}
      >
        <Header />
        <main className="p-6 relative z-10">{children}</main>
      </div>
    </div>
  );
}
