# 🐳 Instalação do Docker Desktop no Windows

## Projeto Cirurgião - Guia de Instalação

Este guia descreve como instalar o Docker Desktop no Windows para rodar o ambiente de desenvolvimento local.

---

## 📋 Requisitos do Sistema

- **Windows 10/11** (64-bit)
- **WSL 2** (Windows Subsystem for Linux 2)
- **Virtualização** habilitada na BIOS
- **Mínimo 4GB RAM** (recomendado 8GB+)
- **Mínimo 20GB** de espaço em disco

---

## 🚀 Passo a Passo da Instalação

### 1. Habilitar WSL 2

Abra o PowerShell como **Administrador** e execute:

```powershell
# Habilitar WSL
wsl --install

# Ou, se já tiver WSL instalado, atualize para WSL 2
wsl --set-default-version 2
```

**Reinicie o computador** após este passo.

### 2. Baixar o Docker Desktop

1. Acesse: https://www.docker.com/products/docker-desktop
2. Clique em **"Download for Windows"**
3. Execute o instalador baixado (`Docker Desktop Installer.exe`)

### 3. Instalar o Docker Desktop

1. Execute o instalador
2. Marque a opção **"Use WSL 2 instead of Hyper-V"** (recomendado)
3. Siga o assistente de instalação
4. **Reinicie o computador** quando solicitado

### 4. Configurar o Docker Desktop

Após reiniciar:

1. Abra o **Docker Desktop**
2. Aguarde o Docker inicializar completamente
3. Você verá um ícone de baleia na bandeja do sistema quando estiver pronto
4. Aceite os termos de serviço se solicitado

### 5. Verificar a Instalação

Abra o PowerShell ou CMD e execute:

```bash
docker --version
docker compose version
```

Você deve ver algo como:
```
Docker version 24.0.x, build xxxxx
Docker Compose version v2.x.x
```

---

## ⚙️ Configurações Recomendadas

### Recursos do Docker Desktop

1. Abra o Docker Desktop
2. Vá em **Settings** (ícone de engrenagem)
3. Em **Resources**:
   - **CPUs**: Mínimo 2, recomendado 4
   - **Memory**: Mínimo 4GB, recomendado 8GB
   - **Disk**: Mínimo 20GB

### WSL Integration

1. Em **Settings** → **Resources** → **WSL Integration**
2. Habilite a integração com suas distribuições WSL (se aplicável)

---

## 🔧 Troubleshooting

### Problema: "WSL 2 installation is incomplete"

**Solução**:
1. Baixe e instale o pacote de atualização do kernel do WSL 2:
   https://aka.ms/wsl2kernel
2. Reinicie o Docker Desktop

### Problema: "Docker Desktop requires Windows 10 Pro/Enterprise"

**Solução**:
- O Docker Desktop funciona no Windows 10/11 Home com WSL 2
- Certifique-se de ter a versão mais recente do Windows
- Execute Windows Update

### Problema: "Virtualização não está habilitada"

**Solução**:
1. Reinicie o computador
2. Entre na BIOS/UEFI (geralmente F2, F10, Del ou Esc durante o boot)
3. Procure por "Virtualization Technology" ou "VT-x" ou "AMD-V"
4. Habilite a opção
5. Salve e reinicie

### Problema: Docker Desktop não inicia

**Solução**:
1. Verifique se o serviço está rodando:
   - Abra "Serviços" (services.msc)
   - Procure por "Docker Desktop Service"
   - Inicie o serviço se estiver parado
2. Tente reiniciar o Docker Desktop
3. Se persistir, desinstale e reinstale o Docker Desktop

---

## 📚 Recursos Adicionais

- **Documentação Oficial**: https://docs.docker.com/desktop/windows/install/
- **WSL 2 Documentation**: https://docs.microsoft.com/windows/wsl/
- **Docker Hub**: https://hub.docker.com/

---

## ✅ Próximos Passos

Após instalar o Docker Desktop com sucesso:

1. ✅ Verifique se o Docker está rodando (ícone na bandeja)
2. ✅ Execute `docker --version` para confirmar
3. ✅ Siga o guia [setup-local.md](./setup-local.md) para configurar o ambiente
4. ✅ Execute `scripts/start-dev.bat` para iniciar o ambiente

---

## 🆘 Precisa de Ajuda?

Se encontrar problemas durante a instalação:

1. Consulte a seção de **Troubleshooting** acima
2. Verifique a documentação oficial do Docker
3. Entre em contato com a equipe DevOps

---

**Documentação criada por**: DevOps Team - Projeto Cirurgião  
**Última atualização**: Semana 2  
**Versão**: 1.0.0
