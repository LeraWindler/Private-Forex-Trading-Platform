import { ethers } from "hardhat";

/**
 * @title PrivateForexTrading Deployment Script
 * @notice Automated deployment with error handling and verification
 * @dev Demonstrates proper deployment patterns for FHEVM contracts
 */

async function main() {
  console.log("🚀 Starting PrivateForexTrading deployment...\n");

  try {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);

    // Check deployer balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

    if (balance === 0n) {
      throw new Error("❌ Deployer account has no funds!");
    }

    // Get the contract factory
    console.log("📦 Getting contract factory...");
    const PrivateForexTradingFactory = await ethers.getContractFactory("PrivateForexTrading");

    // Deploy the contract
    console.log("🔨 Deploying contract...");
    const contract = await PrivateForexTradingFactory.deploy();

    // Wait for deployment to be mined
    console.log("⏳ Waiting for deployment transaction to be mined...");
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();
    console.log("\n✅ Contract deployed successfully!");
    console.log("📍 Contract address:", contractAddress);

    // Verify initial state
    console.log("\n🔍 Verifying initial state...");
    const owner = await contract.owner();
    const currentSession = await contract.currentSession();
    const isActive = await contract.isSessionActive();

    console.log("   Owner:", owner);
    console.log("   Current session:", currentSession.toString());
    console.log("   Session active:", isActive);

    // Save deployment info
    const deploymentInfo = {
      network: (await ethers.provider.getNetwork()).name,
      contractAddress: contractAddress,
      deployer: deployer.address,
      blockNumber: await ethers.provider.getBlockNumber(),
      timestamp: new Date().toISOString(),
      owner: owner,
      currentSession: currentSession.toString(),
    };

    console.log("\n📄 Deployment Summary:");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // Instructions for next steps
    console.log("\n📚 Next Steps:");
    console.log("1. Save the contract address:", contractAddress);
    console.log("2. Update your .env file with CONTRACT_ADDRESS");
    console.log("3. Verify the contract on block explorer (if on public network)");
    console.log("4. Start trading session with: await contract.startTradingSession([rates])");

    // Network-specific instructions
    const network = await ethers.provider.getNetwork();
    if (network.chainId === 31337n) {
      console.log("\n💻 Local Network Detected");
      console.log("   You can interact with the contract using Hardhat console:");
      console.log(`   npx hardhat console --network localhost`);
    } else {
      console.log("\n🌐 Public Network Detected");
      console.log("   View your contract on the block explorer");

      if (network.chainId === 11155111n) {
        console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
      }
    }

  } catch (error: any) {
    console.error("\n❌ Deployment failed!");
    console.error("Error:", error.message);

    // Provide helpful error messages
    if (error.message.includes("insufficient funds")) {
      console.error("\n💡 Tip: Make sure your account has enough ETH for deployment");
    } else if (error.message.includes("nonce")) {
      console.error("\n💡 Tip: Try resetting your account nonce in MetaMask");
    } else if (error.message.includes("network")) {
      console.error("\n💡 Tip: Check your network configuration in hardhat.config.ts");
    }

    process.exit(1);
  }
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
