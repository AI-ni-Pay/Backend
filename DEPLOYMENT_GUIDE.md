# Guía de Despliegue del Contrato

## Prerrequisitos

1. **MetaMask** instalado y configurado
2. **ETH de prueba** en Sepolia o Base Sepolia
3. **Remix IDE** (https://remix.ethereum.org/) o Hardhat

## Obtener ETH de Prueba

### Para Sepolia:
- Faucet oficial: https://sepoliafaucet.com/
- Alchemy Faucet: https://sepoliafaucet.com/
- Chainlink Faucet: https://faucets.chain.link/

### Para Base Sepolia:
- Base Faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- Alchemy Faucet: https://www.alchemy.com/faucets/base-sepolia

## Configurar Redes en MetaMask

### Sepolia Testnet:
- **Nombre de Red:** Sepolia
- **URL RPC:** https://sepolia.infura.io/v3/[TU_INFURA_KEY]
- **ID de Cadena:** 11155111
- **Símbolo:** SepoliaETH
- **Explorador:** https://sepolia.etherscan.io

### Base Sepolia Testnet:
- **Nombre de Red:** Base Sepolia Testnet
- **URL RPC:** https://sepolia.base.org
- **ID de Cadena:** 84532
- **Símbolo:** ETH
- **Explorador:** https://sepolia-explorer.base.org

## Desplegar Contrato con Remix

1. **Abrir Remix:** Ve a https://remix.ethereum.org/

2. **Crear archivo:** Crea un nuevo archivo `TransactionManager.sol`

3. **Copiar código:** Copia el contenido de `TransactionManager.sol`

4. **Compilar:**
   - Ve a la pestaña "Solidity Compiler"
   - Selecciona versión 0.8.x
   - Haz clic en "Compile TransactionManager.sol"

5. **Desplegar:**
   - Ve a la pestaña "Deploy & Run Transactions"
   - En "Environment" selecciona "Injected Provider - MetaMask"
   - Asegúrate de estar en la red correcta (Sepolia o Base Sepolia)
   - Selecciona el contrato "TransactionManager"
   - Haz clic en "Deploy"
   - Confirma la transacción en MetaMask

6. **Copiar dirección:**
   - Una vez desplegado, copia la dirección del contrato
   - Pégala en `config.json` en el campo `contractAddress`

## Actualizar Configuración

Después del despliegue, actualiza `config.json`:

```json
{
  "blockchain": {
    "contractAddress": "0xTU_DIRECCION_DEL_CONTRATO_AQUI",
    ...
  }
}
```

## Verificar Despliegue

1. **En el explorador:** Visita el explorador de bloques y busca tu dirección de contrato
2. **En la app:** Refresca la página web y prueba una transacción
3. **Logs:** Abre las herramientas de desarrollador para ver los logs de conexión

## Troubleshooting

### Error: "Contrato no inicializado"
- Verifica que la dirección del contrato esté correcta en `config.json`
- Asegúrate de que el contrato se haya desplegado correctamente

### Error: "MetaMask no detectado"
- Instala MetaMask
- Refresca la página después de la instalación

### Error: "Red incorrecta"
- Cambia a Sepolia o Base Sepolia en MetaMask
- La app debería sugerir automáticamente cambiar de red

### Error: "Balance insuficiente"
- Obtén ETH de prueba de los faucets listados arriba
- Verifica que estés en la red correcta

## Costos de Gas

- **Despliegue del contrato:** ~500,000 gas
- **Crear transacción:** ~100,000 gas
- **Ejecutar transacción:** ~50,000 gas

## Siguiente Paso

Una vez que el contrato esté desplegado y configurado:
1. Refresca la aplicación web
2. Conecta tu MetaMask
3. ¡Prueba tu primera transacción real!

---

**Nota:** Recuerda que esto es para testing únicamente. Nunca uses claves privadas reales o fondos principales en redes de prueba.
