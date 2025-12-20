import { ethers } from "hardhat";

/**
 * @title Contract Interaction Script
 * @notice Helper script to interact with deployed PrivateForexTrading contract
 * @dev Demonstrates how to call contract functions programmatically
 *
 * Usage: npx hardhat run scripts/interact.ts --network <network-name>
 */

async function main() {
  console.log("🔧 PrivateForexTrading Interaction Script\n");

  // Get contract address from command line or environment
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.error("❌ Error: CONTRACT_ADDRESS not set in environment");
    console.log("Set it in .env file or export CONTRACT_ADDRESS=0x...");
    process.exit(1);
  }

  console.log("📍 Contract address:", contractAddress);

  // Get signers
  const [owner, trader1, trader2] = await ethers.getSigners();
  console.log("👤 Owner address:", owner.address);
  console.log("👤 Trader1 address:", trader1.address);
  console.log("👤 Trader2 address:", trader2.address, "\n");

  // Get contract instance
  const contract = await ethers.getContractAt("PrivateForexTrading", contractAddress);

  // Menu of actions
  console.log("📋 Available Actions:");
  console.log("1. Check contract status");
  console.log("2. Register traders");
  console.log("3. Start trading session");
  console.log("4. Place orders");
  console.log("5. Execute orders");
  console.log("6. View session info");

  // For demo purposes, let's execute a complete flow
  await demonstrateCompleteFlow(contract, owner, trader1, trader2);
}

/**
 * @notice Demonstrate a complete trading flow
 * @dev Shows all contract interactions in sequence
 */
