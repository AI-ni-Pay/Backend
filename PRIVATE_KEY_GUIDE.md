# 🔐 Guía para Obtener tu Clave Privada de MetaMask

## ⚠️ IMPORTANTE - Seguridad

**NUNCA compartas tu clave privada con nadie. Esta clave da acceso completo a tu wallet.**

## Pasos para obtener la clave privada:

1. **Abrir MetaMask**
   - Haz clic en el ícono de MetaMask en tu navegador
   - Asegúrate de estar en la cuenta que quieres usar

2. **Ir a Configuración**
   - Haz clic en el ícono de tu perfil (círculo con iniciales)
   - Selecciona "Configuración"

3. **Navegar a Privacidad y Seguridad**
   - En el menú lateral, busca "Privacidad y Seguridad"
   - Haz clic en esa opción

4. **Revelar Clave Privada**
   - Busca la opción "Revelar clave privada"
   - Te pedirá tu contraseña de MetaMask
   - Ingresa tu contraseña y confirma

5. **Copiar la Clave**
   - Se mostrará tu clave privada (64 caracteres hexadecimales)
   - **CÓPIALA COMPLETA** (incluye el "0x" al inicio)

## Configurar el archivo .env:

1. **Abrir archivo .env**
   - Busca el archivo `.env` en la carpeta del proyecto

2. **Reemplazar la clave**
   - Busca la línea: `PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000`
   - Reemplaza `0x0000000000000000000000000000000000000000000000000000000000000000` con tu clave privada real

3. **Guardar el archivo**

## Ejemplo de .env configurado:

```
PRIVATE_KEY=0xtu_clave_privada_real_de_64_caracteres_aqui
INFURA_API_KEY=
ETHERSCAN_API_KEY=
BASESCAN_API_KEY=
DEFAULT_NETWORK=sepolia
```

## ✅ Verificación

Después de configurar tu clave privada, podemos:

1. **Desplegar en Sepolia**: `npm run deploy:sepolia`
2. **Desplegar en Base Sepolia**: `npm run deploy:base-sepolia`

## 🛡️ Consejos de Seguridad

- ✅ Usa solo wallets de prueba con ETH de testnet
- ✅ Nunca uses esta clave en mainnet
- ✅ El archivo `.env` está en `.gitignore` (no se subirá a GitHub)
- ⚠️ Si compartes el proyecto, borra el `.env` primero

---

**¿Necesitas ETH de prueba?**
- Sepolia: https://sepoliafaucet.com/
- Base Sepolia: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
