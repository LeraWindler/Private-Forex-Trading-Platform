import { ethers } from "hardhat";

async function main() {
  console.log("Deploying FHECounter...\n");

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from address: ${deployer.address}`);

  // Get contract factory
  const FHECounter = await ethers.getContractFactory("FHECounter");

  // Deploy contract
  console.log("Deploying contract...");
  const counter = await FHECounter.deploy();

  await counter.waitForDeployment();
  const address = await counter.getAddress();

  console.log(`\n✅ FHECounter deployed to: ${address}`);
  console.log(`📝 Transaction hash: ${counter.deploymentTransaction()?.hash}`);
  console.log(`🌐 Network: ${(await ethers.provider.getNetwork()).name}`);

  // Verify deployment
  console.log("\nVerifying deployment...");
  const owner = await counter.owner();
  console.log(`✅ Owner verified: ${owner}`);

  console.log("\n✨ Deployment complete!");
  console.log("\nNext steps:");
  console.log(`1. Interact with the contract at: ${address}`);
  console.log(`2. Increment counter: await counter.incrementBy1()`);
  console.log(`3. Get counter: await counter.getCounter()`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
