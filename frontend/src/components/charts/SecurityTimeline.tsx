'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface SecurityTimelineProps {
  data: { time: string; critical: number; warning: number; info: number }[];
}

export default function SecurityTimeline({ data }: SecurityTimelineProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="time"
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
        <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Crítico" />
        <Line type="monotone" dataKey="warning" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Alerta" />
        <Line type="monotone" dataKey="info" stroke="#0052FF" strokeWidth={2} dot={false} name="Info" />
      </LineChart>
    </ResponsiveContainer>
  );
}
