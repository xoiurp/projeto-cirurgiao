@echo off
REM Script para parar o ambiente de desenvolvimento
REM Projeto Cirurgião - DevOps

echo ========================================
echo  PROJETO CIRURGIAO - PARAR AMBIENTE
echo ========================================
echo.

REM Verificar se Docker está rodando
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao esta rodando!
    echo.
    pause
    exit /b 1
)

echo [INFO] Parando containers...
echo.

docker-compose stop

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao parar containers!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  STATUS DOS CONTAINERS
echo ========================================
echo.
docker-compose ps
echo.
echo ========================================
echo Containers parados com sucesso!
echo ========================================
echo.
echo NOTA: Os dados foram preservados.
echo Para iniciar novamente, execute: start-dev.bat
echo Para remover completamente, execute: reset-db.bat
echo.
pause
