# 📋 Documentação de QA - Projeto Cirurgião

## Visão Geral

Esta pasta contém toda a documentação de Quality Assurance (QA) do Projeto Cirurgião, incluindo test cases, relatórios de testes, bugs documentados e guias de teste.

---

## 📁 Estrutura de Diretórios

```
docs/qa/
├── README.md                    # Este arquivo
├── test-cases/                  # Casos de teste por plataforma
│   ├── auth-backend.md         # 15 test cases - Backend API
│   ├── auth-frontend.md        # 20 test cases - Frontend Web
│   ├── auth-ios.md             # 20 test cases - App iOS
│   └── auth-android.md         # 25 test cases - App Android
├── test-reports/               # Relatórios de execução de testes
│   └── week-02-auth-testing.md # Relatório Semana 2
└── bugs/                       # Bugs documentados
    └── (aguardando bugs)
```

---

## 📊 Estatísticas Atuais

### Test Cases Criados
- **Total**: 80 casos de teste
- **Backend**: 15 casos
- **Frontend**: 20 casos
- **iOS**: 20 casos
- **Android**: 25 casos

### Por Prioridade
- 🔴 **Alta**: 41 casos (51%)
- 🟡 **Média**: 33 casos (41%)
- 🟢 **Baixa**: 6 casos (8%)

### Testes Automatizados
- **iOS**: 12 testes unitários ✅
- **Android**: 3 testes unitários ✅
- **Backend**: 0 testes ❌
- **Frontend**: 0 testes ❌

---

## 🎯 Como Usar Esta Documentação

### Para QA Engineers

1. **Executar Testes Manuais**
   - Acesse a pasta `test-cases/`
   - Escolha a plataforma desejada
   - Siga os passos de cada test case
   - Documente os resultados

2. **Reportar Bugs**
   - Crie um arquivo na pasta `bugs/`
   - Use o formato: `BUG-XXX-description.md`
   - Siga o template de bug report

3. **Criar Relatórios**
   - Adicione relatórios na pasta `test-reports/`
   - Use o formato: `week-XX-feature-testing.md`
   - Inclua métricas e análises

### Para Desenvolvedores

1. **Consultar Test Cases**
   - Verifique os test cases antes de implementar features
   - Use como referência para testes automatizados
   - Valide se sua implementação atende aos critérios

2. **Verificar Bugs**
   - Consulte a pasta `bugs/` regularmente
   - Priorize correções por severidade
   - Atualize status dos bugs

3. **Revisar Relatórios**
   - Leia os relatórios de teste
   - Implemente melhorias sugeridas
   - Aumente cobertura de testes

---

## 📝 Templates

### Template de Test Case

```markdown
## TC-XXX-001: Nome do Teste

### Objetivo
Descrição clara do que está sendo testado

### Pré-condições
- Condição 1
- Condição 2

### Passos
1. Passo 1
2. Passo 2
3. Passo 3

### Resultado Esperado
- Resultado 1
- Resultado 2

### Prioridade
🔴 Alta / 🟡 Média / 🟢 Baixa

### Status
⏳ Pendente / ✅ Passou / ❌ Falhou / ⚠️ Bloqueado
```

### Template de Bug Report

```markdown
# BUG-XXX: Título do Bug

## Informações
- **Severidade**: Crítica / Alta / Média / Baixa
- **Prioridade**: Alta / Média / Baixa
- **Plataforma**: Backend / Frontend / iOS / Android
- **Reportado por**: Nome
- **Data**: DD/MM/YYYY
- **Status**: Aberto / Em Progresso / Resolvido / Fechado

## Descrição
Descrição detalhada do bug

## Passos para Reproduzir
1. Passo 1
2. Passo 2
3. Passo 3

## Resultado Esperado
O que deveria acontecer

## Resultado Atual
O que está acontecendo

## Evidências
- Screenshots
- Logs
- Vídeos

## Ambiente
- OS: 
- Versão:
- Browser/Device:

## Possível Causa
Análise técnica (opcional)

## Sugestão de Correção
Sugestão de como corrigir (opcional)
```

---

## 🔍 Guias de Teste

### Backend API

