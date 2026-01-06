# 📊 Estudo: Migração para Google Cloud Platform (Firebase + Cloud Run)

**Data:** 06/01/2026  
**Autor:** Análise Técnica  
**Status:** Estudo Comparativo

---

## 🎯 Objetivo

Avaliar se é viável e vantajoso migrar a arquitetura atual (NestJS + Prisma + PostgreSQL + Docker) para uma arquitetura baseada em Google Cloud Platform (Firebase + Cloud Run), mantendo o Cloudflare Stream para vídeos.

---

## 📋 Arquitetura Atual

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITETURA ATUAL                         │
├─────────────────────────────────────────────────────────────┤
│  Frontend: Next.js 14 + React + Shadcn/UI                   │
│  Backend: NestJS + TypeScript                               │
│  Database: PostgreSQL (via Docker)                          │
│  ORM: Prisma                                                │
│  Auth: JWT customizado + Refresh Tokens                     │
│  Vídeos: Cloudflare Stream (TUS protocol)                   │
│  Deploy: Manual (não definido ainda)                        │
└─────────────────────────────────────────────────────────────┘
```

**O que já foi implementado:**
- ✅ Sistema de autenticação completo (JWT)
- ✅ CRUD de courses, modules, videos
- ✅ Upload assíncrono para Cloudflare Stream
- ✅ Sistema de progresso e matrículas
- ✅ Player de vídeo funcional
- ✅ Vitrine de cursos (área do aluno)
- ✅ ~15+ endpoints API REST

---

## 📋 Arquitetura Proposta (GCP)

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITETURA GCP                           │
├─────────────────────────────────────────────────────────────┤
│  Frontend: Next.js 14 (Firebase Hosting ou Cloud Run)       │
│  Backend: Cloud Functions ou Cloud Run                      │
│  Database: Firestore (NoSQL) ou Cloud SQL (PostgreSQL)      │
│  Auth: Firebase Authentication                              │
│  Vídeos: Cloudflare Stream (mantido)                        │
│  Storage: Firebase Storage ou Cloud Storage                 │
│  Deploy: Automático via Firebase CLI / Cloud Build          │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚖️ Análise Comparativa Detalhada

### 1. 🔐 Autenticação

| Aspecto | Atual (JWT Custom) | Firebase Auth |
|---------|-------------------|---------------|
| **Implementação** | ~500 linhas de código | ~50 linhas |
| **Social Login** | Precisa implementar | ✅ Pronto (Google, Apple, etc) |
| **Refresh Tokens** | Manual | ✅ Automático |
| **Multi-device** | Precisa implementar | ✅ Pronto |
| **Verificação Email** | Precisa implementar | ✅ Pronto |
| **Reset Password** | Implementado parcialmente | ✅ Pronto |
| **Segurança** | Boa (se bem feito) | ✅ Excelente (Google) |
| **Mobile Native** | SDK separado | ✅ SDK pronto |

**🏆 Vencedor: Firebase Auth** - Muito mais rápido e seguro.

---

### 2. 🗄️ Banco de Dados

| Aspecto | PostgreSQL + Prisma | Firestore | Cloud SQL (PostgreSQL) |
|---------|--------------------|-----------|-----------------------|
| **Tipo** | SQL Relacional | NoSQL Documento | SQL Relacional |
| **Queries** | Complexas, JOINs | Simples, denormalizadas | Complexas, JOINs |
| **Escalabilidade** | Vertical | ✅ Horizontal automático | Vertical/Read Replicas |
| **Custo** | ~$20-50/mês (VPS) | Pay-per-use (pode ser $0-10/mês inicial) | ~$30-100/mês |
| **Real-time** | WebSockets manual | ✅ Nativo | WebSockets manual |
| **Migrations** | Prisma (bom) | Não precisa | Prisma (bom) |
| **Backup** | Manual | ✅ Automático | ✅ Automático |
| **Experiência local** | Docker necessário | ✅ Emulador local | Docker necessário |

**Para seu caso (plataforma de cursos):**
- O modelo de dados é RELACIONAL (Course → Module → Video → Progress)
- Firestore requer "denormalização" (duplicar dados)
- Cloud SQL manteria a estrutura atual com Prisma

**🏆 Decisão:** 
- **Firestore** = Mais fácil para começar, mas requer repensar o modelo
- **Cloud SQL** = Mantém estrutura atual, mais custo fixo

---

### 3. 🚀 Backend/API

| Aspecto | NestJS (atual) | Cloud Functions | Cloud Run |
|---------|----------------|-----------------|-----------|
| **Cold Start** | Não tem | ⚠️ 1-5s (Node.js) | ⚠️ 0-3s |
| **Escalabilidade** | Manual | ✅ Automática | ✅ Automática |
| **Custo** | Fixo (servidor) | Pay-per-invocation | Pay-per-request |
| **Complexidade** | Média | Baixa | Média |
| **WebSockets** | ✅ Suporta | ❌ Não | ✅ Suporta |
| **Long-running** | ✅ Sim | ⚠️ Max 9min | ✅ Sim |
| **Deploy** | Manual | ✅ Firebase CLI | ✅ Cloud Build |

**Para seu caso:**
- Upload de vídeos TUS já está implementado no NestJS
- Cloud Functions tem limite de 9 minutos (ruim para processamento longo)
- Cloud Run pode rodar o NestJS atual COM POUCAS MUDANÇAS

**🏆 Vencedor: Cloud Run** - Pode rodar o backend atual com mínimas alterações.

---

### 4. 📱 Suporte Mobile

| Aspecto | Arquitetura Atual | Firebase + GCP |
|---------|------------------|----------------|
| **iOS SDK** | Implementar do zero | ✅ Firebase SDK pronto |
| **Android SDK** | Implementar do zero | ✅ Firebase SDK pronto |
| **Push Notifications** | Implementar (FCM ou OneSignal) | ✅ Firebase Cloud Messaging |
| **Offline Support** | Implementar | ✅ Firestore offline |
| **Analytics** | Implementar (Mixpanel, etc) | ✅ Firebase Analytics |
| **Crash Reports** | Implementar | ✅ Firebase Crashlytics |

**🏆 Vencedor: Firebase** - SDKs prontos economizam meses de trabalho.

---

### 5. 💰 Custos Estimados

#### Arquitetura Atual (Auto-hospedado)
```
VPS (DigitalOcean/Hetzner): $20-50/mês
PostgreSQL (managed): $15-30/mês
Cloudflare Stream: $5/1000 minutos assistidos
Total estimado: $40-100/mês inicial
```

#### GCP (Firebase + Cloud Run)
```
Firebase Auth: $0 (até 50k users/mês)
Firestore: $0-10/mês (tier gratuito generoso)
Cloud Run: $0-20/mês (tier gratuito: 2M requests/mês)
Cloudflare Stream: $5/1000 minutos assistidos
Firebase Storage: $0-5/mês (5GB free)
Total estimado: $10-50/mês inicial
```

**🏆 Vencedor inicial: GCP** - Tier gratuito muito generoso para MVP/início.

---

## 🔄 Cenários de Migração

### Cenário A: Migração Completa (Reescrever tudo)
⏱️ **Tempo estimado:** 3-4 semanas  
❌ **NÃO RECOMENDADO** - Perderia todo o trabalho já feito

### Cenário B: Migração Gradual (Híbrido)
⏱️ **Tempo estimado:** 1-2 semanas  
✅ **RECOMENDADO** - Aproveita o que funciona

```
Manter:
├── Frontend Next.js (deploy no Vercel ou Firebase Hosting)
├── Backend NestJS (deploy no Cloud Run)
├── Cloudflare Stream (vídeos)
└── Estrutura de código atual

