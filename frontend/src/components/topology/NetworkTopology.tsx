'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { TopologyData, TopologyNode } from '@/types';
import { api } from '@/lib/api';

const TYPE_ICONS: Record<string, string> = {
  router: '🛜',
  switch: '🔀',
  ap: '📡',
  server: '🖥',
  firewall: '🛡',
};

const TYPE_COLORS: Record<string, string> = {
  router: '#00E5FF',
  switch: '#7C4DFF',
  ap: '#00E676',
  server: '#FF9100',
  firewall: '#FF1744',
};

export default function NetworkTopology() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<TopologyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    api.topology.data().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);
    timeRef.current += 0.01;

    // Draw blueprint technical grid background
    const gridSize = 40;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw small technical crosshairs (+) at intersections
    ctx.fillStyle = 'rgba(0, 229, 255, 0.25)';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let x = gridSize * 2; x < w - gridSize; x += gridSize * 3) {
      for (let y = gridSize * 2; y < h - gridSize; y += gridSize * 3) {
        ctx.fillText('+', x, y);
      }
    }

    const positions = data.nodes.map((n) => ({
      ...n,
      x: (n.x / 100) * (w - 100) + 50,
      y: (n.y / 100) * (h - 100) + 50,
    }));

    data.links.forEach((link) => {
      const src = positions.find((n) => n.id === link.source);
      const tgt = positions.find((n) => n.id === link.target);
      if (!src || !tgt) return;

      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);

      if (link.status === 'up') {
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const progress = ((timeRef.current * 0.5) % 1);
        const px = src.x + dx * progress;
        const py = src.y + dy * progress;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(255, 23, 68, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    positions.forEach((node) => {
      const color = TYPE_COLORS[node.type] || '#00E5FF';
      const isOnline = node.status === 'online';
      const radius = node.type === 'router' ? 22 : node.type === 'switch' ? 18 : 16;

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
      ctx.fillStyle = isOnline
        ? `${color}15`
        : 'rgba(255, 23, 68, 0.1)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isOnline
        ? `${color}25`
        : 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = isOnline ? color : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      if (isOnline) {
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2);
        glow.addColorStop(0, `${color}20`);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(TYPE_ICONS[node.type] || '●', node.x, node.y);

      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = isOnline ? '#E2E8F0' : '#6b7280';
      ctx.fillText(node.label.length > 18 ? node.label.slice(0, 18) + '…' : node.label, node.x, node.y + radius + 16);
      ctx.fillStyle = isOnline ? '#6b7280' : '#4b5563';
      ctx.font = '9px monospace';
      ctx.fillText(node.ip, node.x, node.y + radius + 30);

      if (isOnline) {
        const pulseR = radius + 6 + Math.sin(timeRef.current * 3) * 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `${color}20`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    animRef.current = requestAnimationFrame(draw);
  }, [data]);

  useEffect(() => {
    if (data) {
      animRef.current = requestAnimationFrame(draw);
      return () => cancelAnimationFrame(animRef.current);
    }
  }, [data, draw]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const found = data.nodes.find((n) => {
      const x = (n.x / 100) * (rect.width - 100) + 50;
      const y = (n.y / 100) * (rect.height - 100) + 50;
      const radius = n.type === 'router' ? 26 : n.type === 'switch' ? 22 : 20;
      return Math.sqrt((mx - x) ** 2 + (my - y) ** 2) < radius;
    });
    setSelectedNode(found || null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        Carregando topologia...
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-[600px] rounded-xl cursor-pointer"
        onClick={handleClick}
      />
      {selectedNode && (
        <div className="absolute top-4 right-4 glass-card border border-primary/20 rounded-xl p-4 w-64 shadow-lg">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />
          <div className="hud-bracket-br" />
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{TYPE_ICONS[selectedNode.type]}</span>
            <span className="font-bold text-sm text-white">{selectedNode.label}</span>
          </div>
          <div className="space-y-2 text-[10px]">
            <div className="flex justify-between border-b border-primary/10 pb-1.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider">IP Address</span>
              <span className="text-slate-200 font-bold font-mono">{selectedNode.ip}</span>
            </div>
            <div className="flex justify-between border-b border-primary/10 pb-1.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Device Type</span>
              <span className="text-slate-200 font-bold capitalize">{selectedNode.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Link Status</span>
              <span
                className={`font-extrabold uppercase tracking-wider ${
                  selectedNode.status === 'online' ? 'text-success' : 'text-danger'
                }`}
              >
                {selectedNode.status === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