**Ferramentas Recomendadas**:
- Postman / Insomnia para testes manuais
- Jest para testes automatizados
- Supertest para testes de integração

**Endpoints de Autenticação**:
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/forgot-password
GET  /api/users/me
```

### Frontend Web

**Ferramentas Recomendadas**:
- Chrome DevTools
- React Developer Tools
- React Testing Library
- Playwright / Cypress

**URLs de Teste**:
```
http://localhost:3001/login
http://localhost:3001/register
http://localhost:3001/forgot-password
http://localhost:3001/dashboard
```

### iOS

**Ferramentas Recomendadas**:
- Xcode Simulator
- XCTest
- Instruments (para performance)

**Comandos Úteis**:
```bash
# Rodar testes
xcodebuild test -scheme CirurgiaoApp

# Rodar testes específicos
xcodebuild test -scheme CirurgiaoApp -only-testing:CirurgiaoAppTests/AuthViewModelTests
```

### Android

**Ferramentas Recomendadas**:
- Android Studio Emulator
- JUnit + MockK
- Android Profiler

**Comandos Úteis**:
```bash
# Rodar testes
./gradlew test

# Rodar testes específicos
./gradlew test --tests LoginViewModelTest

# Gerar relatório de cobertura
./gradlew jacocoTestReport
```

---

## 📈 Métricas de Qualidade

### Metas de Cobertura

| Plataforma | Meta | Atual | Status |
|------------|------|-------|--------|
| Backend    | >80% | 0%    | 🔴 Crítico |
| Frontend   | >70% | 0%    | 🔴 Crítico |
| iOS        | >70% | ~40%  | 🟡 Parcial |
| Android    | >70% | ~20%  | 🔴 Insuficiente |

### Definição de Pronto (DoD) para Testes

Uma feature só está pronta quando:
- [ ] Test cases criados e revisados
- [ ] Testes automatizados implementados
- [ ] Cobertura mínima atingida
- [ ] Testes manuais executados
- [ ] Bugs críticos corrigidos
- [ ] Documentação atualizada

---

## 🚀 Processo de QA

### 1. Planejamento
- Revisar requisitos da feature
- Criar test cases
- Definir estratégia de teste
- Estimar esforço

### 2. Preparação
- Configurar ambiente de teste
- Preparar dados de teste
- Revisar test cases com a equipe

### 3. Execução
- Executar testes manuais
- Rodar testes automatizados
- Documentar resultados
- Reportar bugs

### 4. Análise
- Analisar resultados
- Calcular métricas
- Identificar tendências
- Criar relatório

### 5. Melhoria
- Revisar processo
- Atualizar test cases
- Melhorar automação
- Compartilhar aprendizados

---

## 🔗 Links Úteis

### Documentação do Projeto
- [Coding Standards](../standards/coding-standards.md)
- [Architecture Overview](../architecture/system-overview.md)
- [Setup Local](../setup-local.md)

### Ferramentas
- [Postman](https://www.postman.com/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [XCTest](https://developer.apple.com/documentation/xctest)
- [JUnit](https://junit.org/)

### Referências
- [Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Testing Best Practices](https://testingjavascript.com/)
- [Mobile Testing Guide](https://www.ministryoftesting.com/dojo/lessons/mobile-testing-guide)

---

## 👥 Equipe de QA

### QA-01: Carlos
- **Papel**: QA Engineer
- **Responsabilidades**:
  - Criação de test cases
  - Execução de testes manuais
  - Validação de testes automatizados
  - Reporte de bugs
  - Garantia de qualidade

### Contato
- **Email**: qa@projetocirurgiao.com
- **Slack**: #qa-team

---

## 📅 Histórico de Versões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | 09/11/2025 | Carlos (QA-01) | Criação inicial da documentação de QA |

---

## 📌 Notas Importantes

1. **Sempre execute testes em ambiente de desenvolvimento primeiro**
2. **Documente todos os bugs encontrados, mesmo os menores**
3. **Mantenha os test cases atualizados**
4. **Comunique problemas críticos imediatamente**
5. **Revise relatórios de teste regularmente**

---

**Última Atualização**: 09/11/2025  
**Mantido por**: QA Team - Projeto Cirurgião
