from fastapi import APIRouter
from ..models.schemas import AIRequest, AIResponse
from ..services.network_simulator import simulator
import random

router = APIRouter(prefix="/api/ai", tags=["ai"])

RESPONSES = {
    "lentidao": {
        "reply": "Analisando a rede, identifiquei que o link do MikroTik CCR1072 está com 85% de utilização. Recomendo verificar o tráfego do switch CRS326 e considerar um balanceamento de carga entre os dois roteadores.",
        "confidence": 0.87,
        "suggestions": [
            "Criar regra de QoS para priorizar tráfego crítico",
            "Verificar se há dispositivos não autorizados consumindo banda",
            "Agendar failover test para o link backup 4G",
        ],
    },
    "wifi": {
        "reply": "O AP Omada EAP670 (CANTO SUL) está com 23 clientes conectados e canal congestionado (canal 6, 2.4GHz). 10 clientes estão com RSSI abaixo de -70dBm. Sugiro migrar dispositivos compatíveis para 5GHz.",
        "confidence": 0.92,
        "suggestions": [
            "Ativar band steering no EAP670",
            "Reduzir potência do rádio 2.4GHz para forçar roaming",
            "Verificar interferência de redes vizinhas no canal 6",
        ],
    },
    "falha": {
        "reply": "Detectei anomalia no Switch Core CRS326. A porta 12 está com CRC errors crescentes (245 erros nas últimas 2 horas). Provável cabo danificado ou interface com problema.",
        "confidence": 0.78,
        "suggestions": [
            "Substituir cabo de rede na porta 12",
            "Verificar SFP+ do link core",
            "Ativar RSTP para evitar loop caso a porta falhe",
        ],
    },
    "seguranca": {
        "reply": "Identifiquei 47 tentativas de brute force SSH no firewall FortiGate vindas do IP 185.220.101.x nas últimas 24h. O padrão sugere ataque coordenado. O firewall já está bloqueando, mas recomendo rever as whitelists.",
        "confidence": 0.95,
        "suggestions": [
            "Adicionar IP range à blacklist automática",
            "Alterar porta SSH padrão",
            "Ativar autenticação 2FA para acesso externo",
            "Gerar relatório de auditoria para compliance",
        ],
    },
}

FALLBACK = {
    "reply": "Analisei os logs e métricas disponíveis. Não encontrei correlação direta com o problema relatado. Os indicadores da rede estão dentro da normalidade. Recomendo monitorar e reportar se o problema persistir.",
    "confidence": 0.65,
    "suggestions": [
        "Abrir ticket de suporte N2 com logs anexados",
        "Agendar manutenção preventiva nos equipamentos",
        "Verificar atualizações de firmware disponíveis",
    ],
}


@router.post("/chat", response_model=AIResponse)
async def ai_chat(request: AIRequest):
    msg = request.message.lower()
    for key, response in RESPONSES.items():
        if key in msg:
            return AIResponse(**response)
    return AIResponse(**FALLBACK)
