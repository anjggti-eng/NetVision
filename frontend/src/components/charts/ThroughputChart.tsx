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
import type { ThroughputPoint } from '@/types';

interface ThroughputChartProps {
  data: ThroughputPoint[];
}

const DottedBar = (props: any) => {
  const { x, y, width, height } = props;
  if (!height || height <= 0) return null;

  const dotSpacing = 8;
  const radius = 2.5; // 5px diameter
  const numDots = Math.max(1, Math.floor(height / dotSpacing));
  
  const dots = [];
  for (let i = 0; i < numDots; i++) {
    const cy = y + height - (i * dotSpacing) - radius - 2;
    if (cy >= y) {
      dots.push(
        <circle
          key={i}
          cx={x + width / 2}
          cy={cy}
          r={radius}
          fill="#00E5FF"
        />
      );
    }
  }
  return <g>{dots}</g>;
};

export default function ThroughputChart({ data }: ThroughputChartProps) {
  const chartData = data.slice(-35);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
            }}
            stroke="rgba(255,255,255,0.05)"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            stroke="rgba(255,255,255,0.05)"
            tickLine={false}
            axisLine={false}
            unit="M"
          />
          <Tooltip
            contentStyle={{
              background: '#090E1A',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              borderRadius: '12px',
              fontSize: '11px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
              color: '#FFFFFF',
            }}
            labelFormatter={(v) => new Date(v).toLocaleTimeString()}
          />
          <Bar
            dataKey="download"
            shape={<DottedBar />}
            name="Download"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
