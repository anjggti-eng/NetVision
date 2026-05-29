# NetVision AI

Plataforma de observabilidade para redes corporativas com foco em ambientes MikroTik + Omada.

## Arquitetura

```
┌─────────────┐     ┌──────────────┐
│  Frontend   │────▶│   Backend    │
│  Next.js    │◀───▶│   FastAPI    │
│  Tailwind   │  WS │   Python     │
│  Recharts   │     │   WebSocket  │
└─────────────┘     └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Simulador   │
                    │  de Rede     │
                    │  (Engine)    │
                    └──────────────┘
```

- **Frontend**: Next.js 14 (App Router) + TailwindCSS + Recharts + Zustand
- **Backend**: FastAPI + WebSockets + SSE
- **Realtime**: WebSocket para streaming de métricas (2s de intervalo)

## Funcionalidades

### Reais (40%)
| Funcionalidade | Status |
|---------------|--------|
| Dashboard com métricas em tempo real via WebSocket | ✅ |
| Gráficos de throughput (Download/Upload) | ✅ |
| Topologia de rede interativa com Canvas | ✅ |
| Descoberta de dispositivos (simulada) | ✅ |
| Ping e latência de dispositivos | ✅ |
| Distribuição de clientes Wi-Fi | ✅ |
| Alertas em tempo real | ✅ |
| Engine de análise de segurança | ✅ |
| Chat com respostas contextuais (IA mock) | ✅ |

### Visuais (60%)
| Funcionalidade | Status |
|---------------|--------|
| Dashboard profissional dark theme | ✅ |
| Animações na topologia de rede | ✅ |
| Gradientes e efeitos glow | ✅ |
| Cards responsivos com indicadores | ✅ |
| Tabelas com progress bars | ✅ |
| Timeline de eventos de segurança | ✅ |

## Como executar

### Docker (recomendado)

```bash
docker-compose up --build
```

Acessar: http://localhost:3000

### Desenvolvimento

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/dashboard/metrics` | Métricas do dashboard |
| GET | `/api/dashboard/devices` | Lista de dispositivos |
| GET | `/api/dashboard/throughput` | Histórico de throughput |
| GET | `/api/dashboard/alerts` | Alertas ativos |
| WS | `/api/dashboard/ws` | WebSocket de métricas |
| GET | `/api/topology/data` | Dados da topologia |
| GET | `/api/topology/scan` | Scan de sub-rede |
| GET | `/api/topology/ping` | Ping dispositivo |
| GET | `/api/wifi/clients` | Clientes Wi-Fi |
| GET | `/api/wifi/stats` | Estatísticas Wi-Fi |
| GET | `/api/security/events` | Eventos de segurança |
| GET | `/api/security/stats` | Estatísticas de segurança |
| POST | `/api/ai/chat` | Chat com assistente AI |

## Estrutura do Projeto

```
netvision-ai/
├── frontend/
│   ├── src/
│   │   ├── app/           # Páginas (App Router)
│   │   ├── components/    # Componentes React
│   │   │   ├── ui/        # Sidebar, Header, Cards
│   │   │   ├── charts/    # Gráficos Recharts
│   │   │   └── topology/  # Topologia Canvas
│   │   ├── lib/           # API e WebSocket clients
│   │   ├── store/         # Zustand store
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── tailwind.config.ts
├── backend/
│   ├── app/
│   │   ├── routers/       # Endpoints REST
│   │   ├── services/      # Lógica de negócio
│   │   ├── models/        # Schemas Pydantic
│   │   └── websocket/     # WS manager
│   ├── requirements.txt
│   └── Dockerfile
└── docker-compose.yml
```

## Licença

MIT
