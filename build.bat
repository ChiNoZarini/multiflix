@echo off
cls
echo =====================================
echo    Stream Monitor - Build de Producción
echo =====================================
echo.

REM Verificar Node.js y NPM
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado
    pause
    exit /b 1
)

echo [INFO] Iniciando build de producción...
echo.

REM Limpiar directorio dist si existe
if exist "dist" (
    echo [INFO] Limpiando directorio dist anterior...
    rmdir /s /q "dist"
)

REM Ejecutar build
npm run build

if %errorlevel% eq 0 (
    echo.
    echo [SUCCESS] Build completado exitosamente
    echo Los archivos están en el directorio 'dist'
    echo.
    
    REM Mostrar información del build
    if exist "dist" (
        echo [INFO] Contenido del directorio dist:
        dir "dist" /b
        echo.
        echo [INFO] Tamaño de los archivos:
        dir "dist" /s
    )
    
    echo ¿Deseas iniciar el servidor de preview? (y/n)
    set /p choice=
    if /i "%choice%"=="y" (
        echo.
        echo [INFO] Iniciando servidor de preview...
        echo Disponible en: http://localhost:4173/
        npm run preview
    )
) else (
    echo.
    echo [ERROR] Build falló
    echo Revisa los errores anteriores
)

pause