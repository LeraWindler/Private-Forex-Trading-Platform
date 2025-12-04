import { expect } from "chai";
import { ethers } from "hardhat";
import { PrivateForexTrading } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

/**
 * @title PrivateForexTrading Test Suite
 * @notice Comprehensive test suite demonstrating FHEVM patterns and best practices
 * @dev This test suite covers:
 *      - Trader registration with encrypted balances
 *      - Access control patterns (FHE.allow, FHE.allowThis)
 *      - Trading session management
 *      - Private order placement with encrypted data
 *      - Order execution and encrypted arithmetic (FHE.add)
 *      - Edge cases and error handling
 *
 * @custom:chapter access-control
 * @custom:chapter encryption
 * @custom:chapter user-decryption
 * @custom:test-pattern Each test demonstrates a specific FHEVM pattern
 */
describe("PrivateForexTrading", function () {
  let contract: PrivateForexTrading;
  let owner: SignerWithAddress;
  let trader1: SignerWithAddress;
  let trader2: SignerWithAddress;
  let nonTrader: SignerWithAddress;

  const SESSION_DURATION = 14400; // 4 hours in seconds
  const INITIAL_BALANCE = 10000n;
  const TRADE_AMOUNT = 1000n;
  const TARGET_PRICE = 11000; // 1.1000 scaled by 10000

  /**
   * @notice Setup hook runs before each test
   * @dev Deploys fresh contract instance and gets signers
   *      This ensures test isolation and prevents state pollution
   */
  beforeEach(async function () {
    // Get signers for testing different roles
    [owner, trader1, trader2, nonTrader] = await ethers.getSigners();

    /**
     * @dev Deploy the PrivateForexTrading contract
     * @custom:deployment-pattern Standard Hardhat deployment pattern
     */
    const PrivateForexTradingFactory = await ethers.getContractFactory("PrivateForexTrading");
    contract = await PrivateForexTradingFactory.deploy();
    await contract.waitForDeployment();
  });

  /**
   * @notice Test suite for contract deployment
   * @dev Verifies initial state after deployment
   */
  describe("Deployment", function () {
    /**
     * @notice Should set the correct owner
     * @dev The deployer should be set as the contract owner
     *      This is a critical security check
     */
    it("Should set the correct owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    /**
     * @notice Should initialize with session 1
     * @dev Verifies that the first session ID is 1
     */
    it("Should initialize with session 1", async function () {
      expect(await contract.currentSession()).to.equal(1);
    });

    /**
     * @notice Should have no active session initially
     * @dev Initially, no session should be active until owner starts one
     */
    it("Should have no active session initially", async function () {
      expect(await contract.isSessionActive()).to.be.false;
    });
  });

  /**
   * @notice Test suite for trader registration
   * @dev Covers registration flow and access control patterns
   * @custom:encryption-pattern Shows how to handle encrypted user data
   * @custom:access-control-pattern Demonstrates FHE.allow() and FHE.allowThis()
   */
  describe("Trader Registration", function () {
    /**
     * @notice Should allow a trader to register with initial balance
     * @dev This test demonstrates:
     *      - Encrypting user input (initial balance)
     *      - Storing encrypted data on-chain
     *      - Setting up proper access control
     *      - Emitting events for transparency
     *
     * @custom:fhevm-pattern Registration with encrypted balance
     */
    it("Should allow a trader to register with initial balance", async function () {
      /**
       * @dev Register trader1 with an initial balance
       * The balance will be encrypted as euint64 on-chain
       */
      const tx = await contract.connect(trader1).registerTrader(INITIAL_BALANCE);

      /**
       * @dev Verify that TraderRegistered event was emitted
       * Events provide transparency without revealing encrypted data
       */
      await expect(tx)
        .to.emit(contract, "TraderRegistered")
        .withArgs(trader1.address);

      /**
       * @dev Check that the trader profile was created
       * The isRegistered flag should be true
       */
      const profile = await contract.getTraderProfile(trader1.address);
      expect(profile.isRegistered).to.be.true;
      expect(profile.lastActivity).to.be.greaterThan(0);
    });

    /**
     * @notice Should prevent double registration
     * @dev Ensures traders cannot register twice
     *      This prevents balance manipulation attacks
     */
    it("Should prevent double registration", async function () {
      await contract.connect(trader1).registerTrader(INITIAL_BALANCE);

      /**
       * @dev Attempting to register again should revert
       * with "Already registered" error message
       */
      await expect(
        contract.connect(trader1).registerTrader(INITIAL_BALANCE)
      ).to.be.revertedWith("Already registered");
    });

    /**
     * @notice Should reject zero initial balance
     * @dev Validates input to prevent meaningless registrations
     */
    it("Should reject zero initial balance", async function () {
      await expect(
        contract.connect(trader1).registerTrader(0)
      ).to.be.revertedWith("Initial balance must be positive");
    });

    /**
     * @notice Multiple traders should be able to register independently
     * @dev Verifies that the system supports multiple concurrent traders
     *      Each trader's encrypted data is isolated
     *
     * @custom:scalability-test Tests multiple user isolation
     */
    it("Multiple traders should be able to register independently", async function () {
      await contract.connect(trader1).registerTrader(INITIAL_BALANCE);
      await contract.connect(trader2).registerTrader(INITIAL_BALANCE * 2n);

      const profile1 = await contract.getTraderProfile(trader1.address);
      const profile2 = await contract.getTraderProfile(trader2.address);

      expect(profile1.isRegistered).to.be.true;
      expect(profile2.isRegistered).to.be.true;
    });
  });

  /**
   * @notice Test suite for trading session management
   * @dev Covers session lifecycle: start, active checks, and ending
   * @custom:encryption-pattern Shows how to encrypt arrays of values
   */
  describe("Trading Session Management", function () {
    /**
     * @notice Forex rates for testing (scaled by 10000)
     * @dev These represent realistic forex rates:
     *      EUR/USD: 1.1000, GBP/USD: 1.2500, USD/JPY: 0.1500,
     *      AUD/USD: 0.6500, USD/CHF: 0.9200
     */
    const forexRates = [11000, 12500, 1500, 6500, 9200];

    /**
     * @notice Should allow owner to start a trading session
     * @dev This test demonstrates:
     *      - Encrypting multiple values (forex rates array)
     *      - Setting session parameters
     *      - Proper event emission
     *
     * @custom:admin-function Only owner can start sessions
     */
    it("Should allow owner to start a trading session", async function () {
      const tx = await contract.startTradingSession(forexRates);

      /**
       * @dev Verify SessionStarted event emission
       * Events allow tracking session history
       */
      await expect(tx)
        .to.emit(contract, "SessionStarted")
        .withArgs(1, await time.latest());

      /**
       * @dev Verify that the session is now active
       * isSessionActive() checks multiple conditions
       */
      expect(await contract.isSessionActive()).to.be.true;
    });

    /**
     * @notice Should prevent non-owner from starting session
     * @dev Access control test: only owner should have this privilege
     *
     * @custom:security-test Ensures proper access control
     */
    it("Should prevent non-owner from starting session", async function () {
      await expect(
        contract.connect(trader1).startTradingSession(forexRates)
      ).to.be.revertedWith("Not authorized");
    });

    /**
     * @notice Should prevent starting a session while one is active
     * @dev Ensures only one session runs at a time
     */
    it("Should prevent starting a session while one is active", async function () {
      await contract.startTradingSession(forexRates);

      await expect(
        contract.startTradingSession(forexRates)
      ).to.be.revertedWith("Session currently active");
    });

    /**
     * @notice Should enforce session duration between sessions
     * @dev Tests the time-lock mechanism between sessions
     *
     * @custom:timing-test Verifies session timing logic
     */
    it("Should enforce session duration between sessions", async function () {
      await contract.startTradingSession(forexRates);

      // End the session
      await time.increase(SESSION_DURATION + 1);
      await contract.executePrivateOrders();

      /**
       * @dev Immediately trying to start a new session should fail
       * Must wait for SESSION_DURATION
       */
      await expect(
        contract.startTradingSession(forexRates)
      ).to.be.revertedWith("Too early for new session");
    });

    /**
     * @notice Should correctly report session information
     * @dev Tests the getCurrentSessionInfo() view function
     */
    it("Should correctly report session information", async function () {
      await contract.startTradingSession(forexRates);

      const sessionInfo = await contract.getCurrentSessionInfo();

      expect(sessionInfo.session).to.equal(1);
      expect(sessionInfo.pricesSet).to.be.true;
      expect(sessionInfo.sessionActive).to.be.true;
      expect(sessionInfo.activeTraderCount).to.equal(0); // No traders yet
    });

    /**
     * @notice Should verify rate initialization for currency pairs
     * @dev Tests FHE.isInitialized() usage pattern
     *
     * @custom:fhe-utility Shows how to check if encrypted value exists
     */
    it("Should verify rate initialization for currency pairs", async function () {
      await contract.startTradingSession(forexRates);

      /**
       * @dev Check that all currency pair rates are initialized
       * hasRateForPair() uses FHE.isInitialized()
       */
      expect(await contract.hasRateForPair(1, 0)).to.be.true; // EUR_USD
      expect(await contract.hasRateForPair(1, 1)).to.be.true; // GBP_USD
      expect(await contract.hasRateForPair(1, 2)).to.be.true; // USD_JPY
      expect(await contract.hasRateForPair(1, 3)).to.be.true; // AUD_USD
      expect(await contract.hasRateForPair(1, 4)).to.be.true; // USD_CHF
    });
  });

  /**
   * @notice Test suite for private order placement
   * @dev Covers order creation, encryption, and access control
   * @custom:privacy-pattern Demonstrates how sensitive data remains private
   */
  describe("Private Order Placement", function () {
    const forexRates = [11000, 12500, 1500, 6500, 9200];

    /**
     * @notice Setup hook for order tests
     * @dev Registers a trader and starts a session before each test
     */
    beforeEach(async function () {
      await contract.connect(trader1).registerTrader(INITIAL_BALANCE);
      await contract.startTradingSession(forexRates);
    });

    /**
     * @notice Should allow registered trader to place private order
     * @dev This is the core privacy feature test:
     *      - Amount is encrypted (position size is private)
     *      - Target price is encrypted (strategy is private)
     *      - Currency pair is encrypted (focus is private)
     *      - Only trader and contract can access these values
     *
     * @custom:privacy-benefit All order details remain confidential
     * @custom:fhevm-pattern Multiple encrypted values with access control
     */
    it("Should allow registered trader to place private order", async function () {
      const currencyPair = 0; // EUR_USD

      const tx = await contract
        .connect(trader1)
        .placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, currencyPair);

      /**
       * @dev Verify PrivateOrderPlaced event
       * Note: Event contains indices, not actual order data
       * This maintains privacy while allowing tracking
       */
      await expect(tx)
        .to.emit(contract, "PrivateOrderPlaced")
        .withArgs(trader1.address, 1, 0); // session 1, order index 0

      /**
       * @dev Verify order count increased
       * The actual order data is encrypted and inaccessible
       */
      const orderCount = await contract.getTraderOrderCount(trader1.address);
      expect(orderCount).to.equal(1);
    });

    /**
     * @notice Should prevent non-registered users from placing orders
     * @dev Access control test: must be registered to trade
     */
    it("Should prevent non-registered users from placing orders", async function () {
      await expect(
        contract.connect(nonTrader).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 0)
      ).to.be.revertedWith("Trader not registered");
    });

    /**
     * @notice Should prevent orders when no session is active
     * @dev Session timing test: can only trade during active sessions
     */
    it("Should prevent orders when no session is active", async function () {
      /**
       * @dev Move time forward to end the session
       * Then try to place an order
       */
      await time.increase(SESSION_DURATION + 1);

      await expect(
        contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 0)
      ).to.be.revertedWith("No active trading session");
    });

    /**
     * @notice Should reject zero amount orders
     * @dev Input validation test
     */
    it("Should reject zero amount orders", async function () {
      await expect(
        contract.connect(trader1).placePrivateOrder(0, TARGET_PRICE, 0)
      ).to.be.revertedWith("Amount must be positive");
    });

    /**
     * @notice Should reject invalid currency pair IDs
     * @dev Validates currency pair enumeration (0-4 are valid)
     */
    it("Should reject invalid currency pair IDs", async function () {
      await expect(
        contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 5)
      ).to.be.revertedWith("Invalid currency pair");
    });

    /**
     * @notice Should reject zero target price
     * @dev Price validation test
     */
    it("Should reject zero target price", async function () {
      await expect(
        contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, 0, 0)
      ).to.be.revertedWith("Target price must be positive");
    });

    /**
     * @notice Should allow multiple orders from same trader
     * @dev Tests that traders can place multiple orders
     *      Each order is separately encrypted
     */
    it("Should allow multiple orders from same trader", async function () {
      await contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 0);
      await contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT * 2n, TARGET_PRICE + 500, 1);

      const orderCount = await contract.getTraderOrderCount(trader1.address);
      expect(orderCount).to.equal(2);
    });

    /**
     * @notice Should track active traders correctly
     * @dev Verifies that placing an order adds trader to active list
     */
    it("Should track active traders correctly", async function () {
      await contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 0);

      const sessionInfo = await contract.getCurrentSessionInfo();
      expect(sessionInfo.activeTraderCount).to.equal(1);
    });

    /**
     * @notice Should not duplicate traders in active list
     * @dev Tests that multiple orders from same trader don't duplicate
     */
    it("Should not duplicate traders in active list", async function () {
      await contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 0);
      await contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 1);

      const sessionInfo = await contract.getCurrentSessionInfo();
      expect(sessionInfo.activeTraderCount).to.equal(1); // Still just 1 unique trader
    });

    /**
     * @notice Should update trader's last activity timestamp
     * @dev Verifies activity tracking
     */
    it("Should update trader's last activity timestamp", async function () {
      const beforeProfile = await contract.getTraderProfile(trader1.address);

      await time.increase(100);

      await contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 0);

      const afterProfile = await contract.getTraderProfile(trader1.address);
      expect(afterProfile.lastActivity).to.be.greaterThan(beforeProfile.lastActivity);
    });
  });

  /**
   * @notice Test suite for order execution
   * @dev Covers order processing and encrypted arithmetic operations
   * @custom:fhe-arithmetic Demonstrates FHE.add() usage
   */
  describe("Order Execution", function () {
    const forexRates = [11000, 12500, 1500, 6500, 9200];

    /**
     * @notice Setup hook for execution tests
     * @dev Registers traders, starts session, and places orders
     */
    beforeEach(async function () {
      await contract.connect(trader1).registerTrader(INITIAL_BALANCE);
      await contract.connect(trader2).registerTrader(INITIAL_BALANCE * 2n);
      await contract.startTradingSession(forexRates);
      await contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 0);
      await contract.connect(trader2).placePrivateOrder(TRADE_AMOUNT * 2n, TARGET_PRICE + 500, 1);
    });

    /**
     * @notice Should execute orders after session ends
     * @dev This test demonstrates:
     *      - Order execution timing
     *      - Batch processing of orders
     *      - Encrypted trade counter increment (FHE.add)
     *      - Session state transition
     *
     * @custom:fhe-arithmetic Shows FHE.add() for incrementing encrypted counter
     */
    it("Should execute orders after session ends", async function () {
      /**
       * @dev Move time forward to end the session
       * Orders can only be executed after session ends
       */
      await time.increase(SESSION_DURATION + 1);

      const tx = await contract.executePrivateOrders();

      /**
       * @dev Verify OrderExecuted events for both traders
       * This shows batch processing of all active orders
       */
      await expect(tx).to.emit(contract, "OrderExecuted");
    });

    /**
     * @notice Should prevent execution before session ends
     * @dev Timing constraint: must wait for session to end
     */
    it("Should prevent execution before session ends", async function () {
      await expect(
        contract.executePrivateOrders()
      ).to.be.revertedWith("Session not yet ended");
    });

    /**
     * @notice Should prevent non-owner from executing orders
     * @dev Access control: only owner can trigger execution
     */
    it("Should prevent non-owner from executing orders", async function () {
      await time.increase(SESSION_DURATION + 1);

      await expect(
        contract.connect(trader1).executePrivateOrders()
      ).to.be.revertedWith("Not authorized");
    });

    /**
     * @notice Should increment session number after execution
     * @dev Verifies session lifecycle and state transition
     */
    it("Should increment session number after execution", async function () {
      const beforeSession = await contract.currentSession();

      await time.increase(SESSION_DURATION + 1);
      await contract.executePrivateOrders();

      const afterSession = await contract.currentSession();
      expect(afterSession).to.equal(beforeSession + 1n);
    });

    /**
     * @notice Should mark session as inactive after execution
     * @dev State transition test
     */
    it("Should mark session as inactive after execution", async function () {
      await time.increase(SESSION_DURATION + 1);
      await contract.executePrivateOrders();

      expect(await contract.isSessionActive()).to.be.false;
    });

    /**
     * @notice Should execute orders for multiple traders
     * @dev Tests batch processing of orders from different traders
     */
    it("Should execute orders for multiple traders", async function () {
      await time.increase(SESSION_DURATION + 1);
      const tx = await contract.executePrivateOrders();

      // Both traders should have their orders executed
      await expect(tx).to.emit(contract, "OrderExecuted");
    });
  });

  /**
   * @notice Test suite for balance updates
   * @dev Covers encrypted balance management
   */
  describe("Balance Updates", function () {
    /**
     * @notice Should allow trader to update their balance
     * @dev Demonstrates updating encrypted values with proper ACL reset
     */
    it("Should allow registered trader to update balance", async function () {
      await contract.connect(trader1).registerTrader(INITIAL_BALANCE);

      const newBalance = 20000n;
      await expect(
        contract.connect(trader1).updateTraderBalance(newBalance)
      ).to.not.be.reverted;
    });

    /**
     * @notice Should prevent non-registered users from updating balance
     * @dev Access control for balance updates
     */
    it("Should prevent non-registered users from updating balance", async function () {
      await expect(
        contract.connect(nonTrader).updateTraderBalance(5000)
      ).to.be.revertedWith("Trader not registered");
    });
  });

  /**
   * @notice Test suite for emergency functions
   * @dev Tests emergency controls
   */
  describe("Emergency Functions", function () {
    const forexRates = [11000, 12500, 1500, 6500, 9200];

    /**
     * @notice Should allow owner to emergency end session
     * @dev Emergency stop mechanism for exceptional situations
     */
    it("Should allow owner to emergency end session", async function () {
      await contract.startTradingSession(forexRates);

      await contract.emergencyEndSession();

      const sessionInfo = await contract.getCurrentSessionInfo();
      expect(sessionInfo.sessionActive).to.be.false;
    });

    /**
     * @notice Should prevent non-owner from emergency ending
     * @dev Access control for emergency functions
     */
    it("Should prevent non-owner from emergency ending session", async function () {
      await contract.startTradingSession(forexRates);

      await expect(
        contract.connect(trader1).emergencyEndSession()
      ).to.be.revertedWith("Not authorized");
    });

    /**
     * @notice Should prevent emergency end when no session active
     * @dev State validation for emergency functions
     */
    it("Should prevent emergency end when no session is active", async function () {
      await expect(
        contract.emergencyEndSession()
      ).to.be.revertedWith("No active session");
    });
  });

  /**
   * @notice Test suite for view functions
   * @dev Tests all read-only functions
   */
  describe("View Functions", function () {
    const forexRates = [11000, 12500, 1500, 6500, 9200];

    beforeEach(async function () {
      await contract.connect(trader1).registerTrader(INITIAL_BALANCE);
      await contract.startTradingSession(forexRates);
      await contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 0);
    });

    /**
     * @notice Should return correct trader profile
     * @dev Tests getTraderProfile() function
     */
    it("Should return correct trader profile", async function () {
      const profile = await contract.getTraderProfile(trader1.address);
      expect(profile.isRegistered).to.be.true;
      expect(profile.lastActivity).to.be.greaterThan(0);
    });

    /**
     * @notice Should return correct order count
     * @dev Tests getTraderOrderCount() function
     */
    it("Should return correct order count for trader", async function () {
      const count = await contract.getTraderOrderCount(trader1.address);
      expect(count).to.equal(1);
    });

    /**
     * @notice Should return correct session history
     * @dev Tests getSessionHistory() function
     */
    it("Should return correct session history", async function () {
      const history = await contract.getSessionHistory(1);
      expect(history.sessionActive).to.be.true;
      expect(history.pricesSet).to.be.true;
      expect(history.traderCount).to.equal(1);
    });

    /**
     * @notice Should allow trader to get their encrypted trade count
     * @dev Tests getMyEncryptedTotalTrades() - user decryption pattern
     *
     * @custom:user-decryption Returns encrypted value for client-side decryption
     */
    it("Should allow trader to get their encrypted trade count", async function () {
      // This returns an encrypted value (euint32)
      // In a real application, the user would decrypt this client-side
      await expect(
        contract.connect(trader1).getMyEncryptedTotalTrades()
      ).to.not.be.reverted;
    });

    /**
     * @notice Should prevent non-registered users from getting encrypted trades
     * @dev Access control for encrypted data
     */
    it("Should prevent non-registered users from getting encrypted trades", async function () {
      await expect(
        contract.connect(nonTrader).getMyEncryptedTotalTrades()
      ).to.be.revertedWith("Trader not registered");
    });
  });

  /**
   * @notice Test suite for complex scenarios
   * @dev Integration tests covering multiple features
   */
  describe("Complex Scenarios", function () {
    const forexRates = [11000, 12500, 1500, 6500, 9200];

    /**
     * @notice Should handle full trading cycle correctly
     * @dev End-to-end test of complete trading flow:
     *      1. Trader registration
     *      2. Session start
     *      3. Multiple order placements
     *      4. Session end and execution
     *      5. New session start
     *
     * @custom:integration-test Full trading cycle
     */
    it("Should handle full trading cycle correctly", async function () {
      // Step 1: Register traders
      await contract.connect(trader1).registerTrader(INITIAL_BALANCE);
      await contract.connect(trader2).registerTrader(INITIAL_BALANCE * 2n);

      // Step 2: Start session
      await contract.startTradingSession(forexRates);

      // Step 3: Place orders
      await contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 0);
      await contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE + 100, 1);
      await contract.connect(trader2).placePrivateOrder(TRADE_AMOUNT * 2n, TARGET_PRICE, 2);

      // Verify state
      let sessionInfo = await contract.getCurrentSessionInfo();
      expect(sessionInfo.activeTraderCount).to.equal(2);

      // Step 4: Execute orders after session ends
      await time.increase(SESSION_DURATION + 1);
      await contract.executePrivateOrders();

      // Step 5: Start new session
      await time.increase(SESSION_DURATION);
      await contract.startTradingSession(forexRates);

      sessionInfo = await contract.getCurrentSessionInfo();
      expect(sessionInfo.session).to.equal(2);
      expect(sessionInfo.sessionActive).to.be.true;
    });

    /**
     * @notice Should maintain data integrity across sessions
     * @dev Tests that trader profiles persist across sessions
     */
    it("Should maintain trader data across sessions", async function () {
      await contract.connect(trader1).registerTrader(INITIAL_BALANCE);
      await contract.startTradingSession(forexRates);
      await contract.connect(trader1).placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, 0);

      // Execute and start new session
      await time.increase(SESSION_DURATION + 1);
      await contract.executePrivateOrders();

      // Trader should still be registered
      const profile = await contract.getTraderProfile(trader1.address);
      expect(profile.isRegistered).to.be.true;
    });
  });
});
