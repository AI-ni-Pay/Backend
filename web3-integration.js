// Web3 and MetaMask integration for Base Sepolia
let web3;
let userAccount;
let contractInstance;

// Contract details
const CONTRACT_ADDRESS = "0xYourContractAddress"; // Replace with your deployed contract address
const CONTRACT_ABI = []; // Add your contract ABI here

// Base Sepolia configuration
const BASE_SEPOLIA_CONFIG = {
    chainId: '0x14A74', // 84532 in hex
    chainName: 'Base Sepolia',
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: ['https://base-sepolia.blockpi.network/v1/rpc/public'],
    blockExplorerUrls: ['https://sepolia-explorer.base.org']
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 Web3 integration loaded');
    console.log('🔍 Checking if connect button exists:', document.getElementById('connect-wallet'));
    setupEventListeners();
    checkExistingConnection();
});

// Setup event listeners
function setupEventListeners() {
    // Setup wallet connect button
    const connectBtn = document.getElementById('connect-wallet');
    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
        console.log('✅ Connect wallet button listener added');
    }
    
    // Setup manual network button
    const manualBtn = document.getElementById('add-network-manual');
    if (manualBtn) {
        manualBtn.addEventListener('click', function() {
            showManualNetworkInstructions();
        });
        console.log('✅ Manual network button listener added');
    }
    
    // Listen for MetaMask account changes
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
    }
}

// Check if user is already connected
async function checkExistingConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                userAccount = accounts[0];
                web3 = new Web3(window.ethereum);
                updateWalletUI(true);
                
                // Check if on correct network
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                if (chainId !== BASE_SEPOLIA_CONFIG.chainId) {
                    if (typeof addMessage === 'function') {
                        addMessage('⚠️ Please switch to Base Sepolia network', 'bot');
                    }
                }
            }
        } catch (error) {
            console.error('Error checking existing connection:', error);
        }
    }
}

// Main wallet connection function
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            console.log('🦊 MetaMask detected, requesting accounts...');
            
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            
            // Initialize web3
            web3 = new Web3(window.ethereum);
            
            console.log('✅ Connected account:', userAccount);
            
            // Add success message
            if (typeof addMessage === 'function') {
                addMessage(`🎉 Wallet connected successfully!`, 'bot');
                addMessage(`📍 Address: ${userAccount.substring(0, 6)}...${userAccount.substring(38)}`, 'bot');
            }
            
            // Switch to Base Sepolia
            await switchToBaseSepolia();
            
            // Update UI
            updateWalletUI(true);
            
            return true;
        } catch (error) {
            console.error('❌ Error connecting wallet:', error);
            if (typeof addMessage === 'function') {
                addMessage('❌ Failed to connect wallet: ' + error.message, 'bot');
            }
            return false;
        }
    } else {
        console.log('🚫 MetaMask not detected');
        if (typeof addMessage === 'function') {
            addMessage('🦊 MetaMask not detected! Please install MetaMask extension first.', 'bot');
            addMessage('📥 Download MetaMask: https://metamask.io/download/', 'bot');
        }
        return false;
    }
}

// Switch to Base Sepolia network
async function switchToBaseSepolia() {
    try {
        console.log('🔄 Attempting to switch to Base Sepolia...');
        
        // Try to switch to Base Sepolia first
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_SEPOLIA_CONFIG.chainId }],
        });
        
        if (typeof addMessage === 'function') {
            addMessage('🎯 Successfully switched to Base Sepolia network!', 'bot');
        }
        hideManualButton();
        
    } catch (switchError) {
        console.log('Switch error:', switchError);
        
        // If switch fails (network not added), try to add the network
        if (switchError.code === 4902) {
            try {
                console.log('📡 Adding Base Sepolia network...');
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [BASE_SEPOLIA_CONFIG],
                });
                
                if (typeof addMessage === 'function') {
                    addMessage('✅ Base Sepolia network added and connected successfully!', 'bot');
                }
                hideManualButton();
                
            } catch (addError) {
                console.error('❌ Error adding Base Sepolia network:', addError);
                if (typeof addMessage === 'function') {
                    addMessage('❌ Failed to add Base Sepolia network automatically.', 'bot');
                    addMessage('📋 Please add the network manually with these details:', 'bot');
                    showManualNetworkInstructions();
                    showManualButton();
                }
            }
        } else {
            console.error('❌ Error switching to Base Sepolia:', switchError);
            if (typeof addMessage === 'function') {
                addMessage('⚠️ Error switching to Base Sepolia: ' + switchError.message, 'bot');
            }
        }
    }
}

