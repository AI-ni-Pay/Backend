// Deepseek API Configuration
const DEEPSEEK_API_KEY = 'API key';
const DEEPSEEK_API_URL = '';

// Chatbot state
let transactionData = {
    address: null,
    currency: null,
    amount: null
};

let conversationHistory = [];

// DOM elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const transactionSummary = document.getElementById('transaction-summary');
const summaryContent = document.getElementById('summary-content');
const executeButton = document.getElementById('execute-transaction');
const cancelButton = document.getElementById('cancel-transaction');
const networkSelect = document.getElementById('network-select');
const networkStatus = document.getElementById('network-status');
const walletAddressSpan = document.getElementById('wallet-address');

// Initialize the chatbot
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
    setupEventListeners();
});

function initializeChatbot() {
    const welcomeMessage = `� **Fast Base Sepolia Transaction Bot**

I help you send ETH transactions quickly on Base Sepolia testnet!

**Quick Transaction Process:**
• Tell me the recipient address and amount
• I'll execute it immediately (no confirmations needed)
• Example: "Send 0.1 ETH to 0x1234..."

⚡ **Connect MetaMask above to get started!**

What transaction do you want to make?`;
    
    addMessage(welcomeMessage, 'bot');
    conversationHistory.push({
        role: 'system',
        content: 'You are a fast transaction assistant for Base Sepolia testnet. When users want to send money, ask for recipient address and amount in ETH. Once you have both pieces of information, immediately execute the transaction without asking for confirmation. Be direct and quick. Work only with Base Sepolia network (Chain ID 84532). Skip unnecessary steps and confirmations.'
    });
}

function setupEventListeners() {
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    executeButton.addEventListener('click', executeTransaction);
    cancelButton.addEventListener('click', cancelTransaction);
    
    // ...existing code...
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Mostrar mensaje del usuario
    addMessage(message, 'user');
    userInput.value = '';
    
    // Agregar al historial
    conversationHistory.push({
        role: 'user',
        content: message
    });
    
    // Mostrar indicador de carga
    const loadingMessage = addMessage('Pensando...', 'bot');
    
    try {
        // Llamar a la API de Deepseek
        const response = await callDeepseekAPI(message);
        
        // Remover mensaje de carga
        chatMessages.removeChild(loadingMessage);
        
        // Mostrar respuesta del bot
        addMessage(response, 'bot');
        
        // Agregar respuesta al historial
        conversationHistory.push({
            role: 'assistant',
            content: response
        });
        
        // Analizar si tenemos todos los datos necesarios
        analyzeTransactionData(message, response);
        
    } catch (error) {
        // Remover mensaje de carga
        chatMessages.removeChild(loadingMessage);
        addMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.', 'bot');
        console.error('Error:', error);
    }
}

async function callDeepseekAPI(message) {
    console.log('🚀 Llamando a Deepseek API...', message);
    
    const payload = {
        model: 'deepseek-chat',
        messages: [
            {
                role: 'system',
                content: 'Eres un asistente amigable para transferencias de criptomonedas. Mantén conversaciones naturales y simples. Cuando el usuario quiera enviar dinero, pide la dirección, monto y tipo de moneda de forma conversacional.'
            },
            ...conversationHistory,
            {
                role: 'user',
                content: message
            }
        ],
        max_tokens: 150,
        temperature: 0.7
    };
    
    console.log('📤 Payload:', payload);
    
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify(payload)
        });
        
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ API Response:', data);
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('💥 Fetch error:', error);
        throw error;
    }
}