Substituir:
├── PostgreSQL → Cloud SQL ou Firestore
├── JWT Custom → Firebase Auth
├── Docker local → Emuladores Firebase
└── Deploy manual → CI/CD automático
```

### Cenário C: Manter Arquitetura, Melhorar Deploy
⏱️ **Tempo estimado:** 3-5 dias  
✅ **TAMBÉM VÁLIDO** - Menor risco

```
Manter tudo, apenas:
├── Deploy backend → Cloud Run ou Railway
├── Deploy frontend → Vercel
├── Database → Cloud SQL ou Supabase
└── Adicionar Firebase Auth (opcional, só para mobile)
```

---

## 🎯 Recomendação Final

### Para o seu caso específico, recomendo: **CENÁRIO B (Híbrido)**

**Razões:**

1. **Você já tem código funcionando** - Não faz sentido jogar fora
2. **Firebase Auth é muito superior** - Economiza semanas de trabalho em segurança
3. **Cloud Run suporta NestJS** - Deploy com Dockerfile existente
4. **Cloudflare Stream** - Já funciona perfeitamente, mantenha
5. **Escalabilidade** - GCP escala automaticamente
6. **Mobile** - SDKs prontos quando for desenvolver apps nativos

### Plano de Ação Recomendado:

#### Fase 1 (1-2 dias): Manter e Otimizar
```
1. Deploy do frontend atual no Vercel (grátis, excelente para Next.js)
2. Deploy do backend atual no Cloud Run (Dockerfile)
3. Manter PostgreSQL (migrar para Cloud SQL ou Supabase depois)
```

#### Fase 2 (3-5 dias): Integrar Firebase Auth
```
1. Adicionar Firebase Auth ao projeto
2. Criar middleware de autenticação híbrido (aceita Firebase + JWT atual)
3. Migrar gradualmente usuários
4. Remover JWT custom quando todos migrarem
```

#### Fase 3 (Opcional/Futuro): Se precisar de escala
```
1. Migrar PostgreSQL → Cloud SQL (ou Firestore se quiser NoSQL)
2. Adicionar Firebase Analytics
3. Desenvolver apps mobile com SDKs Firebase
```

---

## ✅ Conclusão

**É viável migrar?** SIM, mas de forma GRADUAL.

**Vale a pena?** DEPENDE:
- ✅ Se você planeja ter apps mobile nativos → MUITO vale
- ✅ Se quer deploy/escala automática → Vale
- ⚠️ Se só precisa de web → A arquitetura atual já funciona bem

**Minha recomendação:**
1. **NÃO reescreva do zero** - Você já tem muito código bom
2. **Faça deploy do que tem** - Vercel (frontend) + Cloud Run (backend)
3. **Adicione Firebase Auth** - É o maior ganho com menor esforço
4. **Mantenha Cloudflare Stream** - Já está funcionando
5. **Migre banco de dados depois** - Não é urgente

---

## 📊 Matriz de Decisão

| Critério | Peso | Atual | GCP Completo | GCP Híbrido |
|----------|------|-------|--------------|-------------|
| Tempo de desenvolvimento | 30% | 7/10 | 4/10 | 8/10 |
| Facilidade de manutenção | 20% | 6/10 | 9/10 | 8/10 |
| Escalabilidade | 15% | 5/10 | 10/10 | 9/10 |
| Custo inicial | 15% | 6/10 | 9/10 | 9/10 |
| Suporte mobile futuro | 10% | 3/10 | 10/10 | 9/10 |
| Risco de migração | 10% | 10/10 | 3/10 | 7/10 |
| **TOTAL** | 100% | **6.2** | **7.2** | **8.3** |

**🏆 Vencedor: GCP Híbrido (8.3/10)**

---

## 📌 Próximos Passos (se decidir pelo híbrido)

1. [ ] Criar projeto no Google Cloud Console
2. [ ] Criar projeto no Firebase Console
3. [ ] Configurar Firebase Auth
4. [ ] Fazer deploy do frontend no Vercel (mais fácil para Next.js)
5. [ ] Criar Dockerfile otimizado para o backend
6. [ ] Deploy do backend no Cloud Run
7. [ ] Configurar Cloud SQL ou manter PostgreSQL em outro serviço
8. [ ] Testar integração Firebase Auth com backend
9. [ ] Migrar fluxo de login para Firebase Auth
10. [ ] Configurar CI/CD (GitHub Actions)

---

**Quer que eu detalhe algum aspecto específico ou prossiga com a implementação do cenário híbrido?**
