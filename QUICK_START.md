# 🎯 INSTRUCCIONES PASO A PASO PARA DESPLIEGUE

## ✅ Estado Actual
- ✅ Proyecto configurado
- ✅ Contratos compilados
- ✅ Scripts de despliegue listos
- ✅ Hardhat configurado para Sepolia y Base Sepolia

## 🚀 PASOS PARA DESPLEGAR

### Paso 1: Obtener ETH de Prueba
1. Ve a **MetaMask** y cambia a **Sepolia Testnet**
2. Copia tu dirección de wallet
3. Ve a: https://sepoliafaucet.com/
4. Pega tu dirección y solicita ETH
5. Repite para **Base Sepolia** en: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

### Paso 2: Configurar Clave Privada
1. **Abre MetaMask** → Configuración → Privacidad y Seguridad
2. Haz clic en **"Revelar clave privada"**
3. Ingresa tu contraseña de MetaMask
4. **COPIA** la clave privada completa (empieza con 0x...)
5. **Abre** el archivo `.env` en el proyecto
6. **Reemplaza** `PRIVATE_KEY=0x0000...` con tu clave real
7. **Guarda** el archivo

### Paso 3: Ejecutar Despliegue
**Opción A: Script Automatizado (Recomendado)**
1. **Doble clic** en `deploy.bat`
2. Sigue las instrucciones en pantalla
3. Selecciona la red (1=Sepolia, 2=Base Sepolia, 3=Ambas)

**Opción B: Comando Manual**
```bash
# Para Sepolia:
npm run deploy:sepolia

# Para Base Sepolia:
npm run deploy:base-sepolia
```

### Paso 4: Verificar Despliegue
1. **Busca** la dirección del contrato en la terminal
2. **Copia** la dirección (empieza con 0x...)
3. **Ve al explorador**:
   - Sepolia: https://sepolia.etherscan.io/address/[TU_DIRECCION]
   - Base Sepolia: https://sepolia.basescan.org/address/[TU_DIRECCION]

### Paso 5: Probar el Chatbot
1. **Abre** `index.html` en tu navegador
2. **Conecta MetaMask** cuando aparezca el botón
3. **Prueba** con: "Enviar 0.001 ETH a 0xB5eFE57D5CcD5c64cD081dcce2F0507E31cd13AD"
4. **Confirma** la transacción en MetaMask

## 🎉 ¡Listo!

Después del despliegue tendrás:
- ✅ Contrato desplegado en blockchain
- ✅ Chatbot funcionando con transacciones reales
- ✅ Integración completa AI + Blockchain + MetaMask

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Verifica que tengas ETH de prueba
2. Confirma que la clave privada esté bien configurada
3. Asegúrate de estar en la red correcta en MetaMask

**¡El proyecto está 100% listo para desplegar!** 🚀