function analyzeTransactionData(userMessage, botResponse) {
    // Análisis para extraer datos de transacción
    const message = userMessage.toLowerCase();
    
        // Search for Ethereum addresses (enhanced)
        const ethAddressPattern = /0x[a-fA-F0-9]{40}/;
        const ethAddressMatch = userMessage.match(ethAddressPattern);
        if (ethAddressMatch) {
            const address = ethAddressMatch[0];
            // Validate Ethereum address if Web3 is available
            if (typeof window.isValidEthereumAddress === 'function') {
                if (window.isValidEthereumAddress(address)) {
                    transactionData.address = address;
                }
            } else {
                transactionData.address = address;
            }
        }    // Buscar tipo de moneda (actualizado para redes de prueba)
    const currencies = ['eth', 'sepoliaeth'];
    for (const currency of currencies) {
        if (message.includes(currency)) {
            // Normalize currency name
            if (currency === 'sepoliaeth') {
                transactionData.currency = 'SepoliaETH';
            } else {
                transactionData.currency = currency.toUpperCase();
            }
            break;
        }
    }
    
    // If no currency specified, assume ETH by default for testnets
    if (!transactionData.currency && transactionData.address) {
        transactionData.currency = 'ETH';
    }
    
    // Search for amount (enhanced)
    const amountPatterns = [
        /(\d+(?:\.\d+)?)\s*(?:eth|sepoliaeth)/i,
        /(\d+(?:\.\d+)?)\s*(?=\s|$)/
    ];
    
    for (const pattern of amountPatterns) {
        const amountMatch = userMessage.match(pattern);
        if (amountMatch) {
            const amount = parseFloat(amountMatch[1]);
            if (amount > 0) {
                transactionData.amount = amount;
                break;
            }
        }
    }
    
    // Additional validations
    if (transactionData.address && transactionData.currency && transactionData.amount) {
        // Validate minimum amount
        if (transactionData.amount < 0.000001) {
            addMessage('⚠️ Amount is too small. Minimum is 0.000001 ETH.', 'bot');
            transactionData.amount = null;
            return;
        }
        
        // Validate maximum amount (for testnet)
        if (transactionData.amount > 10) {
            addMessage('⚠️ For testing, maximum amount is 10 ETH.', 'bot');
            transactionData.amount = null;
            return;
        }
        
        // ✅ AUTOMATIC EXECUTION - No confirmation
        executeTransactionDirectly();
    }
}

// ✅ NEW FUNCTION - Direct execution without confirmation
async function executeTransactionDirectly() {
    try {
        // Show transaction data that will be executed
        addMessage(`🚀 **Executing transaction immediately:**
• **Recipient:** ${transactionData.address}
• **Amount:** ${transactionData.amount} ${transactionData.currency}
• **Network:** Base Sepolia`, 'bot');

        // Check if Web3 is available
        if (typeof window.processCompleteTransaction === 'function') {
            // Use real blockchain
            addMessage('🔄 Connecting with MetaMask...', 'bot');
            
            const result = await window.processCompleteTransaction(
                transactionData.address,
                transactionData.amount,
                transactionData.currency
            );
            
            addMessage(`✅ **Transaction completed successfully!**
💰 ${transactionData.amount} ${transactionData.currency} sent
🔗 Hash: ${result.hash || 'Available in MetaMask'}
⏰ Time: ${new Date().toLocaleTimeString()}`, 'bot');
            
        } else {
            // Simulation mode if no MetaMask
            addMessage(`⚠️ **Simulation Mode (MetaMask not detected)**
📤 Would have sent: ${transactionData.amount} ${transactionData.currency}
📍 To address: ${transactionData.address}
💡 Install MetaMask for real transactions`, 'bot');
        }
        
    } catch (error) {
        console.error('Error in direct execution:', error);
        addMessage(`❌ **Transaction error:**
${error.message}

💡 Verify that:
• MetaMask is connected
• You have sufficient balance
• You're on Base Sepolia network`, 'bot');
    } finally {
        // Clear transaction data
        resetTransaction();
    }
}

function showTransactionSummary() {
    // Only show summary when we have all data
    summaryContent.innerHTML = `
        <p><strong>Confirm your transaction:</strong></p>
        <p>📍 To: ${transactionData.address}</p>
        <p>💰 Amount: ${transactionData.amount} ${transactionData.currency}</p>
        <div id="wallet-section">
            <button id="connect-wallet-btn" onclick="connectMetaMask()">
                🦊 Connect MetaMask
            </button>
            <div id="wallet-info" style="display: none;"></div>
        </div>
    `;
    
    transactionSummary.style.display = 'block';
    transactionSummary.scrollIntoView({ behavior: 'smooth' });
    
    // Simplified bot response
    addMessage('Perfect, do you confirm this transaction?', 'bot');
}

