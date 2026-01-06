# Cloudflare Stream & R2 - Estimativa de Custos

## 📋 Visão Geral

Estimativa detalhada de custos para Cloudflare Stream e R2 no Projeto Cirurgião, com projeções por fase do projeto.

## 💰 Pricing Cloudflare Stream

### Custos Base

| Item | Preço | Unidade |
|------|-------|---------|
| **Storage** | $5.00 | 1.000 minutos armazenados/mês |
| **Delivery** | $1.00 | 1.000 minutos entregues |
| **Encoding** | Incluído | Transcodificação automática |

### Características

- ✅ Sem custo de bandwidth separado
- ✅ Transcodificação incluída (múltiplas resoluções)
- ✅ Thumbnails automáticos incluídos
- ✅ CDN global incluído
- ✅ Analytics incluído
- ✅ Sem limite de viewers simultâneos

## 💾 Pricing Cloudflare R2

### Custos Base

| Item | Preço | Unidade |
|------|-------|---------|
| **Storage** | $0.015 | GB/mês |
| **Class A Operations** | $4.50 | 1 milhão (write, list) |
| **Class B Operations** | $0.36 | 1 milhão (read) |
| **Egress** | **$0.00** | **GRÁTIS!** |

### Características

- ✅ **Zero custo de egress** (maior vantagem!)
- ✅ Compatível com S3
- ✅ Replicação global automática
- ✅ Sem custo de transferência entre R2 e Stream

## 📊 Projeções por Fase

### Fase 1: MVP (Meses 1-3)

**Premissas:**
- 50 vídeos de 30 minutos cada
- 1.000 usuários ativos/mês
- Média de 5 vídeos assistidos por usuário
- 50% completion rate

#### Cloudflare Stream

```
Storage:
- 50 vídeos × 30 min = 1.500 minutos
- Custo: (1.500 / 1.000) × $5 = $7.50/mês

Delivery:
- 1.000 usuários × 5 vídeos × 30 min × 50% = 75.000 minutos
- Custo: (75.000 / 1.000) × $1 = $75.00/mês

Total Stream: $82.50/mês
```

#### Cloudflare R2

```
Storage:
- Vídeos originais: 50 × 500MB = 25GB
- Thumbnails: 50 × 3 × 100KB = 15MB
- Outros assets: 5GB
- Total: 30GB
- Custo: 30 × $0.015 = $0.45/mês

Operations:
- Uploads (Class A): 500/mês × $4.50/1M = $0.002
- Downloads (Class B): 10.000/mês × $0.36/1M = $0.004
- Total: $0.006/mês

Total R2: $0.46/mês
```

**Total Fase MVP: ~$83/mês**

### Fase 2: Beta (Meses 4-6)

**Premissas:**
- 200 vídeos
- 10.000 usuários ativos/mês
- Média de 8 vídeos assistidos por usuário
- 60% completion rate

#### Cloudflare Stream

```
Storage:
- 200 vídeos × 30 min = 6.000 minutos
- Custo: (6.000 / 1.000) × $5 = $30.00/mês

Delivery:
- 10.000 × 8 × 30 × 60% = 1.440.000 minutos
- Custo: (1.440.000 / 1.000) × $1 = $1.440.00/mês

Total Stream: $1.470/mês
```

#### Cloudflare R2

```
Storage:
- Vídeos: 200 × 500MB = 100GB
- Thumbnails e assets: 10GB
- Total: 110GB
- Custo: 110 × $0.015 = $1.65/mês

Operations:
- Uploads: 2.000/mês × $4.50/1M = $0.009
- Downloads: 100.000/mês × $0.36/1M = $0.036
- Total: $0.045/mês

Total R2: $1.70/mês
```

**Total Fase Beta: ~$1.472/mês**

### Fase 3: Launch (Meses 7-12)

**Premissas:**
- 500 vídeos
- 50.000 usuários ativos/mês
- Média de 10 vídeos assistidos por usuário
- 70% completion rate

#### Cloudflare Stream

```
Storage:
- 500 vídeos × 30 min = 15.000 minutos
- Custo: (15.000 / 1.000) × $5 = $75.00/mês

Delivery:
- 50.000 × 10 × 30 × 70% = 10.500.000 minutos
- Custo: (10.500.000 / 1.000) × $1 = $10.500.00/mês

Total Stream: $10.575/mês
```

#### Cloudflare R2

```
Storage:
- Vídeos: 500 × 500MB = 250GB
- Thumbnails e assets: 25GB
- Total: 275GB
- Custo: 275 × $0.015 = $4.13/mês

Operations:
- Uploads: 5.000/mês × $4.50/1M = $0.023
- Downloads: 500.000/mês × $0.36/1M = $0.18
- Total: $0.20/mês

Total R2: $4.33/mês
```

**Total Fase Launch: ~$10.579/mês**

### Fase 4: Scale (Ano 2+)

**Premissas:**
- 1.000 vídeos
- 200.000 usuários ativos/mês
- Média de 12 vídeos assistidos por usuário
- 75% completion rate

#### Cloudflare Stream

```
Storage:
- 1.000 vídeos × 30 min = 30.000 minutos
- Custo: (30.000 / 1.000) × $5 = $150.00/mês

Delivery:
- 200.000 × 12 × 30 × 75% = 54.000.000 minutos
- Custo: (54.000.000 / 1.000) × $1 = $54.000.00/mês

Total Stream: $54.150/mês
```

#### Cloudflare R2

