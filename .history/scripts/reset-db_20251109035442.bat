@echo off
REM Script para resetar completamente o banco de dados
REM Projeto Cirurgião - DevOps
REM ATENÇÃO: Este script remove TODOS os dados!

echo ========================================
echo  PROJETO CIRURGIAO - RESET DATABASE
echo ========================================
echo.
echo [AVISO] Este script ira:
echo   1. Parar todos os containers
echo   2. Remover todos os containers
echo   3. Remover todos os volumes (DADOS SERAO PERDIDOS!)
echo   4. Recriar o ambiente do zero
echo.
echo ========================================
echo.

set /p confirm="Tem certeza que deseja continuar? (S/N): "
if /i not "%confirm%"=="S" (
    echo.
    echo Operacao cancelada.
    echo.
    pause
    exit /b 0
)

echo.
echo [INFO] Parando containers...
docker-compose down

echo.
echo [INFO] Removendo volumes...
docker-compose down -v

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao remover volumes!
    pause
    exit /b 1
)

echo.
echo [INFO] Limpando imagens orfas (opcional)...
docker image prune -f

echo.
echo ========================================
echo  RESET CONCLUIDO
echo ========================================
echo.
echo Todos os dados foram removidos.
echo.
echo Para iniciar o ambiente novamente, execute:
echo   start-dev.bat
echo.
pause
