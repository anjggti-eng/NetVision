'use client';

import { create } from 'zustand';
import type { DashboardMetrics, Alert } from '@/types';

interface AppState {
  metrics: DashboardMetrics | null;
  alerts: Alert[];
  sidebarOpen: boolean;
  setMetrics: (metrics: DashboardMetrics) => void;
  setAlerts: (alerts: Alert[]) => void;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set) => ({
  metrics: null,
  alerts: [],
  sidebarOpen: true,
  setMetrics: (metrics) => set({ metrics }),
  setAlerts: (alerts) => set({ alerts }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
