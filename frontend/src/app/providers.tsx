'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import { MetricsWebSocket } from '@/lib/websocket';
import SplashLoading from '@/components/ui/SplashLoading';

export function Providers({ children }: { children: ReactNode }) {
  const { setMetrics, setAlerts } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard.metrics().then(setMetrics).catch(console.error);
    api.dashboard.alerts().then(setAlerts).catch(console.error);

    const ws = new MetricsWebSocket((update) => {
      if (update.metrics) setMetrics(update.metrics);
    });
    ws.connect();

    const interval = setInterval(() => {
      api.dashboard.alerts().then(setAlerts).catch(console.error);
    }, 10000);

    return () => {
      ws.disconnect();
      clearInterval(interval);
    };
  }, [setMetrics, setAlerts]);

  return (
    <>
      {loading && <SplashLoading onComplete={() => setLoading(false)} />}
      <div className={loading ? 'pointer-events-none' : ''}>
        {children}
      </div>
    </>
  );
}
