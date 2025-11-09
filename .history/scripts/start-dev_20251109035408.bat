@echo off
REM Script para iniciar o ambiente de desenvolvimento
REM Projeto Cirurgião - DevOps

echo ========================================
echo  PROJETO CIRURGIAO - AMBIENTE DEV
echo ========================================
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
docker-compose ps | findstr "Up" >nul 2>&1
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
        docker-compose restart
    )
) else (
    echo [INFO] Iniciando containers...
    echo.
    docker-compose up -d
    
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
docker-compose ps
echo.
echo ========================================
echo Ambiente iniciado com sucesso!
echo ========================================
echo.
pause
