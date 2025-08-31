const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Iniciando despliegue del contrato TransactionManager...");
    
    try {
        // Obtener la red actual
        const network = await ethers.provider.getNetwork();
        console.log(`📡 Red de despliegue: ${network.name} (ChainID: ${network.chainId})`);
        
        // Obtener el deployer
        const [deployer] = await ethers.getSigners();
        console.log(`👤 Deployer: ${deployer.address}`);
        
        // Verificar balance
        const balance = await deployer.getBalance();
        console.log(`💰 Balance: ${ethers.utils.formatEther(balance)} ETH`);
        
        if (balance.lt(ethers.utils.parseEther("0.001"))) {
            console.log("⚠️ Balance muy bajo. Necesitas más ETH de prueba.");
            console.log("🚰 Obtén ETH en: https://sepoliafaucet.com/");
            return;
        }
        
        // Compilar y desplegar
        console.log("🔨 Obteniendo factory del contrato...");
        const TransactionManager = await ethers.getContractFactory("TransactionManager");
        
        console.log("📤 Desplegando contrato...");
        const transactionManager = await TransactionManager.deploy();
        
        console.log("⏳ Esperando confirmaciones...");
        await transactionManager.deployed();
        
        console.log(`✅ Contrato desplegado exitosamente!`);
        console.log(`📍 Dirección: ${transactionManager.address}`);
        console.log(`🔗 Transaction Hash: ${transactionManager.deployTransaction.hash}`);
        
        // Actualizar config.json
        console.log("⚙️ Actualizando config.json...");
        await updateConfig(transactionManager.address, network);
        
        // Guardar información de despliegue
        await saveDeploymentInfo(transactionManager.address, network, transactionManager.deployTransaction.hash);
        
        // Mostrar URLs útiles
        console.log("\n📋 Información útil:");
        if (network.chainId === 11155111) {
            console.log(`🔗 Etherscan: https://sepolia.etherscan.io/address/${transactionManager.address}`);
        } else if (network.chainId === 84532) {
            console.log(`🔗 BaseScan: https://sepolia.basescan.org/address/${transactionManager.address}`);
        }
        
        console.log("\n🎉 ¡Despliegue completado exitosamente!");
        
    } catch (error) {
        console.error("❌ Error en el despliegue:", error.message);
        throw error;
    }
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
        console.log("✅ config.json actualizado");
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
            timestamp: new Date().toISOString()
        };
        
        const fileName = network.chainId === 11155111 ? "sepolia.json" : "base-sepolia.json";
        const filePath = path.join(deploymentsDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
        
        console.log(`✅ Info guardada en: deployments/${fileName}`);
    } catch (error) {
        console.log("⚠️ Error guardando info:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error fatal:", error);
        process.exit(1);
    });
