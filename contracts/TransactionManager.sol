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
        
        // Para ETH, verificar que se envió el monto correcto
        if (keccak256(bytes(transaction.currency)) == keccak256(bytes("ETH"))) {
            require(msg.value == transaction.amount, "Incorrect ETH amount sent");
            
            // Transferir ETH al destinatario
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
        
        // Redimensionar array al tamaño correcto
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
        
        // Redimensionar array al tamaño correcto
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = pendingTransactionIds[i];
        }
        
        return result;
    }
}