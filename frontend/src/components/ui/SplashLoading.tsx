'use client';

import { useEffect, useState } from 'react';
import { Network } from 'lucide-react';

export default function SplashLoading({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2; // ~0.75 seconds total
      });
    }, 15);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 300); // Wait for fade transition
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-[#040712] flex flex-col items-center justify-center z-[99999] transition-opacity duration-500 ${
        progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Pulsing Logo Icon with Outer Orbit */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_40px_rgba(0,82,255,0.5)] animate-pulse">
            <Network size={32} className="text-white" />
          </div>
          {/* External rotating orbit ring */}
          <div className="absolute -inset-4 border border-dashed border-primary/30 rounded-full animate-[spin_8s_linear_infinite]" />
        </div>

        {/* Sleek High-Tech Loader Ring */}
        <div className="relative w-12 h-12">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-900/60" />
          {/* Active spinning arc */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin" />
        </div>
      </div>
    </div>
  );
}