// Function to connect MetaMask
async function connectMetaMask() {
    try {
        const connectBtn = document.getElementById('connect-wallet-btn');
        const walletInfo = document.getElementById('wallet-info');
        
        connectBtn.textContent = 'Connecting...';
        connectBtn.disabled = true;
        
        // Connect wallet
        const account = await window.connectWallet();
        
        // Get balance
        const balance = await window.getAccountBalance();
        
        // Show wallet information
        walletInfo.innerHTML = `
            <p><strong>✅ Wallet Connected:</strong> ${account.substring(0, 6)}...${account.substring(38)}</p>
            <p><strong>💰 Balance:</strong> ${parseFloat(balance).toFixed(6)} ETH</p>
        `;
        
        walletInfo.style.display = 'block';
        connectBtn.style.display = 'none';
        
        // Check if there's sufficient balance
        if (parseFloat(balance) < transactionData.amount) {
            addMessage(
                `⚠️ Insufficient balance. You have ${parseFloat(balance).toFixed(6)} ETH but need ${transactionData.amount} ETH.`,
                'bot'
            );
        } else {
            addMessage('✅ Wallet connected successfully. You can proceed with the transaction.', 'bot');
        }
        
    } catch (error) {
        console.error('Error connecting MetaMask:', error);
        addMessage(`❌ Error al conectar MetaMask: ${error.message}`, 'bot');
        
        const connectBtn = document.getElementById('connect-wallet-btn');
        connectBtn.textContent = '🦊 Conectar MetaMask';
        connectBtn.disabled = false;
    }
}

function executeTransaction() {
    // Check if Web3 is available
    if (typeof window.processCompleteTransaction === 'function') {
        // Use real blockchain
        executeBlockchainTransaction();
    } else {
        // Simulation mode
        executeSimulationTransaction();
    }
}

async function executeBlockchainTransaction() {
    try {
        addMessage('🔄 Processing transaction...', 'bot');
        
        // Execute direct transaction (single confirmation)
        const result = await window.processCompleteTransaction(
            transactionData.address,
            transactionData.amount,
            transactionData.currency
        );
        
        addMessage(
            `✅ ¡Transacción completada!\n` +
            `� ${transactionData.amount} ${transactionData.currency} enviados exitosamente`,
            'bot'
        );
        
        // Clear transaction data
        resetTransaction();
        
    } catch (error) {
        console.error('Transaction error:', error);
        addMessage(
            `❌ ${error.message}`,
            'bot'
        );
    }
}

function executeSimulationTransaction() {
    addMessage(
        `🔄 Executing transaction:\n` +
        `• Sending ${transactionData.amount} ${transactionData.currency}\n` +
        `• To address: ${transactionData.address}\n\n` +
        `⚠️ This is a simulation - MetaMask not detected.\n` +
        `For real transactions, install MetaMask.`,
        'bot'
    );
    
    resetTransaction();
}

function cancelTransaction() {
    addMessage('Transaction cancelled. Is there anything else I can help you with?', 'bot');
    resetTransaction();
}

function resetTransaction() {
    transactionData = {
        address: null,
        currency: null,
        amount: null
    };
    transactionSummary.style.display = 'none';
}

function addMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

// Hacer la función global para que web3-integration.js pueda usarla
window.addMessage = addMessage;

// Función para actualizar el estado de la red en la UI
function updateNetworkStatus() {
    if (typeof window.getCurrentNetwork === 'function') {
        const networkInfo = window.getCurrentNetwork();
        if (networkInfo) {
            networkStatus.textContent = `🟢 ${networkInfo.name}`;
            networkStatus.style.color = '#28a745';
            networkSelect.value = networkInfo.key;
        } else {
            networkStatus.textContent = '🔴 Desconectado';
            networkStatus.style.color = '#dc3545';
        }
    } else {
        networkStatus.textContent = '⚪ Sin Web3';
        networkStatus.style.color = '#6c757d';
    }
}

// Actualizar estado cada 5 segundos
setInterval(updateNetworkStatus, 5000);
