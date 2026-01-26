@echo off
echo ========================================
echo Reconstruindo Backend com Prisma Client
echo ========================================
echo.

echo [1/3] Gerando Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERRO ao gerar Prisma Client!
    pause
    exit /b 1
)
echo.

echo [2/3] Recompilando TypeScript...
call npm run build
if errorlevel 1 (
    echo ERRO ao compilar TypeScript!
    pause
    exit /b 1
)
echo.

echo [3/3] Iniciando servidor...
echo.
echo ========================================
echo Backend reconstruido com sucesso!
echo Iniciando servidor em modo desenvolvimento...
echo ========================================
echo.

call npm run start:dev