```
Storage:
- Vídeos: 1.000 × 500MB = 500GB
- Thumbnails e assets: 50GB
- Total: 550GB
- Custo: 550 × $0.015 = $8.25/mês

Operations:
- Uploads: 10.000/mês × $4.50/1M = $0.045
- Downloads: 2.000.000/mês × $0.36/1M = $0.72
- Total: $0.77/mês

Total R2: $9.02/mês
```

**Total Fase Scale: ~$54.159/mês**

## 📈 Resumo Executivo

| Fase | Usuários | Vídeos | Stream | R2 | **Total/mês** | **Total/ano** |
|------|----------|--------|--------|----|--------------:|-------------:|
| MVP | 1K | 50 | $82.50 | $0.46 | **$83** | **$996** |
| Beta | 10K | 200 | $1.470 | $1.70 | **$1.472** | **$17.664** |
| Launch | 50K | 500 | $10.575 | $4.33 | **$10.579** | **$126.948** |
| Scale | 200K | 1.000 | $54.150 | $9.02 | **$54.159** | **$649.908** |

## 💡 Otimizações de Custo

### 1. Reduzir Minutos Entregues

**Estratégias:**

- **Thumbnails Inteligentes**: Mostrar preview antes do play
- **Lazy Loading**: Carregar vídeo apenas quando visível
- **Completion Tracking**: Incentivar conclusão de vídeos
- **Qualidade Adaptativa**: Ajustar resolução automaticamente

**Impacto Estimado:** -15% a -25% nos custos de delivery

### 2. Otimizar Storage

**Estratégias:**

- **Lifecycle Rules**: Deletar vídeos antigos/não utilizados
- **Compressão**: Otimizar vídeos antes do upload
- **Deduplicação**: Evitar uploads duplicados

**Impacto Estimado:** -10% a -20% nos custos de storage

### 3. Cache Inteligente

**Estratégias:**

- **CDN Caching**: Aproveitar cache do Cloudflare
- **Prefetch**: Pré-carregar próximo vídeo
- **Service Workers**: Cache local no browser

**Impacto Estimado:** -5% a -10% nos custos de delivery

### 4. Análise de Uso

**Métricas para Monitorar:**

```typescript
// Dashboard de custos
interface CostMetrics {
  storageMinutes: number;
  deliveryMinutes: number;
  avgCompletionRate: number;
  costPerUser: number;
  costPerView: number;
}

// Alertas
if (costPerUser > threshold) {
  // Investigar uso anormal
  // Otimizar delivery
}
```

## 🔄 Comparação com Alternativas

### AWS MediaConvert + CloudFront

```
Estimativa Fase Launch (50K usuários):

MediaConvert (transcodificação):
- 500 vídeos × 30 min = 15.000 minutos
- $0.015/min = $225/mês

S3 Storage:
- 250GB × $0.023 = $5.75/mês

CloudFront (delivery):
- 10.5M minutos × 2MB/min = 21TB
- Primeiros 10TB: $0.085/GB = $850
- Próximos 11TB: $0.080/GB = $880
- Total: $1.730/mês

Total AWS: ~$1.961/mês
```

**Cloudflare é 5.4x mais barato!** ($10.579 vs $1.961)

### Mux

```
Estimativa Fase Launch:

Storage:
- 15.000 minutos × $0.005 = $75/mês

Delivery:
- 10.5M minutos × $0.015 = $157.500/mês

Total Mux: ~$157.575/mês
```

**Cloudflare é 14.9x mais barato!** ($10.579 vs $157.575)

## 📊 ROI e Break-even

### Custo por Usuário

| Fase | Usuários | Custo Total | Custo/Usuário |
|------|----------|-------------|---------------|
| MVP | 1.000 | $83 | $0.083 |
| Beta | 10.000 | $1.472 | $0.147 |
| Launch | 50.000 | $10.579 | $0.212 |
| Scale | 200.000 | $54.159 | $0.271 |

### Receita Necessária

Assumindo assinatura de R$ 49,90/mês (~$10):

| Fase | Custo/mês | Assinaturas Necessárias | % da Base |
|------|-----------|-------------------------|-----------|
| MVP | $83 | 9 | 0.9% |
| Beta | $1.472 | 148 | 1.5% |
| Launch | $10.579 | 1.058 | 2.1% |
| Scale | $54.159 | 5.416 | 2.7% |

**Conclusão**: Com apenas 2-3% de conversão, os custos de infraestrutura de vídeo são cobertos!

## 🎯 Recomendações

### Curto Prazo (MVP/Beta)

1. ✅ Implementar Cloudflare Stream + R2
2. ✅ Configurar analytics detalhado
3. ✅ Monitorar completion rate
4. ✅ Otimizar qualidade de vídeo

### Médio Prazo (Launch)

1. 📊 Implementar dashboard de custos
2. 🔄 Configurar lifecycle rules
3. 📈 A/B test de qualidade vs custo
4. 💰 Negociar volume discount com Cloudflare

### Longo Prazo (Scale)

1. 🤖 Automação de otimizações
2. 📉 Machine learning para predição de custos
3. 🌍 Análise de distribuição geográfica
4. 💡 Explorar CDN próprio para economia adicional

## 📞 Contato Cloudflare

Para negociação de volume ou enterprise pricing:
- Email: sales@cloudflare.com
- Threshold para desconto: ~$5.000/mês
- Desconto típico: 10-30% dependendo do volume

---

**Última Atualização**: 09/11/2025  
**Responsável**: Carolina (DevOps Engineer)  
**Status**: ✅ Documentado

**Nota**: Valores em USD. Taxas de câmbio podem variar. Custos são estimativas baseadas em uso projetado e podem variar conforme padrões reais de uso.
