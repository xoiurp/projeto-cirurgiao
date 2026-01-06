# 🔴 SOLUÇÃO: Erro 403 Authentication Error - Cloudflare

## 📋 Problema

```
TUS upload failed: tus: unexpected response while creating upload, 
originated from request (method: POST, 
url: https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream, 
response code: 403, 
response text: {"success":false,"errors":[{"code":10000,"message":"Authentication error"}]}
```

## 🔍 Causa

O token da API do Cloudflare (`atbQzEFtkWsQzg1WldCUqEnzYCH8vu1JVkjTMqgc`) está:
- ❌ Inválido
- ❌ Expirado
- ❌ Sem permissões necessárias para Stream

## ✅ SOLUÇÃO: Criar Novo Token

### Passo 1: Acessar Cloudflare Dashboard

1. Acesse: https://dash.cloudflare.com
2. Faça login com sua conta

### Passo 2: Ir para API Tokens

1. Clique no ícone do seu perfil (canto superior direito)
2. Clique em **"My Profile"**
3. No menu lateral, clique em **"API Tokens"**
4. Ou acesse diretamente: https://dash.cloudflare.com/profile/api-tokens

### Passo 3: Criar Token Personalizado

1. Clique em **"Create Token"**
2. Clique em **"Create Custom Token"** (não use templates prontos)

### Passo 4: Configurar Permissões

Configure exatamente assim:

**Token name:**
```
Projeto Cirurgião - Stream Upload
```

**Permissions:**

Adicione estas 2 permissões:

| Type | Permission | Access |
|------|------------|--------|
| Account | Stream | Edit ✅ |
| Account | Stream | Read ✅ |

**Account Resources:**
- Include → Specific account → Selecione sua conta

**Client IP Address Filtering:** (deixe vazio)

**TTL:** (deixe como padrão ou escolha "No expiry")

### Passo 5: Criar e Copiar Token

1. Clique em **"Continue to summary"**
2. Revise as permissões
3. Clique em **"Create Token"**
4. ⚠️ **IMPORTANTE**: Copie o token **IMEDIATAMENTE**
   - Ele será mostrado apenas uma vez
   - Salve em um local seguro

### Passo 6: Atualizar .env

1. Abra o arquivo `backend-api/.env`
2. Substitua o valor de `CLOUDFLARE_API_TOKEN`:

```env
CLOUDFLARE_API_TOKEN="seu_novo_token_aqui"
```

3. Salve o arquivo

### Passo 7: Reiniciar o Backend

```powershell
# Pare o servidor (Ctrl+C)
# Depois execute:
cd backend-api
npm run start:dev
```

### Passo 8: Testar Upload

1. Acesse o frontend: http://localhost:3001
2. Vá para um curso → módulo
3. Tente fazer upload de um vídeo
4. O erro 403 não deve mais aparecer

---

## 🎯 EXEMPLO DE TOKEN CORRETO

O token deve:
- ✅ Começar com letras e números aleatórios
- ✅ Ter aproximadamente 40+ caracteres
- ✅ Conter apenas caracteres alfanuméricos
- ✅ Exemplo: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

---

## 🔍 VERIFICAR SE O TOKEN ESTÁ FUNCIONANDO

Execute este comando para testar o token:

```powershell
curl -X GET "https://api.cloudflare.com/client/v4/accounts/ad41f4e2927a6daf25f7c7d6891e31bd/stream" `
  -H "Authorization: Bearer SEU_TOKEN_AQUI" `
  -H "Content-Type: application/json"
```

**Resposta esperada (sucesso):**
```json
{
  "success": true,
  "result": [],
  "messages": [],
  "errors": []
}
```

**Resposta de erro (token inválido):**
```json
{
  "success": false,
  "errors": [
    {
      "code": 10000,
      "message": "Authentication error"
    }
  ]
}
```

---

## 📸 CAPTURAS DE TELA DO PROCESSO

### 1. Página de API Tokens
![API Tokens](https://i.imgur.com/exemplo1.png)
- Clique em "Create Token"

### 2. Configuração de Permissões
![Permissions](https://i.imgur.com/exemplo2.png)
- Account → Stream → Edit ✅
- Account → Stream → Read ✅

### 3. Token Criado
![Token Created](https://i.imgur.com/exemplo3.png)
- ⚠️ Copie imediatamente!

---

## 🆘 AINDA NÃO FUNCIONOU?

### Alternativa 1: Usar Token de API Global (Não Recomendado para Produção)

Se você continuar tendo problemas, pode usar temporariamente o **API Key Global**:

1. Vá para: https://dash.cloudflare.com/profile/api-tokens
2. Role até "API Keys"
3. Clique em "View" no "Global API Key"
4. Copie a chave
5. Use como `CLOUDFLARE_API_TOKEN`

⚠️ **ATENÇÃO**: Este método NÃO é recomendado para produção, pois dá acesso total à sua conta.

### Alternativa 2: Verificar Account ID

Certifique-se de que o Account ID está correto:

1. Vá para: https://dash.cloudflare.com
2. Clique em "Stream" no menu lateral
3. O Account ID aparece no canto superior direito
4. Verifique se corresponde ao que está no `.env`

**Account ID atual no .env:**
```
CLOUDFLARE_ACCOUNT_ID="ad41f4e2927a6daf25f7c7d6891e31bd"
```

### Alternativa 3: Limpar Cache e Reiniciar

```powershell
# Parar todos os servidores
# Depois:
cd backend-api
rm -rf node_modules/.cache
npm run start:dev
```

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Token criado com permissões corretas (Stream Edit + Read)
- [ ] Token copiado e salvo
- [ ] Token atualizado no `backend-api/.env`
- [ ] Backend reiniciado
- [ ] Upload testado novamente
- [ ] Erro 403 resolvido

---

## 📞 SUPORTE ADICIONAL

Se o problema persistir:

1. **Verifique os logs do backend** para mais detalhes
2. **Teste o token** com o comando curl acima
3. **Confirme as permissões** do token no dashboard
4. **Considere criar uma nova conta** se necessário (temporariamente)

---

**Última atualização:** 01/12/2025
