const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Iniciando despliegue del contrato TransactionManager...");
    
    // Obtener la red actual
    const network = await ethers.provider.getNetwork();
    console.log(`📡 Red de despliegue: ${network.name} (ChainID: ${network.chainId})`);
    
    // Obtener el deployer
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Deployer: ${deployer.address}`);
    
    // Verificar balance
    const balance = await deployer.getBalance();
    console.log(`💰 Balance: ${ethers.utils.formatEther(balance)} ETH`);
    
    if (balance.lt(ethers.utils.parseEther("0.01"))) {
        console.log("⚠️  Balance bajo. Asegúrate de tener ETH suficiente para el despliegue.");
    }
    
    // Compilar y desplegar
    console.log("🔨 Compilando contrato...");
    const TransactionManager = await ethers.getContractFactory("TransactionManager");
    
    console.log("📤 Desplegando contrato...");
    const transactionManager = await TransactionManager.deploy();
    
    console.log("⏳ Esperando confirmaciones...");
    await transactionManager.deployed();
    
    console.log(`✅ Contrato desplegado exitosamente!`);
    console.log(`📍 Dirección: ${transactionManager.address}`);
    console.log(`🔗 Transaction Hash: ${transactionManager.deployTransaction.hash}`);
    
    // Actualizar config.json automáticamente
    await updateConfig(transactionManager.address, network);
    
    // Guardar información de despliegue
    await saveDeploymentInfo(transactionManager.address, network, transactionManager.deployTransaction.hash);
    
    // Verificar el contrato después de un tiempo
    if (process.env.ETHERSCAN_API_KEY || process.env.BASESCAN_API_KEY) {
        console.log("⏳ Esperando antes de verificar el contrato...");
        await new Promise(resolve => setTimeout(resolve, 30000)); // Esperar 30 segundos
        
        try {
            console.log("🔍 Verificando contrato en el explorador...");
            await hre.run("verify:verify", {
                address: transactionManager.address,
                constructorArguments: [],
            });
            console.log("✅ Contrato verificado exitosamente!");
        } catch (error) {
            console.log("⚠️ Error verificando contrato:", error.message);
        }
    }
    
    // Mostrar URLs útiles
    console.log("\n📋 Información útil:");
    if (network.chainId === 11155111) {
        console.log(`🔗 Etherscan: https://sepolia.etherscan.io/address/${transactionManager.address}`);
    } else if (network.chainId === 84532) {
        console.log(`🔗 BaseScan: https://sepolia.basescan.org/address/${transactionManager.address}`);
    }
    console.log(`📁 Dirección guardada en: deployments/${network.name}.json`);
    console.log(`⚙️ Config.json actualizado automáticamente`);
    
    console.log("\n🎉 ¡Despliegue completado! Ahora puedes usar el chatbot con transacciones reales.");
}

async function updateConfig(contractAddress, network) {
    try {
        const configPath = path.join(__dirname, "..", "config.json");
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        
        // Actualizar la dirección del contrato
        config.blockchain.contractAddress = contractAddress;
        
        // Actualizar la red por defecto según donde se desplegó
        if (network.chainId === 11155111) {
            config.blockchain.defaultNetwork = "sepolia";
        } else if (network.chainId === 84532) {
            config.blockchain.defaultNetwork = "baseSepolia";
        }
        
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log("✅ config.json actualizado con la nueva dirección del contrato");
    } catch (error) {
        console.log("⚠️ Error actualizando config.json:", error.message);
    }
}

async function saveDeploymentInfo(contractAddress, network, txHash) {
    try {
        const deploymentsDir = path.join(__dirname, "..", "deployments");
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir);
        }
        
        const deploymentInfo = {
            contractAddress,
            network: network.name,
            chainId: network.chainId,
            deploymentTxHash: txHash,
            timestamp: new Date().toISOString(),
            abi: "TransactionManager"
        };
        
        const filePath = path.join(deploymentsDir, `${network.name}.json`);
        fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
        
        console.log(`✅ Información de despliegue guardada en: deployments/${network.name}.json`);
    } catch (error) {
        console.log("⚠️ Error guardando información de despliegue:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error en el despliegue:", error);
        process.exit(1);
    });
