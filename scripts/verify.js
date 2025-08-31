const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Verificando configuración...");
    
    try {
        // Verificar conexión a la red
        const network = await ethers.provider.getNetwork();
        console.log(`📡 Conectado a red: ${network.name} (ChainID: ${network.chainId})`);
        
        // Verificar wallet
        const [deployer] = await ethers.getSigners();
        console.log(`👤 Wallet address: ${deployer.address}`);
        
        // Verificar balance
        const balance = await deployer.getBalance();
        console.log(`💰 Balance: ${ethers.utils.formatEther(balance)} ETH`);
        
        if (balance.eq(0)) {
            console.log("❌ Sin balance. Necesitas ETH de prueba.");
            console.log("🚰 Obtén ETH en: https://sepoliafaucet.com/");
            return;
        }
        
        console.log("✅ Configuración verificada. Listo para desplegar.");
        
    } catch (error) {
        console.error("❌ Error de configuración:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
