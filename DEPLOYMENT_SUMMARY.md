# 🚀 Resumen del Sistema de Despliegue

## ✅ Archivos Creados para Despliegue

### 📁 Estructura del Proyecto
```
Proyecto/
├── contracts/              # Contratos Solidity
│   └── TransactionManager.sol
├── scripts/                # Scripts de despliegue
│   └── deploy.js
├── deployments/            # Información de contratos desplegados (se crea automáticamente)
├── hardhat.config.js       # Configuración de Hardhat
├── package.json            # Dependencias del proyecto
├── .env                    # Variables de entorno (CONFIGURAR)
├── .env.example            # Ejemplo de configuración
├── .gitignore              # Archivos a ignorar en Git
├── deploy.bat              # Script de despliegue automatizado (Windows)
└── PRIVATE_KEY_GUIDE.md    # Guía para obtener clave privada
```

## 🔧 Configuración Requerida

### 1. Clave Privada
- **Archivo**: `.env`
- **Instrucciones**: Ver `PRIVATE_KEY_GUIDE.md`
- **⚠️ IMPORTANTE**: Usar solo wallets de prueba

### 2. ETH de Prueba Necesario
- **Sepolia**: ~0.01 ETH (para gas de despliegue)
- **Base Sepolia**: ~0.005 ETH (gas más barato)

## 🚀 Métodos de Despliegue

### Método 1: Script Automatizado (Recomendado)
```bash
# Doble clic en deploy.bat
# O desde terminal:
deploy.bat
```

### Método 2: Comandos Manuales
```bash
# Compilar
npx hardhat compile

# Desplegar en Sepolia
npm run deploy:sepolia

# Desplegar en Base Sepolia
npm run deploy:base-sepolia
```

## 📋 Proceso Automatizado

El script de despliegue hace lo siguiente:

1. ✅ **Verificación de entorno**
   - Node.js instalado
   - Dependencias npm
   - Archivo .env configurado

2. 🔨 **Compilación**
   - Compila el contrato Solidity
   - Verifica sintaxis y optimizaciones

3. 🚀 **Despliegue**
   - Conecta a la red seleccionada
   - Despliega el contrato
   - Verifica la transacción

4. ⚙️ **Configuración Automática**
   - Actualiza `config.json` con la nueva dirección
   - Guarda información en `deployments/`
   - Configura la red por defecto

5. 🔍 **Verificación** (opcional)
   - Verifica el contrato en el explorador
   - Requiere API keys de Etherscan/BaseScan

## 📊 Información de Costos

### Sepolia Testnet
- **Gas Limit**: ~500,000 gas
- **Gas Price**: ~20 gwei
- **Costo aproximado**: ~0.01 ETH

### Base Sepolia Testnet
- **Gas Limit**: ~500,000 gas
- **Gas Price**: ~1 gwei
- **Costo aproximado**: ~0.0005 ETH

## 🎯 Después del Despliegue

### Archivos Generados
```
deployments/
├── sepolia.json           # Info del despliegue en Sepolia
└── base-sepolia.json      # Info del despliegue en Base Sepolia
```

### config.json Actualizado
```json
{
  "blockchain": {
    "contractAddress": "0x[TU_CONTRATO_DESPLEGADO]",
    "defaultNetwork": "sepolia", // O "baseSepolia"
    ...
  }
}
```

## 🧪 Pruebas Después del Despliegue

1. **Abre index.html**
2. **Conecta MetaMask** a la red correcta
3. **Prueba el chatbot**: "Enviar 0.001 ETH a 0x..."
4. **Confirma la transacción** en MetaMask
5. **Verifica en el explorador**

## 🛠️ Troubleshooting

### Error: "Insufficient funds"
- Obtén más ETH de los faucets
- Verifica que estés en la red correcta

### Error: "Private key invalid"
- Verifica que la clave privada esté completa (64 caracteres)
- Incluye el prefijo "0x"

### Error: "Network not found"
- Verifica tu conexión a internet
- Prueba con la otra red de prueba

### Error: "Contract verification failed"
- Es normal, la verificación es opcional
- El contrato funcionará igual sin verificación

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en la terminal
2. Verifica el balance de ETH
3. Confirma que MetaMask esté en la red correcta
4. Consulta los archivos de guía incluidos

---

## 🚀 ¡Listo para Desplegar!

**Comando rápido**: Solo ejecuta `deploy.bat` y sigue las instrucciones en pantalla.
