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
