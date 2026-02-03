@echo off
cls
echo =====================================
echo    Stream Monitor - Inicio de Servicios
echo =====================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado o no está en el PATH
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] NPM no está disponible
    pause
    exit /b 1
)

echo [INFO] Verificando Node.js y NPM...
echo Node.js version: 
node --version
echo NPM version: 
npm --version
echo.

REM Verificar si existe package.json
if not exist "package.json" (
    echo [ERROR] No se encontró package.json en el directorio actual
    echo Asegúrate de estar en el directorio raíz del proyecto
    pause
    exit /b 1
)

REM Verificar si existe node_modules
if not exist "node_modules" (
    echo [WARNING] No se encontró el directorio node_modules
    echo Instalando dependencias...
    npm install --include=dev
    if %errorlevel% neq 0 (
        echo [ERROR] Falló la instalación de dependencias
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencias instaladas correctamente
    echo.
) else (
    echo [INFO] Dependencias ya instaladas
    echo.
)

REM Verificar si existe el archivo CSS
if not exist "index.css" (
    echo [WARNING] No se encontró index.css, creándolo...
    (
        echo /* Basic CSS reset and styles for the Stream Monitor app */
        echo * {
        echo   margin: 0;
        echo   padding: 0;
        echo   box-sizing: border-box;
        echo }
        echo.
        echo body {
        echo   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        echo   line-height: 1.6;
        echo   color: #e2e8f0;
        echo   background-color: #0f172a;
        echo }
    ) > index.css
    echo [SUCCESS] Archivo index.css creado
    echo.
)

echo [INFO] Iniciando servidor de desarrollo...
echo.
echo =====================================
echo  El servidor se iniciará en:
echo  - Local:   http://localhost:3000/
echo  - Network: http://192.168.x.x:3000/
echo =====================================
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

REM Abrir el navegador automáticamente después de un breve delay
start /b timeout /t 3 /nobreak >nul && start http://localhost:3000

REM Iniciar el servidor de desarrollo
npm run dev

REM Si el comando anterior falla, mostrar mensaje de error
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Falló al iniciar el servidor de desarrollo
    echo Verifica que todas las dependencias estén instaladas correctamente
    pause
    exit /b 1
)