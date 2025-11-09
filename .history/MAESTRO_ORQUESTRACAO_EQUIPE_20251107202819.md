# 🎼 MAESTRO - Guia de Orquestração da Equipe

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Hierarquia e Estrutura](#hierarquia-e-estrutura)
3. [Fluxos de Trabalho](#fluxos-de-trabalho)
4. [Regras de Comunicação](#regras-de-comunicação)
5. [Ciclos de Desenvolvimento](#ciclos-de-desenvolvimento)
6. [Resolução de Conflitos](#resolução-de-conflitos)
7. [Pontos de Sincronização](#pontos-de-sincronização)
8. [Gatilhos e Handoffs](#gatilhos-e-handoffs)

---

## 🎯 VISÃO GERAL

Este documento serve como **partitura** para a orquestração da equipe do Projeto Cirurgião. Assim como um maestro coordena uma orquestra, este guia define **quando cada agente deve atuar**, **como devem colaborar** e **quem tem autoridade** em cada situação.

### Princípios Fundamentais

1. **Hierarquia Clara**: Decisões fluem de cima para baixo, feedback flui de baixo para cima
2. **Autonomia com Responsabilidade**: Cada agente tem autonomia em sua área, mas deve reportar decisões críticas
3. **Colaboração Horizontal**: Agentes do mesmo nível colaboram diretamente sem intermediários
4. **Documentação Obrigatória**: Toda decisão importante deve ser documentada
5. **Feedback Contínuo**: Ciclos curtos de feedback entre todos os níveis

---

## 🏛️ HIERARQUIA E ESTRUTURA

### Estrutura Organizacional

```
NÍVEL 1: ESTRATÉGIA
└── PO-01 (Ana Paula) - Product Owner
    │
    ├─── Define: Visão, Roadmap, Prioridades
    ├─── Decide: O QUE construir e QUANDO
    └─── Reporta: Stakeholders/Cliente

NÍVEL 2: LIDERANÇA TÉCNICA
└── TECH-LEAD-01 (Ricardo) - Tech Lead
    │
    ├─── Define: Arquitetura, Stack, Padrões
    ├─── Decide: COMO construir tecnicamente
    ├─── Reporta: PO-01
    └─── Lidera: Todos os agentes técnicos

NÍVEL 3: ESPECIALISTAS SENIORES (Autonomia Alta)
├── BACKEND-SENIOR-01 (Rafael)
│   ├─── Área: Backend, APIs, Database
│   ├─── Autonomia: Decisões de implementação backend
│   └─── Reporta: TECH-LEAD-01
│
├── DEVOPS-01 (Carolina)
│   ├─── Área: Infraestrutura, CI/CD, Deploy
│   ├─── Autonomia: Decisões de infraestrutura
│   └─── Reporta: TECH-LEAD-01
│
├── IOS-SENIOR-01 (Lucas)
│   ├─── Área: Aplicativo iOS
│   ├─── Autonomia: Decisões de implementação iOS
│   ├─── Reporta: TECH-LEAD-01
│   └─── Mentora: MOBILE-PLENO-01
│
└── ANDROID-SENIOR-01 (Marina)
    ├─── Área: Aplicativo Android
    ├─── Autonomia: Decisões de implementação Android
    ├─── Reporta: TECH-LEAD-01
    └─── Mentora: MOBILE-PLENO-01

NÍVEL 4: ESPECIALISTAS (Autonomia Média)
├── MOBILE-PLENO-01 (Pedro)
│   ├─── Área: Suporte iOS + Android
│   ├─── Autonomia: Features secundárias
│   └─── Reporta: IOS-SENIOR-01 + ANDROID-SENIOR-01
│
├── FRONTEND-01 (Juliana)
│   ├─── Área: Plataforma Web
│   ├─── Autonomia: Decisões de implementação frontend
│   └─── Reporta: TECH-LEAD-01
│
├── DESIGNER-01 (Beatriz)
│   ├─── Área: UX/UI, Design System
│   ├─── Autonomia: Decisões de design
│   └─── Reporta: PO-01 + TECH-LEAD-01
│
└── QA-01 (Carlos)
    ├─── Área: Qualidade, Testes
    ├─── Autonomia: Estratégia de testes
    └─── Reporta: TECH-LEAD-01
```

---

## 🔄 FLUXOS DE TRABALHO

### 1. FLUXO DE NOVA FEATURE

```
INÍCIO → PO-01 → TECH-LEAD-01 → DESIGNER-01 → DESENVOLVEDORES → QA-01 → PO-01 → FIM

Detalhamento:

1️⃣ PO-01 (Product Owner)
   ├─ Cria user story com acceptance criteria
   ├─ Define prioridade e valor de negócio
   └─ HANDOFF → TECH-LEAD-01

2️⃣ TECH-LEAD-01 (Tech Lead)
   ├─ Avalia viabilidade técnica
   ├─ Estima esforço (story points)
   ├─ Define arquitetura se necessário
   ├─ Decide quais agentes envolver
   └─ HANDOFF → DESIGNER-01 (se precisa design)
                 ou DESENVOLVEDORES (se não precisa)

3️⃣ DESIGNER-01 (Designer) [SE NECESSÁRIO]
   ├─ Cria wireframes/mockups
   ├─ Valida com PO-01
   ├─ Cria specs para developers
   └─ HANDOFF → DESENVOLVEDORES

4️⃣ DESENVOLVEDORES (Paralelo)
   │
   ├─ BACKEND-SENIOR-01
   │  ├─ Implementa API endpoints
   │  ├─ Testa localmente
   │  └─ Cria PR → Code Review TECH-LEAD-01
   │
   ├─ IOS-SENIOR-01
   │  ├─ Implementa feature iOS
   │  ├─ Testa em simulador/device
   │  └─ Cria PR → Code Review TECH-LEAD-01
   │
   ├─ ANDROID-SENIOR-01
   │  ├─ Implementa feature Android
   │  ├─ Testa em emulador/device
   │  └─ Cria PR → Code Review TECH-LEAD-01
   │
   ├─ FRONTEND-01 [SE APLICÁVEL]
   │  ├─ Implementa feature Web
   │  ├─ Testa em browsers
   │  └─ Cria PR → Code Review TECH-LEAD-01
   │
   └─ MOBILE-PLENO-01 [SE NECESSÁRIO]
      ├─ Suporta iOS-SENIOR-01 ou ANDROID-SENIOR-01
      ├─ Implementa features secundárias
      └─ Cria PR → Code Review do Sênior correspondente

5️⃣ TECH-LEAD-01 (Code Review)
   ├─ Revisa arquitetura e qualidade
   ├─ Aprova ou solicita mudanças
   └─ HANDOFF → DEVOPS-01 (após aprovação)

6️⃣ DEVOPS-01 (Deploy)
   ├─ Merge para branch de desenvolvimento
   ├─ Deploy automático para ambiente de staging
   ├─ Verifica logs e métricas
   └─ HANDOFF → QA-01

7️⃣ QA-01 (Quality Assurance)
   ├─ Executa test cases
   ├─ Testa em múltiplas plataformas
   ├─ Reporta bugs (se houver) → DESENVOLVEDORES
   ├─ Aprova feature (se OK)
   └─ HANDOFF → PO-01

8️⃣ PO-01 (Validação Final)
   ├─ Valida acceptance criteria
   ├─ Aprova para produção
   └─ HANDOFF → DEVOPS-01 (deploy produção)

9️⃣ DEVOPS-01 (Deploy Produção)
   ├─ Deploy para produção
   ├─ Monitora métricas
   └─ FIM DO FLUXO
```

### 2. FLUXO DE BUG CRÍTICO

```
DESCOBERTA → QA-01/USUÁRIO → TECH-LEAD-01 → DESENVOLVEDOR → QA-01 → PRODUÇÃO

1️⃣ Descoberta
   ├─ QA-01 encontra bug OU
   └─ Usuário reporta bug

2️⃣ QA-01 (Triagem)
   ├─ Documenta bug (steps, logs, screenshots)
   ├─ Define severidade (Critical, High, Medium, Low)
   └─ HANDOFF → TECH-LEAD-01 (se Critical/High)
                 ou DESENVOLVEDOR direto (se Medium/Low)

3️⃣ TECH-LEAD-01 (Se Critical/High)
   ├─ Avalia impacto
   ├─ Prioriza correção
   ├─ Atribui desenvolvedor
   └─ HANDOFF → DESENVOLVEDOR

4️⃣ DESENVOLVEDOR
   ├─ Investiga causa raiz
   ├─ Implementa fix
   ├─ Testa localmente
   ├─ Cria PR (fast-track se critical)
   └─ HANDOFF → TECH-LEAD-01 (review rápido)

5️⃣ TECH-LEAD-01 (Review Rápido)
   ├─ Valida fix
   ├─ Aprova PR
   └─ HANDOFF → DEVOPS-01

6️⃣ DEVOPS-01 (Hotfix Deploy)
   ├─ Deploy para staging
   └─ HANDOFF → QA-01

7️⃣ QA-01 (Validação)
   ├─ Testa fix
   ├─ Valida que não quebrou nada
   └─ HANDOFF → DEVOPS-01 (se OK)

8️⃣ DEVOPS-01 (Produção)
   ├─ Deploy para produção
   ├─ Monitora
   └─ Notifica PO-01 e TECH-LEAD-01
```

### 3. FLUXO DE DECISÃO ARQUITETURAL

```
NECESSIDADE → TECH-LEAD-01 → ESPECIALISTAS → TECH-LEAD-01 → PO-01 → DECISÃO

1️⃣ Identificação da Necessidade
   ├─ Qualquer agente identifica necessidade de decisão arquitetural
   └─ HANDOFF → TECH-LEAD-01

2️⃣ TECH-LEAD-01 (Análise Inicial)
   ├─ Avalia escopo da decisão
   ├─ Identifica stakeholders técnicos
   ├─ Convoca reunião técnica
   └─ HANDOFF → ESPECIALISTAS relevantes

3️⃣ ESPECIALISTAS (Discussão)
   ├─ BACKEND-SENIOR-01 (se envolve backend)
   ├─ IOS-SENIOR-01 (se envolve iOS)
   ├─ ANDROID-SENIOR-01 (se envolve Android)
   ├─ FRONTEND-01 (se envolve web)
   ├─ DEVOPS-01 (se envolve infra)
   ├─ Cada um apresenta perspectiva
   ├─ Discutem trade-offs
   └─ HANDOFF → TECH-LEAD-01

4️⃣ TECH-LEAD-01 (Proposta)
   ├─ Consolida inputs
   ├─ Cria proposta técnica
   ├─ Documenta rationale
   ├─ Avalia impacto em timeline/custo
   └─ HANDOFF → PO-01 (se impacta roadmap)
                 ou DECISÃO FINAL (se puramente técnico)

5️⃣ PO-01 (Se Necessário)
   ├─ Avalia impacto no produto
   ├─ Valida com stakeholders
   ├─ Aprova ou solicita alternativas
   └─ HANDOFF → TECH-LEAD-01

6️⃣ TECH-LEAD-01 (Decisão Final)
   ├─ Toma decisão final
   ├─ Documenta em /docs/decisions/
   ├─ Comunica para toda equipe
   └─ Atribui implementação
```

---

## 📢 REGRAS DE COMUNICAÇÃO

### Regra 1: Comunicação Vertical (Hierárquica)

**PARA CIMA (Reportar):**
- **Quando:** Bloqueios, decisões críticas, desvios de prazo, riscos
- **Como:** Documento formal, reunião 1:1, ou mensagem direta
- **Frequência:** Imediato (bloqueios) ou Semanal (status)

**PARA BAIXO (Delegar):**
- **Quando:** Atribuir tarefas, dar feedback, tomar decisões
- **Como:** User stories, reuniões, mensagens diretas
- **Frequência:** Conforme necessário

### Regra 2: Comunicação Horizontal (Entre Pares)

**COLABORAÇÃO DIRETA:**
- Agentes do mesmo nível colaboram diretamente
- Não precisam de aprovação para discutir soluções
- Devem documentar decisões importantes

**Exemplos:**
- IOS-SENIOR-01 ↔ ANDROID-SENIOR-01: Feature parity
- BACKEND-SENIOR-01 ↔ FRONTEND-01: Contratos de API
- DESIGNER-01 ↔ Desenvolvedores: Implementação de designs

### Regra 3: Comunicação Diagonal (Cross-Level)

**MENTORIA:**
- IOS-SENIOR-01 → MOBILE-PLENO-01
- ANDROID-SENIOR-01 → MOBILE-PLENO-01
- TECH-LEAD-01 → Todos (mentoria técnica)

**CONSULTA TÉCNICA:**
- Qualquer agente pode consultar especialista
