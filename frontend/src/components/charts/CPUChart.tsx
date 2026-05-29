'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface CPUChartProps {
  data: { timestamp: string; value: number }[];
  color?: string;
  label?: string;
}

export default function CPUChart({
  data,
  color = '#00E5FF',
  label = 'CPU %',
}: CPUChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="timestamp"
          tick={{ fill: '#6b7280', fontSize: 10 }}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
          }}
          stroke="rgba(255,255,255,0.05)"
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 10 }}
          stroke="rgba(255,255,255,0.05)"
          tickLine={false}
          unit="%"
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            background: '#1A2341',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill={`url(#grad-${color.replace('#', '')})`}
          strokeWidth={2}
          name={label}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
