@echo off
REM Script para iniciar o ambiente de desenvolvimento
REM Projeto Cirurgião - DevOps

echo ========================================
echo  PROJETO CIRURGIAO - AMBIENTE DEV
echo ========================================
echo.

REM Detectar comando do Docker Compose
set DOCKER_COMPOSE_CMD=
docker compose version >nul 2>&1
if %errorlevel% equ 0 (
    set DOCKER_COMPOSE_CMD=docker compose
) else (
    docker-compose version >nul 2>&1
    if %errorlevel% equ 0 (
        set DOCKER_COMPOSE_CMD=docker-compose
    )
)

REM Verificar se Docker está instalado
if "%DOCKER_COMPOSE_CMD%"=="" (
    echo [ERRO] Docker nao esta instalado ou nao esta no PATH!
    echo.
    echo Por favor, instale o Docker Desktop:
    echo https://www.docker.com/products/docker-desktop
    echo.
    echo Consulte: docs\INSTALACAO_DOCKER.md
    echo.
    pause
    exit /b 1
)

echo [OK] Docker Compose detectado: %DOCKER_COMPOSE_CMD%
echo.

REM Verificar se Docker está rodando
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao esta rodando!
    echo Por favor, inicie o Docker Desktop e tente novamente.
    echo.
    pause
    exit /b 1
)

echo [OK] Docker esta rodando
echo.

REM Verificar se já existem containers rodando
%DOCKER_COMPOSE_CMD% ps | findstr "Up" >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Containers ja estao rodando
    echo.
    docker-compose ps
    echo.
    echo Deseja reiniciar os containers? (S/N)
    set /p restart=
    if /i "%restart%"=="S" (
        echo.
        echo [INFO] Reiniciando containers...
        %DOCKER_COMPOSE_CMD% restart
    )
) else (
    echo [INFO] Iniciando containers...
    echo.
    %DOCKER_COMPOSE_CMD% up -d
    
    if %errorlevel% neq 0 (
        echo.
        echo [ERRO] Falha ao iniciar containers!
        pause
        exit /b 1
    )
    
    echo.
    echo [INFO] Aguardando servicos ficarem prontos...
    timeout /t 10 /nobreak >nul
)

echo.
echo ========================================
echo  SERVICOS DISPONIVEIS
echo ========================================
echo.
echo PostgreSQL:
echo   - Host: localhost
echo   - Porta: 5432
echo   - Database: projeto_cirurgiao
echo   - Usuario: postgres
echo   - Senha: postgres
echo.
echo Redis:
echo   - Host: localhost
echo   - Porta: 6379
echo   - Senha: redis_dev_password
echo.
echo pgAdmin (Interface Web):
echo   - URL: http://localhost:5050
echo   - Email: admin@projetocirurgiao.com
echo   - Senha: admin
echo.
echo ========================================
echo  STATUS DOS CONTAINERS
echo ========================================
echo.
%DOCKER_COMPOSE_CMD% ps
echo.
echo ========================================
echo Ambiente iniciado com sucesso!
echo ========================================
echo.
pause
