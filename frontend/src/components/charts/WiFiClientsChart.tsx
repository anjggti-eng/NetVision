'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { WiFiClient } from '@/types';

interface WiFiClientsChartProps {
  clients: WiFiClient[];
}

export default function WiFiClientsChart({ clients }: WiFiClientsChartProps) {
  const rssiRanges = [
    { range: '-30 a -40', min: -40, max: -30, color: '#00E676' },
    { range: '-41 a -50', min: -50, max: -41, color: '#00E5FF' },
    { range: '-51 a -60', min: -60, max: -51, color: '#FF9100' },
    { range: '-61 a -70', min: -70, max: -61, color: '#FF9100' },
    { range: '-71 a -80', min: -80, max: -71, color: '#FF1744' },
    { range: 'Abaixo -80', min: -Infinity, max: -80, color: '#FF1744' },
  ];

  const data = rssiRanges.map((r) => ({
    range: r.range,
    count: clients.filter((c) => c.rssi <= r.max && c.rssi > r.min).length,
    fill: r.color,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="range"
          tick={{ fill: '#94A3B8', fontSize: 10 }}
          stroke="#E2E8F0"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: '#94A3B8', fontSize: 10 }}
          stroke="#E2E8F0"
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            fontSize: '11px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
            color: '#0F172A',
          }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <rect key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
