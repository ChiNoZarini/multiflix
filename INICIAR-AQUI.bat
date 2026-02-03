@echo off
title Stream Monitor - HAZ DOBLE CLIC AQUI
color 0A
cls

echo.
echo ==========================================
echo          STREAM MONITOR v1.0
echo ==========================================
echo.
echo  HAZ DOBLE CLIC EN ESTE ARCHIVO PARA INICIAR
echo.
echo  El servidor se iniciara en:
echo  http://localhost:3000/
echo.
echo ==========================================
echo.

REM Verificar Node.js rapido
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no encontrado
    echo Instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Iniciando servidor...
echo [OK] El navegador se abrira automaticamente
echo.

REM Abrir navegador (sin timeout que puede fallar)
start http://localhost:3000

REM Iniciar servidor
npm run dev

REM Al salir
echo.
echo Servidor detenido.
echo Cierra esta ventana o presiona cualquier tecla.
pause >nul