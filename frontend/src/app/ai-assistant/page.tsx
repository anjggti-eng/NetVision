'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Lightbulb, BarChart3 } from 'lucide-react';
import { api } from '@/lib/api';
import type { AIResponse } from '@/types';
import AppLayout from '@/components/AppLayout';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  suggestions?: string[];
}

const SUGGESTIONS = [
  'Estou com lentidão na rede',
  'Wi-Fi está caindo',
  'Identifique falhas na rede',
  'Análise de segurança',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou o assistente de rede NetVision AI. Posso analisar métricas, diagnosticar problemas e sugerir otimizações. Como posso ajudar?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (message?: string) => {
    const text = message || input;
    if (!text.trim() || loading) return;

    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const response: AIResponse = await api.ai.chat(text);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply,
          confidence: response.confidence,
          suggestions: response.suggestions,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Desculpe, não foi possível processar sua solicitação no momento.',
          confidence: 0,
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-lg font-black text-white tracking-wider flex items-center gap-2 font-mono">
            <span>SYS NODE // AI CO-PROCESSOR</span>
            <span className="text-secondary bg-secondary/10 px-2 py-0.5 rounded text-xs font-bold font-mono">NEURAL-01</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
            Módulo Cognitivo de Observabilidade de Rede // HUD LAYER
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="glass-card flex flex-col h-[600px] relative overflow-hidden">
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />
              
              <div className="p-4 border-b border-primary/10 flex items-center gap-2.5 relative z-10 bg-[#0A1020]/95/50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white font-mono tracking-wider">NetVision AI v1.0</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[9px] text-slate-500 font-bold font-mono uppercase tracking-wider">
                      Neural Engine Live // Realtime telemetry analysis
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#060B17]/60/30 relative z-10">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative ${
                        msg.role === 'user'
                          ? 'bg-primary text-white font-medium border border-primary/20'
                          : 'bg-[#0A1020]/95 border border-primary/15 text-slate-200'
                      }`}
                    >
                      {/* Corner markings for assistant messages to make them look high tech */}
                      {msg.role === 'assistant' && (
                        <>
                          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-primary/45 rounded-tl" />
                          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-primary/45 rounded-tr" />
                          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-primary/45 rounded-bl" />
                          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-primary/45 rounded-br" />
                        </>
                      )}
                      
                      <p className="text-xs leading-relaxed font-mono whitespace-pre-wrap">{msg.content}</p>
                      
                      {msg.role === 'assistant' && msg.confidence !== undefined && (
                        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-primary/10">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">Confiança:</span>
                          <div className="w-20 h-1.5 bg-slate-950/60 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                msg.confidence > 0.8
                                  ? 'bg-success'
                                  : msg.confidence > 0.5
                                  ? 'bg-warning'
                                  : 'bg-danger'
                              }`}
                              style={{ width: `${msg.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-500 font-bold font-mono">
                            {Math.round(msg.confidence * 100)}%
                          </span>
                        </div>
                      )}
 
                      {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-primary/10">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Lightbulb size={12} className="text-warning" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                              Sugestões de Diagnóstico
                            </span>
                          </div>
                          <div className="space-y-1">
                            {msg.suggestions.map((s, j) => (
                              <div key={j} className="flex items-start gap-2 text-xs text-slate-500 font-medium font-mono">
                                <span className="text-primary font-bold mt-0.5">→</span>
                                <span>{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0A1020]/95 border border-primary/10 rounded-2xl p-4 shadow-sm relative">
                      <div className="absolute top-2 left-2 w-1 h-1 border-t border-l border-primary/50" />
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.1s]" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
 
              <div className="p-4 border-t border-primary/10 bg-[#0A1020]/95 rounded-b-2xl relative z-10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Descreva o problema de rede..."
                    className="flex-1 bg-[#060B17]/60 border border-primary/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primary/50 font-mono"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/95 transition-colors disabled:opacity-50 shadow-sm shadow-primary/10 font-mono"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
 
          <div className="space-y-4">
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />
              
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2 font-mono">
                <BarChart3 size={12} className="text-primary" />
                Diagnósticos Rápidos
              </h3>
              <div className="space-y-2">
                {showSuggestions &&
                  SUGGESTIONS.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(suggestion)}
                      className="w-full text-left text-[10px] text-slate-500 font-bold font-mono p-2.5 rounded-lg bg-[#060B17]/60 border border-primary/10 hover:bg-slate-950/60 hover:text-white transition-colors"
                    >
                      {suggestion.toUpperCase()}
                    </button>
                  ))}
              </div>
            </div>
 
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />
              
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 font-mono">
                Capacidades
              </h3>
              <div className="space-y-2.5 text-[10px] text-slate-500 font-bold font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span>DIAGNOSE LENTIDÃO</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span>ANALISAR AP WI-FI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span>MAPEAMENTO DE FALHAS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span>DEFESA & SEGURANÇA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span>SUGESTÃO OTAP / MTU</span>
                </div>
              </div>
            </div>
 
            <div className="glass-card p-4 bg-gradient-to-br from-white to-primary/[0.03] border-primary/10 relative overflow-hidden">
              <div className="hud-bracket-tl" />
              <div className="hud-bracket-tr" />
              <div className="hud-bracket-bl" />
              <div className="hud-bracket-br" />
              
              <h3 className="text-xs font-bold text-primary mb-2 uppercase tracking-wider font-mono">Core Advise</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed font-bold font-mono">
                Seja específico ao descrever o problema. Inclua IPs, SSIDs afetados e logs observados para uma análise mais precisa da CPU do gateway.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
