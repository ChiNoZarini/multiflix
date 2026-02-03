@echo off
color 0A
title Stream Monitor - Menú Principal

:menu
cls
echo =====================================
echo        STREAM MONITOR v1.0
echo    Gestor de Múltiples Streams
echo =====================================
echo.
echo Selecciona una opción:
echo.
echo [1] Iniciar Servidor de Desarrollo
echo [2] Build de Producción
echo [3] Preview Build de Producción
echo [4] Configuración Inicial del Proyecto
echo [5] Instalar/Actualizar Dependencias
echo [6] Limpiar Cache y Reinstalar
echo [7] Información del Proyecto
echo [0] Salir
echo.
echo =====================================
set /p choice="Ingresa tu elección (0-7): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto build
if "%choice%"=="3" goto preview
if "%choice%"=="4" goto setup
if "%choice%"=="5" goto install
if "%choice%"=="6" goto clean
if "%choice%"=="7" goto info
if "%choice%"=="0" goto exit
goto invalid

:dev
echo.
echo [INFO] Iniciando servidor de desarrollo...
call start.bat
goto menu

:build
echo.
echo [INFO] Iniciando build de producción...
call build.bat
goto menu

:preview
echo.
echo [INFO] Iniciando preview del build...
if not exist "dist" (
    echo [ERROR] No existe el directorio dist
    echo Ejecuta primero el build de producción [opción 2]
    pause
    goto menu
)
echo Servidor disponible en: http://localhost:4173/
npm run preview
pause
goto menu

:setup
echo.
echo [INFO] Ejecutando configuración inicial...
call setup.bat
goto menu

:install
echo.
echo [INFO] Instalando/actualizando dependencias...
npm install --include=dev
if %errorlevel% eq 0 (
    echo [SUCCESS] Dependencias actualizadas
) else (
    echo [ERROR] Error al instalar dependencias
)
pause
goto menu

:clean
echo.
echo [WARNING] Esto eliminará node_modules y reinstalará todo
echo ¿Estás seguro? (y/n)
set /p confirm=
if /i "%confirm%"=="y" (
    echo Limpiando proyecto...
    if exist "node_modules" rmdir /s /q "node_modules"
    if exist "package-lock.json" del "package-lock.json"
    if exist "dist" rmdir /s /q "dist"
    npm cache clean --force
    npm install --include=dev
    echo [SUCCESS] Proyecto limpio y dependencias reinstaladas
) else (
    echo Operación cancelada
)
pause
goto menu

:info
cls
echo =====================================
echo     INFORMACIÓN DEL PROYECTO
echo =====================================
echo.
echo Nombre: Stream Monitor (MultiStream)
echo Descripción: Aplicación para monitorear múltiples streams
echo Tecnologías: React 19, TypeScript, Vite, Tailwind CSS
echo.
echo Plataformas soportadas:
echo  • YouTube (videos y canales en vivo)
echo  • Twitch (canales, VODs y clips)
echo.
echo Comandos disponibles:
echo  • npm run dev     - Servidor desarrollo (puerto 3000)
echo  • npm run build   - Build de producción
echo  • npm run preview - Preview build (puerto 4173)
echo.
echo Archivos principales:
echo  • App.tsx         - Componente principal
echo  • index.tsx       - Punto de entrada
echo  • components/     - Componentes React
echo  • services/       - Servicios (parseador URLs)
echo  • types.ts        - Definiciones TypeScript
echo.
echo URLs de desarrollo:
echo  • Local:   http://localhost:3000/
echo  • Network: http://[tu-ip]:3000/
echo.
if exist "package.json" (
    echo Información del package.json:
    findstr "name\|version\|description" package.json
)
echo.
echo =====================================
pause
goto menu

:invalid
echo.
echo [ERROR] Opción inválida. Por favor selecciona 0-7
pause
goto menu

:exit
echo.
echo ¡Gracias por usar Stream Monitor!
echo Desarrollado para monitorear múltiples streams simultáneamente
timeout /t 2 /nobreak >nul
exit