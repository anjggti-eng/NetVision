# 🌐 NetVision AI — Cyber-HUD Network Operations Center (NOC)

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Uma plataforma de telemetria e observabilidade de redes corporativas em tempo real, com design imersivo de alta tecnologia inspirado em **Cyber-HUDs futuristas (cyberpunk holográfico)**. O sistema integra streaming bidirecional de dados via WebSockets com uma interface moderna Next.js de alta legibilidade, simulando diagnósticos avançados de rede, análise de Wi-Fi e inteligência artificial para diagnósticos.

---

## 🎨 O Design: Cyber-HUD Holographic Theme
O diferencial visual do **NetVision AI** é a imersão tecnológica:
*   **Fundo Escuro Profundo**: Utiliza tonalidades escuras (`#040712`) com cartões translúcidos com desfoque de fundo (`backdrop-blur`).
*   **Acentos Neon de Alta Fidelidade**: Destaques em Ciano Neon (`#00E5FF`), Laranja Elétrico (`#FF9100`) e Verde Ativo (`#00E676`).
*   **Efeitos HUD Dinâmicos**: Varredura a laser animada (`tech-sweep`), efeito CRT scanline cobrindo a viewport e cantoneiras digitais nos cartões que brilham ao passar o mouse.
*   **Tela de Inicialização Limpa**: Sequência de carregamento orbital tecnológica sem textos poluídos para transição suave no carregamento do painel.

---

## 🛠️ Arquitetura do Sistema

```text
┌───────────────────────────┐         ┌───────────────────────────┐
│     Frontend Client       │         │      Backend Server       │
│  ┌─────────────────────┐  │         │  ┌─────────────────────┐  │
│  │   Next.js 14 Web    │◀─┼─────────┼─▶│   FastAPI Python    │  │
│  └─────────────────────┘  │   REST  │  └─────────────────────┘  │
│  ┌─────────────────────┐  │         │  ┌─────────────────────┐  │
│  │   Recharts Charts   │  │         │  │  Websocket Engine   │  │
│  └─────────────────────┘  │◀────────┼──│  (Métricas a cada   │  │
│  ┌─────────────────────┐  │   WS    │  │   2 segundos)       │  │
│  │  HTML5 Canvas Topo  │  │         │  └─────────────────────┘  │
│  └─────────────────────┘  │         │  ┌─────────────────────┐  │
│  ┌─────────────────────┐  │         │  │   Network Simulator │  │
│  │    Zustand Store    │  │         │  │    (Ping & Security)│  │
│  └─────────────────────┘  │         │  └─────────────────────┘  │
└───────────────────────────┘         └───────────────────────────┘
```

*   **Frontend**: Next.js (App Router), TailwindCSS, Recharts, Zustand para controle de estado, e Canvas nativo para o mapa de topologia de rede.
*   **Backend**: FastAPI, Asyncio (gerenciamento assíncrono), WebSockets para transmissão de dados de telemetria sem latência.
*   **Orquestração**: Totalmente dockerizado com compilação otimizada Next.js (`standalone`) para produção.

---

## 🚀 Funcionalidades Principais

*   📈 **Dashboard de Métricas**: Throughput de rede (Upload/Download) em tempo real, jitter, consumo de CPU/Memória com indicadores estáticos e dinâmicos em formato HUD.
*   🌐 **Topologia de Rede Dinâmica**: Mapeamento interativo de roteadores, switches, servidores e clientes ativos na LAN, com indicação de ping em milissegundos e status.
*   📶 **Análise de Redes Wi-Fi**: Gráfico de distribuição de clientes por frequência (2.4 GHz e 5 GHz), largura de canal e status de sinal (RSSI).
*   🛡️ **Painel de Segurança**: Histórico em tempo real de tentativas de intrusão, escaneamento de portas ativas, detecção de falsos pacotes ARP e firewall integrado.
*   🤖 **AI Diagnostic Assistant**: Chat interativo integrado com IA contextualizada que analisa os problemas de rede da topologia e sugere configurações práticas.

---

## 📦 Como Executar Localmente

### Pré-requisitos
*   [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

### Execução via Docker
Para subir todo o ecossistema (Frontend no `3000` + Backend no `8000`) com um único comando:

```bash
docker-compose up --build
```
Após o carregamento, acesse **`http://localhost:3000`**.

---

## ⚙️ Deploy em Nuvem (Coolify ou Portainer)

### Variáveis de Ambiente (Crítico para Produção)
Quando implantado na web, o código Next.js do frontend roda **no navegador do visitante**. Por isso, você deve apontar a API do frontend para o endereço público do backend. No painel do seu provedor (Coolify/Portainer), configure as variáveis de ambiente no serviço frontend:

```env
NEXT_PUBLIC_API_URL=https://api-netvision.seu-dominio.com
NEXT_PUBLIC_WS_URL=wss://api-netvision.seu-dominio.com
```

### 1. Implantação no Coolify (Recomendado)
O Coolify automatiza todo o provisionamento de certificados SSL (HTTPS/WSS) e gerenciamento de rotas.

1.  Acesse o Coolify e crie um **Novo Projeto**.
2.  Escolha **Add New Resource** e selecione **Docker Compose**.
3.  Vincule ao repositório do seu GitHub: `https://github.com/anjggti-eng/NetVision.git`.
4.  O Coolify reconhecerá o arquivo `docker-compose.yml` e criará duas aplicações.
5.  Nas configurações de cada serviço, defina o domínio público de cada um (ex: `https://netvision.meudominio.com` para o frontend e `https://api.meudominio.com` para o backend).
6.  O Coolify gerará o HTTPS e o WSS automaticamente.

### 2. Implantação no Portainer
1.  Vá para a seção **Stacks** do Portainer e clique em **Add Stack**.
2.  Cole o conteúdo do arquivo `docker-compose.yml` contido na raiz do projeto.
3.  Defina as variáveis de ambiente públicas do frontend conforme descrito no bloco acima.
4.  Clique em **Deploy Stack**.
5.  Configure o seu proxy reverso favorito (Nginx Proxy Manager, Caddy, etc.) para apontar o domínio desejado para as portas locais `3000` (frontend) e `8000` (backend) do seu servidor VPS.

---

## 📂 Estrutura do Projeto

```text
netvision-ai/
├── frontend/             # Next.js 14 Webapp
│   ├── src/
│   │   ├── app/          # Rotas e páginas do App Router (dashboard, topology, etc.)
│   │   ├── components/   # Interface visual (charts, canvas de topologia, sidebar)
│   │   ├── lib/          # Handlers de conexões WebSocket e requisições Axios
│   │   └── store/        # Zustand para controle global de estados da aplicação
│   ├── Dockerfile        # Build otimizado standalone para produção em nuvem
│   └── tailwind.config.ts# Configuração do Tema Cyber-HUD e animações personalizadas
├── backend/              # Python FastAPI Backend
│   ├── app/
│   │   ├── routers/      # Rotas REST agrupadas (AI, Segurança, Wi-Fi, Topologia)
│   │   ├── services/     # Simuladores de rede corporativa e alertas assíncronos
│   │   └── websocket/    # Gerenciamento de conexões ativas para streaming
│   ├── Dockerfile        # Imagem lightweight rodando Uvicorn assíncrono
│   └── requirements.txt  # Dependências do backend Python
└── docker-compose.yml    # Orquestrador local multi-serviços
```

---

## 📝 Licença
Este projeto é distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para obter mais informações.
