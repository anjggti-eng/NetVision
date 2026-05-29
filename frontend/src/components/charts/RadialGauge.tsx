'use client';

interface RadialGaugeProps {
  value: number; // e.g. 0 to 100
  max?: number;
  label?: string;
  unit?: string;
  subLabel?: string;
}

export default function RadialGauge({
  value,
  max = 100,
  label = "Speed",
  unit = "Mbps",
  subLabel = "Throughput"
}: RadialGaugeProps) {
  const percentage = Math.min(Math.max(value / max, 0), 1);
  
  // Radius = 80. Circumference = 2 * PI * 80 = 502.65
  // Half-circle Arc = 251.3
  const strokeWidth = 10;
  const radius = 80;
  const halfCircumference = 251.3;
  const strokeDashoffset = halfCircumference * (1 - percentage);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-64 h-36">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* Outer Ring guide */}
          <path
            d="M 16 100 A 84 84 0 0 1 184 100"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />

          {/* Dotted Scale Ticks */}
          <path
            d="M 28 100 A 72 72 0 0 1 172 100"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
            strokeDasharray="1 5"
          />

          {/* Background Arc */}
          <path
            d="M 28 100 A 72 72 0 0 1 172 100"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Active Progress Arc */}
          <path
            d="M 28 100 A 72 72 0 0 1 172 100"
            fill="none"
            stroke="url(#blue-hud-gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={halfCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          <defs>
            <linearGradient id="blue-hud-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#7C4DFF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Value overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3">
          <span className="text-3xl font-extrabold text-white font-mono tracking-tighter">
            {value.toFixed(1)}
            <span className="text-xs font-semibold text-slate-500 ml-1 font-mono uppercase">{unit}</span>
          </span>
          <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mt-1">
            {subLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
