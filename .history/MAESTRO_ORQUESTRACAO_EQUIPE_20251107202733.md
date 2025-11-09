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
