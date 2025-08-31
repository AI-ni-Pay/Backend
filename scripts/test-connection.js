const { ethers } = require("hardhat");

async function main() {
    console.log("Verificando conectividad...");
    
    const [signer] = await ethers.getSigners();
    console.log("Dirección:", signer.address);
    
    const balance = await signer.getBalance();
    console.log("Balance:", ethers.utils.formatEther(balance), "ETH");
}

main().catch(console.error);
