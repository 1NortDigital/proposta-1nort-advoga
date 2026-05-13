# TODO — Proposta 1Nort Advoga

Adaptação da proposta Solar v2 pra advocacia.

## ✅ Já adaptado (passada inicial 2026-05-04)

### Copy
- **S1 Hero:** "assessoria de marketing solar" → "máquina previsível de aquisição pro seu escritório" + sub adaptado pra causa real / curioso
- **S2 Comparativo:** "+300 integradores" → contexto advoga ("calibrado pra advocacia, não com curioso atrás de consulta gratuita") + última linha "calibrada só pra advocacia"
- **S3 Diferencial:**
  - Tab 1 Estrutura: "atender mais integradores solares" → "atender escritórios de advocacia" + bullet "validada em escritórios de trabalhista e empresarial"
  - Tab 2 reescrita pra "Operação dedicada" — admite que é vertical jurídica calibrada (sub-perfis trabalhista massivo + empresarial preventivo)
  - Tab 3 Tecnologia: "calibrada pra operação solar" → "calibrada pra captação jurídica"
  - Tab 4 reescrita pra "Conhecemos a dor" — fala da dor de depender de indicação, perder lead pra concorrente, etc.
- **S5 Método NORT:** mantido (genérico)
- **S6 Funil:**
  - Step 1 criativos: "ATÉ 95% conta de luz" → "Foi mandado embora? Veja se a empresa te deve" + cards "Justiça trabalhista" e "Hora extra, FGTS"
  - Step 2: "Quero meu orçamento" → "Quero ser avaliado" / form "Cidade" → "Empresa"
  - Step 3 quiz: Consumo/Interesse/Capacidade → Empresa/Tempo de empresa/Tipo de saída (mandado embora vs pediu demissão)
  - Step 4 filtros: "Caçadores de preço" → "Caçadores de consulta grátis" + "Sem perfil" → "Sem causa real"
  - Step 5 mock chat: "Nort Energia Solar" → "Escritório Trabalhista"
- **S8 IA WhatsApp:** mock chat completamente reescrito pro contexto trabalhista (empresa, mandado embora, tempo de empresa, reunião com advogado)
- **S9 Receita:** "Cada integrador" → "Cada escritório"
- **S10 Planos:** preços ajustados R$300/400/500 → **R$ 200 / R$ 300 / R$ 400** + foco "autônomos/empresas" → "advogados autônomos/escritórios"
- **S11 Tracking:** notificações WhatsApp com tags [SOLAR] → [ADVOGA] [TRABALHISTA] [MANDADO-EMBORA] [HORA-EXTRA]
- **S12 Métricas:**
  - Investimento: R$ 1.500 → **R$ 1.200**
  - Funil reescrito: 100 contatos → 80 respondem (80%) → 50 oportunidades (62%) → 25 reuniões (50%) → **7 contratos** (28% / 7% do total)
  - CAC: R$ 375 → **R$ 171** (R$ 1.200 / 7)
  - Faturamento estimado: 60-80k → **R$ 8k a R$ 15k** (7 contratos × ticket médio)
  - Última linha do funil mostra só "7 contratos/mês" (label simplificada — antes mostrava "28% / 7% do total")
- **S13 CTA Final:**
  - Kicker: "ACELERAÇÃO SOLAR" → "ACELERAÇÃO ADVOGA"
  - Badge: "+300 integradores ativos" → "+40 especialistas dedicados"
  - 6 entregáveis reescritos pro contexto jurídico (causa real, OAB, IA 24/7, CRM jurídico, agenda, mensuração)
- **Meta tags + title:** atualizados

### Estrutura
- **S4 Resultados:**
  - Header sub adaptado pra contexto advoga
  - Carrossel: IDs YouTube placeholders → **4 IDs reais do site /advoga**: FBUoxw-xdFE, xuPgqoDei7I, ymRMwvIlDF8, EAPUwhtS0nU (com thumbs do youtube)
  - Bloco "Case Sunbright" REMOVIDO (não temos escritório próprio)
  - Substituído por **3 depoimentos textuais** dos clientes reais: Fabio Gil (31 contratos trabalhista), Farinelli Altinier (9 contratos), Rosalen & Cordeiro (leads do MT)
- **Logos clientes:** removidas (Bruno pediu)
- **Mapa do Brasil:** já não existe na v2 importada
- **Botão "Ver criativos reais" (S6):** ocultado (`display:none`) até Bruno mandar prints+vídeos novos

## 📌 Pendente

### Conteúdo que Bruno vai mandar
- **Criativos jurídicos reais** (prints + vídeos) → reativar botão `data-open-creatives` da S6 e atualizar:
  - 5 imagens em `assets/images/ad1-5.png` (atualmente são solar)
  - 5 vídeos com IDs YouTube reais no modal (atualmente placeholders V7sNO3Px6NJ etc)
  - Legendas correspondentes

### Validações pendentes
- **Tab "Operação dedicada"** afirma "Sub-perfis validados: trabalhista massivo e empresarial preventivo" — confirmar se a vertical empresarial entra nesta proposta ou se é só trabalhista.
- **"+40 especialistas dedicados"** na S13 — número total da 1Nort, não só do squad jurídico. Validar se é OK falar assim ou se prefere substituir por número específico do time advoga.

### Limpeza
- Foto principal da S13 ainda é da equipe Solar (CONHECA-A-1NORT.webp). Trocar por foto que mostre o squad jurídico ou um cliente advogado.
- CSS órfão de Sunbright (`.own-case__shot`) pode ser limpo. `.real-shot` ainda é usado na S9 (dashboard CRM), manter.

## Notas técnicas
- Stack idêntica à proposta solar v2: HTML + CSS + GSAP + Lenis (CDN)
- Todas as classes/IDs preservadas — sem mudanças de JS necessárias
- Backup do solar v1: `proposta-1nort-solar-v1-backup-20260504/`
- Base de partida: `proposta-1nort-solar/` (v2)
