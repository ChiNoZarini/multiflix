@echo off
cls
echo =====================================
echo    Stream Monitor - Configuración Inicial
echo =====================================
echo.

echo [INFO] Este script configurará el proyecto por primera vez
echo.

REM Verificar Node.js
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado
    echo Descárgalo desde: https://nodejs.org/
    pause
    exit /b 1
)
echo [SUCCESS] Node.js está instalado
node --version
echo.

REM Verificar NPM
echo [2/5] Verificando NPM...
npm --version
echo.

REM Limpiar instalación anterior si existe
echo [3/5] Limpiando instalación anterior...
if exist "node_modules" (
    echo Eliminando node_modules...
    rmdir /s /q "node_modules"
)
if exist "package-lock.json" (
    echo Eliminando package-lock.json...
    del "package-lock.json"
)
if exist "dist" (
    echo Eliminando directorio dist...
    rmdir /s /q "dist"
)
echo.

REM Instalar dependencias
echo [4/5] Instalando dependencias...
echo Esto puede tomar algunos minutos...
npm cache clean --force
npm install --include=dev

if %errorlevel% neq 0 (
    echo [ERROR] Falló la instalación de dependencias
    pause
    exit /b 1
)
echo [SUCCESS] Dependencias instaladas correctamente
echo.

REM Verificar archivos necesarios
echo [5/5] Verificando archivos del proyecto...

if not exist "index.css" (
    echo [WARNING] Creando index.css faltante...
    (
        echo /* Basic CSS reset and styles for the Stream Monitor app */
        echo * { margin: 0; padding: 0; box-sizing: border-box; }
        echo body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
    ) > index.css
)

REM Verificar estructura de directorios
for %%d in (components services components\icons) do (
    if not exist "%%d" (
        echo [WARNING] Directorio %%d no existe
    ) else (
        echo [OK] Directorio %%d existe
    )
)

echo.
echo =====================================
echo       CONFIGURACIÓN COMPLETADA
echo =====================================
echo.
echo El proyecto está listo para usar:
echo.
echo  • Ejecuta 'start.bat' para desarrollo
echo  • Ejecuta 'build.bat' para producción
echo  • O usa los comandos npm directamente:
echo    - npm run dev     (desarrollo)
echo    - npm run build   (producción)
echo    - npm run preview (preview build)
echo.
echo =====================================

pause