async function demonstrateCompleteFlow(
  contract: any,
  owner: any,
  trader1: any,
  trader2: any
) {
  console.log("\n🎯 Starting Complete Trading Flow Demo\n");

  try {
    // Step 1: Check current status
    console.log("📊 Step 1: Checking contract status...");
    const currentSession = await contract.currentSession();
    const isActive = await contract.isSessionActive();
    const contractOwner = await contract.owner();

    console.log("   Current session:", currentSession.toString());
    console.log("   Session active:", isActive);
    console.log("   Contract owner:", contractOwner);

    // Step 2: Register traders
    console.log("\n👥 Step 2: Registering traders...");

    const trader1Profile = await contract.getTraderProfile(trader1.address);
    if (!trader1Profile.isRegistered) {
      console.log("   Registering trader1 with 10,000 balance...");
      const tx1 = await contract.connect(trader1).registerTrader(10000);
      await tx1.wait();
      console.log("   ✅ Trader1 registered");
    } else {
      console.log("   ℹ️ Trader1 already registered");
    }

    const trader2Profile = await contract.getTraderProfile(trader2.address);
    if (!trader2Profile.isRegistered) {
      console.log("   Registering trader2 with 20,000 balance...");
      const tx2 = await contract.connect(trader2).registerTrader(20000);
      await tx2.wait();
      console.log("   ✅ Trader2 registered");
    } else {
      console.log("   ℹ️ Trader2 already registered");
    }

    // Step 3: Start trading session (if not active)
    if (!isActive) {
      console.log("\n🚀 Step 3: Starting trading session...");
      console.log("   Setting forex rates:");
      const forexRates = [11000, 12500, 1500, 6500, 9200];
      const pairNames = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF"];

      forexRates.forEach((rate, index) => {
        const displayRate = (rate / 10000).toFixed(4);
        console.log(`   ${pairNames[index]}: ${displayRate}`);
      });

      const tx = await contract.connect(owner).startTradingSession(forexRates);
      await tx.wait();
      console.log("   ✅ Trading session started");
    } else {
      console.log("\n📍 Step 3: Session already active, skipping start");
    }

    // Step 4: Place orders
    console.log("\n📝 Step 4: Placing private orders...");

    console.log("   Trader1 placing order for EUR/USD...");
    const tx1 = await contract.connect(trader1).placePrivateOrder(
      1000, // amount
      11000, // target price
      0 // EUR/USD
    );
    await tx1.wait();
    console.log("   ✅ Order placed");

    console.log("   Trader2 placing order for GBP/USD...");
    const tx2 = await contract.connect(trader2).placePrivateOrder(
      2000, // amount
      12500, // target price
      1 // GBP/USD
    );
    await tx2.wait();
    console.log("   ✅ Order placed");

    console.log("   Trader1 placing second order for USD/JPY...");
    const tx3 = await contract.connect(trader1).placePrivateOrder(
      1500, // amount
      1500, // target price
      2 // USD/JPY
    );
    await tx3.wait();
    console.log("   ✅ Order placed");

    // Step 5: View current session info
    console.log("\n📊 Step 5: Current session information...");
    const sessionInfo = await contract.getCurrentSessionInfo();

    console.log("   Session ID:", sessionInfo.session.toString());
    console.log("   Prices set:", sessionInfo.pricesSet);
    console.log("   Active:", sessionInfo.sessionActive);
    console.log("   Start time:", new Date(Number(sessionInfo.startTime) * 1000).toLocaleString());
    console.log("   End time:", new Date(Number(sessionInfo.endTime) * 1000).toLocaleString());
    console.log("   Active traders:", sessionInfo.activeTraderCount.toString());

    // Step 6: Check order counts
    console.log("\n📈 Step 6: Order counts per trader...");
    const trader1Orders = await contract.getTraderOrderCount(trader1.address);
    const trader2Orders = await contract.getTraderOrderCount(trader2.address);

    console.log("   Trader1 orders:", trader1Orders.toString());
    console.log("   Trader2 orders:", trader2Orders.toString());

    // Step 7: Check if orders can be executed
    console.log("\n⏰ Step 7: Checking if orders can be executed...");
    const now = Math.floor(Date.now() / 1000);
    const sessionEnd = Number(sessionInfo.endTime);

    if (now > sessionEnd) {
      console.log("   ✅ Session has ended, orders can be executed");
      console.log("   Executing orders...");

      const txExec = await contract.connect(owner).executePrivateOrders();
      await txExec.wait();
      console.log("   ✅ Orders executed successfully");

      // Check new session number
      const newSession = await contract.currentSession();
      console.log("   New session ID:", newSession.toString());
    } else {
      const timeRemaining = sessionEnd - now;
      const hours = Math.floor(timeRemaining / 3600);
      const minutes = Math.floor((timeRemaining % 3600) / 60);
      console.log(`   ⏳ Session still active. Time remaining: ${hours}h ${minutes}m`);
      console.log("   Orders will be executed when session ends");
    }

    // Step 8: View session history
    console.log("\n📜 Step 8: Session history...");
    const history = await contract.getSessionHistory(currentSession);

    console.log("   Session active:", history.sessionActive);
    console.log("   Prices set:", history.pricesSet);
    console.log("   Trader count:", history.traderCount.toString());
    console.log("   Total volume:", history.totalVolume.toString());

    // Summary
    console.log("\n✅ Complete flow demonstration finished!");
    console.log("\n📝 Summary:");
    console.log("   - 2 traders registered");
    console.log("   - 1 trading session created");
    console.log("   - 3 private orders placed");
    console.log("   - All operations successful");

    console.log("\n💡 Next Steps:");
    console.log("   - Wait for session to end");
    console.log("   - Execute orders with: await contract.executePrivateOrders()");
    console.log("   - Start a new session");
    console.log("   - Continue trading");

  } catch (error: any) {
    console.error("\n❌ Error during interaction:", error.message);

    if (error.message.includes("Not authorized")) {
      console.error("💡 Tip: Make sure you're using the owner account for admin functions");
    } else if (error.message.includes("Already registered")) {
      console.error("💡 Tip: This trader is already registered");
    } else if (error.message.includes("No active trading session")) {
      console.error("💡 Tip: Start a trading session first");
    }

    process.exit(1);
  }
}

/**
 * @notice Quick status check function
 * @dev Displays current contract state
 */
async function checkStatus(contract: any) {
  const sessionInfo = await contract.getCurrentSessionInfo();

  console.log("\n📊 Current Status:");
  console.log("=====================================");
  console.log("Session ID:", sessionInfo.session.toString());
  console.log("Active:", sessionInfo.sessionActive ? "Yes" : "No");
  console.log("Active Traders:", sessionInfo.activeTraderCount.toString());

  if (sessionInfo.sessionActive) {
    const now = Math.floor(Date.now() / 1000);
    const endTime = Number(sessionInfo.endTime);
    const remaining = endTime - now;

    if (remaining > 0) {
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      console.log("Time Remaining:", `${hours}h ${minutes}m`);
    } else {
      console.log("Status:", "Session ended, ready for execution");
    }
  }
  console.log("=====================================\n");
}

// Execute main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
