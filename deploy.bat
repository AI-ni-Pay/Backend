@echo off
echo.
echo ========================================
echo   DESPLEGADOR DE CONTRATO AUTOMATICO
echo ========================================
echo.

REM Verificar que Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js primero.
    pause
    exit /b 1
)

REM Verificar que npm está disponible
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm no está disponible.
    pause
    exit /b 1
)

echo ✅ Node.js y npm detectados correctamente
echo.

REM Verificar que las dependencias están instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
    echo.
)

REM Verificar que el archivo .env existe y tiene una clave privada válida
if not exist ".env" (
    echo ❌ Archivo .env no encontrado
    echo 📋 Por favor:
    echo    1. Copia .env.example a .env
    echo    2. Configura tu PRIVATE_KEY en .env
    echo    3. Consulta PRIVATE_KEY_GUIDE.md para ayuda
    pause
    exit /b 1
)

REM Buscar PRIVATE_KEY en .env
findstr /C:"PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000" .env >nul
if not errorlevel 1 (
    echo ❌ Clave privada no configurada en .env
    echo 📋 Por favor:
    echo    1. Abre el archivo .env
    echo    2. Reemplaza PRIVATE_KEY con tu clave privada real
    echo    3. Consulta PRIVATE_KEY_GUIDE.md para ayuda
    pause
    exit /b 1
)

echo ✅ Configuración verificada
echo.

REM Compilar contratos
echo 🔨 Compilando contratos...
call npx hardhat compile
if errorlevel 1 (
    echo ❌ Error compilando contratos
    pause
    exit /b 1
)
echo ✅ Contratos compilados exitosamente
echo.

:MENU
echo =========================================
echo   SELECCIONA LA RED DE DESPLIEGUE:
echo =========================================
echo.
echo 1. Sepolia Testnet (ChainID: 11155111)
echo 2. Base Sepolia Testnet (ChainID: 84532)
echo 3. Ambas redes (Sepolia primero, luego Base)
echo 4. Salir
echo.
set /p choice="Ingresa tu opción (1-4): "

if "%choice%"=="1" goto DEPLOY_SEPOLIA
if "%choice%"=="2" goto DEPLOY_BASE
if "%choice%"=="3" goto DEPLOY_BOTH
if "%choice%"=="4" goto EXIT
echo ❌ Opción inválida. Intenta de nuevo.
echo.
goto MENU

:DEPLOY_SEPOLIA
echo.
echo 🚀 Desplegando en Sepolia Testnet...
call npm run deploy:sepolia
if errorlevel 1 (
    echo ❌ Error desplegando en Sepolia
    pause
    exit /b 1
)
echo.
echo ✅ ¡Despliegue en Sepolia completado!
goto SUCCESS

:DEPLOY_BASE
echo.
echo 🚀 Desplegando en Base Sepolia Testnet...
call npm run deploy:base-sepolia
if errorlevel 1 (
    echo ❌ Error desplegando en Base Sepolia
    pause
    exit /b 1
)
echo.
echo ✅ ¡Despliegue en Base Sepolia completado!
goto SUCCESS

:DEPLOY_BOTH
echo.
echo 🚀 Desplegando en ambas redes...
echo.
echo 📡 Primer despliegue: Sepolia Testnet
call npm run deploy:sepolia
if errorlevel 1 (
    echo ❌ Error desplegando en Sepolia
    pause
    exit /b 1
)
echo.
echo ✅ Sepolia completado. Continuando con Base Sepolia...
echo.
echo 📡 Segundo despliegue: Base Sepolia Testnet
call npm run deploy:base-sepolia
if errorlevel 1 (
    echo ❌ Error desplegando en Base Sepolia
    pause
    exit /b 1
)
echo.
echo ✅ ¡Ambos despliegues completados!
goto SUCCESS

:SUCCESS
echo.
echo ========================================
echo            ¡ÉXITO! 🎉
echo ========================================
echo.
echo ✅ Contrato(s) desplegado(s) exitosamente
echo 📁 Revisa la carpeta 'deployments' para detalles
echo ⚙️  config.json actualizado automáticamente
echo 🌐 Ahora puedes usar el chatbot con blockchain real
echo.
echo 📋 Próximos pasos:
echo    1. Abre index.html en tu navegador
echo    2. Conecta MetaMask
echo    3. ¡Prueba una transacción real!
echo.
goto END

:EXIT
echo.
echo 👋 Saliendo del desplegador...
goto END

:END
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