// Show manual network setup instructions
function showManualNetworkInstructions() {
    if (typeof addMessage === 'function') {
        addMessage(`🔧 **Manual Base Sepolia Setup:**

1. Open MetaMask → Settings → Networks
2. **Delete any existing "Base Sepolia" networks first**
3. Click "Add Network" → "Add a network manually"
4. Enter these EXACT details:

• **Network Name:** Base Sepolia
• **RPC URL:** https://base-sepolia.blockpi.network/v1/rpc/public
• **Chain ID:** 84532
• **Currency Symbol:** ETH
• **Block Explorer:** https://sepolia-explorer.base.org

5. Click "Save" and switch to Base Sepolia
6. Come back and try connecting again!`, 'bot');
    }
}

// Show manual network button
function showManualButton() {
    const manualBtn = document.getElementById('add-network-manual');
    if (manualBtn) {
        manualBtn.style.display = 'inline-block';
        manualBtn.textContent = '🔧 Add Network Manually';
    }
}

// Hide manual network button
function hideManualButton() {
    const manualBtn = document.getElementById('add-network-manual');
    if (manualBtn) {
        manualBtn.style.display = 'none';
    }
}

// Update wallet UI
function updateWalletUI(connected) {
    const connectBtn = document.getElementById('connect-wallet');
    const walletInfo = document.getElementById('wallet-info');
    const walletAddress = document.getElementById('wallet-address');
    const networkStatus = document.getElementById('network-status');
    const manualBtn = document.getElementById('add-network-manual');
    
    if (connectBtn) {
        if (connected) {
            connectBtn.textContent = '✅ Wallet Connected';
            connectBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            connectBtn.disabled = true;
        } else {
            connectBtn.textContent = '🦊 Connect MetaMask';
            connectBtn.style.background = 'linear-gradient(135deg, #3B82F6, #1D4ED8)';
            connectBtn.disabled = false;
        }
    }
    
    if (walletAddress && connected && userAccount) {
        walletAddress.textContent = `📍 ${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
        walletAddress.style.display = 'inline';
    } else if (walletAddress) {
        walletAddress.style.display = 'none';
    }
    
    if (networkStatus) {
        if (connected) {
            networkStatus.textContent = '🟢 Connected';
            networkStatus.style.color = '#10B981';
        } else {
            networkStatus.textContent = '🔴 Disconnected';
            networkStatus.style.color = '#EF4444';
        }
    }
    
    if (walletInfo && connected && userAccount) {
        walletInfo.innerHTML = `
            <div class="wallet-connected">
                <span>📍 Connected: ${userAccount.substring(0, 6)}...${userAccount.substring(38)}</span>
                <span class="network-badge">🟦 Base Sepolia</span>
            </div>
        `;
        walletInfo.style.display = 'block';
    } else if (walletInfo) {
        walletInfo.style.display = 'none';
    }
}

// Handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        console.log('🔌 MetaMask disconnected');
        if (typeof addMessage === 'function') {
            addMessage('🔌 Wallet disconnected. Please connect again.', 'bot');
        }
        updateWalletUI(false);
        userAccount = null;
        web3 = null;
    } else if (accounts[0] !== userAccount) {
        userAccount = accounts[0];
        console.log('🔄 Account changed to:', userAccount);
        if (typeof addMessage === 'function') {
            addMessage(`🔄 Account switched to: ${userAccount.substring(0, 6)}...${userAccount.substring(38)}`, 'bot');
        }
        updateWalletUI(true);
    }
}

// Handle network changes
function handleChainChanged(chainId) {
    console.log('🌐 Network changed to:', chainId);
    if (chainId === BASE_SEPOLIA_CONFIG.chainId) {
        if (typeof addMessage === 'function') {
            addMessage('✅ Switched to Base Sepolia network!', 'bot');
        }
    } else {
        if (typeof addMessage === 'function') {
            addMessage('⚠️ Please switch to Base Sepolia network for full functionality.', 'bot');
        }
    }
    // Reload the page to refresh the connection
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Get current network info
async function getCurrentNetwork() {
    if (web3) {
        try {
            const chainId = await web3.eth.getChainId();
            return chainId;
        } catch (error) {
            console.error('Error getting network:', error);
            return null;
        }
    }
    return null;
}

// Check if on Base Sepolia
async function isOnBaseSepolia() {
    const chainId = await getCurrentNetwork();
    return chainId === 84532; // Base Sepolia chain ID
}

// Load transaction history (placeholder)
async function loadTransactionHistory() {
    if (!userAccount) {
        console.log('❌ No wallet connected');
        return;
    }
    
    if (!await isOnBaseSepolia()) {
        console.log('❌ Not on Base Sepolia network');
        return;
    }
    
    console.log('📊 Loading transaction history for:', userAccount);
    
    // Placeholder for transaction history implementation
    if (typeof addMessage === 'function') {
        addMessage('📊 Transaction history feature coming soon!', 'bot');
    }
}

// ✅ FUNCIÓN PRINCIPAL - Procesamiento completo de transacción
async function processCompleteTransaction(recipientAddress, amount, currency) {
    if (!userAccount) {
        throw new Error('🔌 No wallet connected. Connect MetaMask first.');
    }
    
    if (!await isOnBaseSepolia()) {
        throw new Error('🌐 You must be on Base Sepolia network.');
    }
    
    if (!web3) {
        throw new Error('🔧 Web3 is not initialized.');
    }
    
    try {
        // Validate address
        if (!web3.utils.isAddress(recipientAddress)) {
            throw new Error('❌ Invalid recipient address.');
        }
        
        // Convert amount to Wei
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
        
        // Check balance
        const balance = await web3.eth.getBalance(userAccount);
        const balanceInEth = parseFloat(web3.utils.fromWei(balance, 'ether'));
        
        if (balanceInEth < amount) {
            throw new Error(`💸 Insufficient balance. You have ${balanceInEth.toFixed(6)} ETH, need ${amount} ETH.`);
        }
        
        // Estimate gas
        const gasEstimate = await web3.eth.estimateGas({
            from: userAccount,
            to: recipientAddress,
            value: amountInWei
        });
        
        // Get gas price
        const gasPrice = await web3.eth.getGasPrice();
        
        // Prepare transaction
        const transactionParams = {
            from: userAccount,
            to: recipientAddress,
            value: amountInWei,
            gas: Math.floor(gasEstimate * 1.2), // 20% buffer
            gasPrice: gasPrice
        };
        
        console.log('🚀 Sending transaction:', transactionParams);
        
        // Send transaction
        const result = await web3.eth.sendTransaction(transactionParams);
        
        console.log('✅ Transaction successful:', result);
        
        return {
            hash: result.transactionHash,
            blockNumber: result.blockNumber,
            gasUsed: result.gasUsed,
            success: true
        };
        
    } catch (error) {
        console.error('❌ Transaction error:', error);
        
        // Improve error messages
        if (error.code === 4001) {
            throw new Error('🚫 Transaction rejected by user.');
        } else if (error.message.includes('insufficient funds')) {
            throw new Error('💸 Insufficient funds to cover gas + amount.');
        } else if (error.message.includes('gas')) {
            throw new Error('⛽ Gas error. Please try again.');
        } else {
            throw new Error(`❌ Transaction error: ${error.message}`);
        }
    }
}

// Function to get account balance
async function getAccountBalance() {
    if (!userAccount || !web3) {
        return '0';
    }
    
    try {
        const balance = await web3.eth.getBalance(userAccount);
        return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
        console.error('Error getting balance:', error);
        return '0';
    }
}

// Function to validate Ethereum address
function isValidEthereumAddress(address) {
    if (!web3) return false;
    return web3.utils.isAddress(address);
}

// Export functions for global access
window.connectWallet = connectWallet;
window.switchToBaseSepolia = switchToBaseSepolia;
window.loadTransactionHistory = loadTransactionHistory;
window.processCompleteTransaction = processCompleteTransaction;
window.getAccountBalance = getAccountBalance;
window.isValidEthereumAddress = isValidEthereumAddress;

console.log('🚀 Web3 integration script loaded successfully!');
