# 🔧 DESPLIEGUE ALTERNATIVO CON REMIX IDE

Debido a problemas de conectividad con Hardhat, vamos a usar **Remix IDE** que es más confiable y fácil.

## 🚀 PASOS PARA DESPLEGAR CON REMIX:

### Paso 1: Preparar MetaMask
1. **Abre MetaMask**
2. **Importa la wallet** con esta clave privada:
   ```
   dd5fb24858638bf0e4c3b653ba1173723ec55f194c8623f4adc96b648d9978ab
   ```
3. **Cambia a Sepolia Testnet**
4. **Obtén ETH de prueba** en: https://sepoliafaucet.com/

### Paso 2: Abrir Remix
1. Ve a: **https://remix.ethereum.org/**
2. En la carpeta `contracts`, crea un nuevo archivo llamado `TransactionManager.sol`

### Paso 3: Copiar el Contrato
Copia y pega este código en Remix:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransactionManager {
    struct Transaction {
        address sender;
        address recipient;
        uint256 amount;
        string currency;
        uint256 timestamp;
        bool executed;
    }
    
    mapping(uint256 => Transaction) public transactions;
    uint256 public transactionCount;
    
    event TransactionCreated(
        uint256 indexed transactionId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string currency
    );
    
    event TransactionExecuted(
        uint256 indexed transactionId,
        address indexed sender,
        address indexed recipient,
        uint256 amount
    );
    
    modifier onlyPendingTransaction(uint256 _transactionId) {
        require(_transactionId < transactionCount, "Transaction does not exist");
        require(!transactions[_transactionId].executed, "Transaction already executed");
        _;
    }
    
    function createTransaction(
        address _recipient,
        uint256 _amount,
        string memory _currency
    ) public returns (uint256) {
        require(_recipient != address(0), "Invalid recipient address");
        require(_amount > 0, "Amount must be greater than 0");
        require(bytes(_currency).length > 0, "Currency cannot be empty");
        
        uint256 transactionId = transactionCount;
        transactions[transactionId] = Transaction({
            sender: msg.sender,
            recipient: _recipient,
            amount: _amount,
            currency: _currency,
            timestamp: block.timestamp,
            executed: false
        });
        
        transactionCount++;
        
        emit TransactionCreated(
            transactionId,
            msg.sender,
            _recipient,
            _amount,
            _currency
        );
        
        return transactionId;
    }
    
    function executeTransaction(uint256 _transactionId) 
        public 
        payable 
        onlyPendingTransaction(_transactionId) 
    {
        Transaction storage transaction = transactions[_transactionId];
        require(msg.sender == transaction.sender, "Only sender can execute");
        
        if (keccak256(bytes(transaction.currency)) == keccak256(bytes("ETH"))) {
            require(msg.value == transaction.amount, "Incorrect ETH amount sent");
            payable(transaction.recipient).transfer(msg.value);
        }
        
        transaction.executed = true;
        
        emit TransactionExecuted(
            _transactionId,
            transaction.sender,
            transaction.recipient,
            transaction.amount
        );
    }
    
    function getTransaction(uint256 _transactionId) 
        public 
        view 
        returns (
            address sender,
            address recipient,
            uint256 amount,
            string memory currency,
            uint256 timestamp,
            bool executed
        ) 
    {
        require(_transactionId < transactionCount, "Transaction does not exist");
        
        Transaction memory transaction = transactions[_transactionId];
        return (
            transaction.sender,
            transaction.recipient,
            transaction.amount,
            transaction.currency,
            transaction.timestamp,
            transaction.executed
        );
    }
    
    function getUserTransactions(address _user) 
        public 
        view 
        returns (uint256[] memory) 
    {
        uint256[] memory userTransactionIds = new uint256[](transactionCount);
        uint256 count = 0;
        
        for (uint256 i = 0; i < transactionCount; i++) {
            if (transactions[i].sender == _user || transactions[i].recipient == _user) {
                userTransactionIds[count] = i;
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = userTransactionIds[i];
        }
        
        return result;
    }
    
    function getPendingTransactions() 
        public 
        view 
        returns (uint256[] memory) 
    {
        uint256[] memory pendingTransactionIds = new uint256[](transactionCount);
        uint256 count = 0;
        
        for (uint256 i = 0; i < transactionCount; i++) {
            if (!transactions[i].executed) {
                pendingTransactionIds[count] = i;
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = pendingTransactionIds[i];
        }
        
        return result;
    }
}
```

### Paso 4: Compilar
1. Ve a la pestaña **"Solidity Compiler"**
2. Selecciona versión **0.8.19**
3. Haz clic en **"Compile TransactionManager.sol"**

### Paso 5: Desplegar en Sepolia
1. Ve a **"Deploy & Run Transactions"**
2. En "Environment" selecciona **"Injected Provider - MetaMask"**
3. Confirma que estás en **Sepolia** en MetaMask
4. Selecciona **"TransactionManager"**
5. Haz clic en **"Deploy"**
6. Confirma en MetaMask
7. **¡COPIA LA DIRECCIÓN DEL CONTRATO!**

### Paso 6: Desplegar en Base Sepolia
1. En MetaMask, cambia a **Base Sepolia Testnet**
2. Repite el paso 5
3. **¡COPIA LA SEGUNDA DIRECCIÓN!**

### Paso 7: Actualizar Config
Después del despliegue, actualiza manualmente `config.json`:

```json
{
  "blockchain": {
    "contractAddress": "TU_DIRECCION_DEL_CONTRATO_AQUI",
    "defaultNetwork": "sepolia"
  }
}
```

## 🎯 DIRECCIONES ESPERADAS:
- **Sepolia**: 0x[40 caracteres]
- **Base Sepolia**: 0x[40 caracteres]

---

**¡Este método es 100% confiable! Te guío paso a paso si necesitas ayuda.**
