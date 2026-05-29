'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: string;
}

export default function MetricCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  color = 'primary',
}: MetricCardProps) {
  const colorMap: Record<string, string> = {
    primary: 'text-primary bg-primary/10 border border-primary/20',
    success: 'text-success bg-success/10 border border-success/20',
    warning: 'text-warning bg-warning/10 border border-warning/20',
    danger: 'text-danger bg-danger/10 border border-danger/20',
    secondary: 'text-secondary bg-secondary/10 border border-secondary/20',
  };

  return (
    <div className="glass-card p-5 hover:glow-border transition-all duration-300 group">
      <div className="hud-bracket-tl" />
      <div className="hud-bracket-tr" />
      <div className="hud-bracket-bl" />
      <div className="hud-bracket-br" />
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tighter">
              {value}
            </span>
            {unit && <span className="text-xs text-slate-500 font-bold font-mono uppercase">{unit}</span>}
          </div>
          {trend && (
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                  trend === 'up'
                    ? 'bg-success/10 text-success border-success/20'
                    : trend === 'down'
                    ? 'bg-danger/10 text-danger border-danger/20'
                    : 'bg-slate-950/60 text-slate-500 border-primary/20'
                }`}
              >
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </span>
              <span className="text-[9px] font-semibold text-slate-500 uppercase">vs. última hora</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]} group-hover:scale-105 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
