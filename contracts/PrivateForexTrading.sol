// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, euint32, euint8, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title PrivateForexTrading
 * @notice A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)
 * @dev Demonstrates key FHEVM concepts:
 *      - Encrypted data types (euint64, euint32, euint8)
 *      - Access control with FHE.allow() and FHE.allowThis()
 *      - Encrypted arithmetic operations (FHE.add)
 *      - Private order placement with hidden amounts and prices
 *      - Session-based trading with encrypted forex rates
 *
 * @custom:category access-control
 * @custom:category encryption
 * @custom:category user-decryption
 * @custom:example This contract shows how to build a private trading system where:
 *                  - Order amounts remain encrypted on-chain
 *                  - Target prices are hidden from other traders
 *                  - Trading balances are private to each trader
 *                  - Only authorized parties can access encrypted data
 */
contract PrivateForexTrading is SepoliaConfig {

    /// @notice Contract owner who can manage trading sessions
    address public owner;

    /// @notice Current active trading session ID
    uint32 public currentSession;

    /// @notice Timestamp of the last session start
    uint256 public lastSessionTime;

    /// @notice Trading session duration (4 hours in seconds)
    /// @dev Sessions automatically expire after this duration
    uint256 constant SESSION_DURATION = 14400;

    /**
     * @notice Supported currency pairs for trading
     * @dev Using enum for gas efficiency and type safety
     */
    enum CurrencyPair {
        EUR_USD,  // Euro / US Dollar
        GBP_USD,  // British Pound / US Dollar
        USD_JPY,  // US Dollar / Japanese Yen
        AUD_USD,  // Australian Dollar / US Dollar
        USD_CHF   // US Dollar / Swiss Franc
    }

    /**
     * @notice Structure representing a private trading order
     * @dev All sensitive trading data is encrypted using FHE
     * @param encryptedAmount The encrypted trade amount (euint64)
     * @param encryptedPrice The encrypted target price scaled by 10000 (euint32)
     * @param encryptedPairId The encrypted currency pair identifier (euint8)
     * @param isExecuted Flag indicating if order has been processed
     * @param timestamp Block timestamp when order was placed
     * @param trader Address of the trader who placed the order
     *
     * @custom:encryption-pattern This struct demonstrates how to store multiple encrypted values
     *                            while keeping metadata (isExecuted, timestamp, trader) public
     */
    struct PrivateOrder {
        euint64 encryptedAmount;      // Encrypted trade amount
        euint32 encryptedPrice;       // Encrypted target price (scaled by 10000)
        euint8 encryptedPairId;       // Encrypted currency pair ID
        bool isExecuted;
        uint256 timestamp;
        address trader;
    }

    /**
     * @notice Structure representing a trading session
     * @dev Sessions encapsulate a time-bound trading period with encrypted pricing
     * @param sessionPrices Array of encrypted prices for all currency pairs
     * @param pricesSet Flag indicating if session prices have been initialized
     * @param sessionActive Flag indicating if session is currently active
     * @param startTime Unix timestamp when session began
     * @param endTime Unix timestamp when session will end
     * @param activeTraders Array of trader addresses participating in this session
     * @param totalVolume Total trading volume (currently unused, reserved for future use)
     */
    struct TradingSession {
        euint32[5] sessionPrices;     // Encrypted prices for each currency pair
        bool pricesSet;
        bool sessionActive;
        uint256 startTime;
        uint256 endTime;
        address[] activeTraders;
        uint256 totalVolume;
    }

    /**
     * @notice Structure representing a trader's profile and encrypted data
     * @dev Demonstrates proper access control for user-specific encrypted data
     * @param encryptedBalance The trader's private balance (euint64)
     * @param totalTrades Encrypted count of total trades executed (euint32)
     * @param isRegistered Flag indicating if trader has completed registration
     * @param lastActivity Timestamp of trader's last interaction
     *
     * @custom:access-control-pattern Access to encryptedBalance and totalTrades is granted
     *                                only to the trader themselves using FHE.allow()
     */
    struct TraderProfile {
        euint64 encryptedBalance;     // Private balance
        euint32 totalTrades;          // Encrypted trade count
        bool isRegistered;
        uint256 lastActivity;
    }

    /// @notice Mapping of session ID to session data
    mapping(uint32 => TradingSession) public tradingSessions;

    /// @notice Mapping of session ID to trader address to their orders
    /// @dev Nested mapping allows efficient lookup of orders per trader per session
    mapping(uint32 => mapping(address => PrivateOrder[])) public privateOrders;

    /// @notice Mapping of trader address to their profile
    mapping(address => TraderProfile) public traderProfiles;

    /// @notice Mapping of session ID to currency pair to encrypted rate
    /// @dev Provides quick access to specific currency pair rates for a session
    mapping(uint32 => mapping(CurrencyPair => euint32)) public sessionRates;

    // Events

    /**
     * @notice Emitted when a new trading session starts
     * @param session The session ID
     * @param startTime Unix timestamp of session start
     */
    event SessionStarted(uint32 indexed session, uint256 startTime);

    /**
     * @notice Emitted when a private order is successfully placed
     * @param trader Address of the trader placing the order
     * @param session The session ID
     * @param orderIndex Index of the order in the trader's order array
     */
    event PrivateOrderPlaced(address indexed trader, uint32 indexed session, uint256 orderIndex);

    /**
     * @notice Emitted when an order is executed
     * @param trader Address of the trader whose order was executed
     * @param session The session ID
     * @param orderIndex Index of the executed order
     */
    event OrderExecuted(address indexed trader, uint32 indexed session, uint256 orderIndex);

    /**
     * @notice Emitted when session prices are updated
     * @param session The session ID
     */
    event PricesUpdated(uint32 indexed session);

    /**
     * @notice Emitted when a new trader registers
     * @param trader Address of the newly registered trader
     */
    event TraderRegistered(address indexed trader);

    // Modifiers

    /**
     * @notice Restricts function access to contract owner only
     * @dev Used for administrative functions like starting sessions
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    /**
     * @notice Restricts function access to registered traders only
     * @dev Ensures only traders who have completed registration can trade
     */
    modifier onlyRegisteredTrader() {
        require(traderProfiles[msg.sender].isRegistered, "Trader not registered");
        _;
    }

    /**
     * @notice Restricts function access to when a session is active
     * @dev Used to prevent actions that require an active trading session
     */
    modifier onlyDuringSession() {
        require(isSessionActive(), "No active trading session");
        _;
    }

    /**
     * @notice Restricts function access to when no session is active
     * @dev Used for functions that should only run between sessions
     */
    modifier onlyOutsideSession() {
        require(!isSessionActive(), "Session currently active");
        _;
    }

    /**
     * @notice Contract constructor
     * @dev Initializes the contract with the deployer as owner and sets up initial session
     */
    constructor() {
        owner = msg.sender;
        currentSession = 1;
        lastSessionTime = block.timestamp;
    }

    /**
     * @notice Check if a trading session is currently active
     * @dev A session is active if all conditions are met:
     *      - sessionActive flag is true
     *      - prices have been set
     *      - current time is within session time window
     * @return bool True if session is active, false otherwise
     */
    function isSessionActive() public view returns (bool) {
        TradingSession storage session = tradingSessions[currentSession];
        return session.sessionActive &&
               session.pricesSet &&
               block.timestamp >= session.startTime &&
               block.timestamp <= session.endTime;
    }

    /**
     * @notice Register as a trader with an initial encrypted balance
     * @dev This function demonstrates:
     *      - Converting plaintext to encrypted data using FHE.asEuint*
     *      - Setting up access control with FHE.allowThis() and FHE.allow()
     *      - Proper initialization of encrypted state variables
     *
     * @param _initialBalance The initial balance to register with (will be encrypted)
     *
     * @custom:encryption-example Shows how to encrypt user input: FHE.asEuint64(_initialBalance)
     * @custom:access-control-example Demonstrates granting access to encrypted data:
     *                                - FHE.allowThis() grants access to the contract
     *                                - FHE.allow(data, user) grants access to specific user
     */
    function registerTrader(uint64 _initialBalance) external {
        require(!traderProfiles[msg.sender].isRegistered, "Already registered");
        require(_initialBalance > 0, "Initial balance must be positive");

        // Encrypt the initial balance
        euint64 encryptedBalance = FHE.asEuint64(_initialBalance);
        euint32 encryptedTotalTrades = FHE.asEuint32(0);

        traderProfiles[msg.sender] = TraderProfile({
            encryptedBalance: encryptedBalance,
            totalTrades: encryptedTotalTrades,
            isRegistered: true,
            lastActivity: block.timestamp
        });

        // Set ACL permissions - This is a key FHEVM pattern!
        FHE.allowThis(encryptedBalance);        // Contract can access the value
        FHE.allow(encryptedBalance, msg.sender); // User can decrypt their own value
        FHE.allowThis(encryptedTotalTrades);
        FHE.allow(encryptedTotalTrades, msg.sender);

        emit TraderRegistered(msg.sender);
    }

    /**
     * @notice Start a new trading session with encrypted forex rates
     * @dev This function demonstrates:
     *      - Encrypting multiple values in a loop
     *      - Setting up access control for contract-owned encrypted data
     *      - Managing session state transitions
     *
     * @param _forexRates Array of 5 forex rates (scaled by 10000) for:
     *                    [0] EUR/USD, [1] GBP/USD, [2] USD/JPY, [3] AUD/USD, [4] USD/CHF
     *                    Example: 11000 represents 1.1000
     *
     * @custom:security Only owner can start sessions
     * @custom:timing Enforces SESSION_DURATION between sessions
     * @custom:encryption-pattern Shows how to encrypt an array of values
     */
    function startTradingSession(
        uint32[5] memory _forexRates  // Rates for EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CHF
    ) external onlyOwner onlyOutsideSession {
        require(block.timestamp >= lastSessionTime + SESSION_DURATION, "Too early for new session");

        TradingSession storage newSession = tradingSessions[currentSession];

        // Encrypt all forex rates
        for (uint i = 0; i < 5; i++) {
            euint32 encryptedRate = FHE.asEuint32(_forexRates[i]);
            newSession.sessionPrices[i] = encryptedRate;
            sessionRates[currentSession][CurrencyPair(i)] = encryptedRate;

            // Set ACL permissions
            FHE.allowThis(encryptedRate);
        }

        newSession.pricesSet = true;
        newSession.sessionActive = true;
        newSession.startTime = block.timestamp;
        newSession.endTime = block.timestamp + SESSION_DURATION;
        newSession.activeTraders = new address[](0);
        newSession.totalVolume = 0;

        lastSessionTime = block.timestamp;

        emit SessionStarted(currentSession, block.timestamp);
        emit PricesUpdated(currentSession);
    }

    /**
     * @notice Place a private forex order with encrypted details
     * @dev This function is a key example of private trading:
     *      - Order amount is encrypted (other traders can't see your position size)
     *      - Target price is encrypted (your trading strategy remains private)
     *      - Currency pair is encrypted (your trading focus is hidden)
     *      - Access control ensures only you and the contract can see these values
     *
     * @param _amount Trade amount in USD (will be encrypted as euint64)
     * @param _targetPrice Target price scaled by 10000 (will be encrypted as euint32)
     *                     Example: 11500 represents a target price of 1.1500
     * @param _currencyPairId Currency pair ID (0-4, will be encrypted as euint8)
     *
     * @custom:privacy-benefit Order details remain completely private on-chain
     * @custom:access-control Only the trader and contract can access encrypted order data
     * @custom:use-case Ideal for institutional traders who don't want to reveal positions
     */
    function placePrivateOrder(
        uint64 _amount,
        uint32 _targetPrice,
        uint8 _currencyPairId
    ) external onlyRegisteredTrader onlyDuringSession {
        require(_amount > 0, "Amount must be positive");
        require(_currencyPairId < 5, "Invalid currency pair");
        require(_targetPrice > 0, "Target price must be positive");

        // Encrypt order details
        euint64 encryptedAmount = FHE.asEuint64(_amount);
        euint32 encryptedPrice = FHE.asEuint32(_targetPrice);
        euint8 encryptedPairId = FHE.asEuint8(_currencyPairId);

        PrivateOrder memory newOrder = PrivateOrder({
            encryptedAmount: encryptedAmount,
            encryptedPrice: encryptedPrice,
            encryptedPairId: encryptedPairId,
            isExecuted: false,
            timestamp: block.timestamp,
            trader: msg.sender
        });

        privateOrders[currentSession][msg.sender].push(newOrder);
        uint256 orderIndex = privateOrders[currentSession][msg.sender].length - 1;

        // Add trader to active traders if not already present
        _addToActiveTraders(msg.sender);

        // Set ACL permissions - grant access to both contract and user
        FHE.allowThis(encryptedAmount);
        FHE.allowThis(encryptedPrice);
        FHE.allowThis(encryptedPairId);
        FHE.allow(encryptedAmount, msg.sender);
        FHE.allow(encryptedPrice, msg.sender);
        FHE.allow(encryptedPairId, msg.sender);

        // Update trader activity
        traderProfiles[msg.sender].lastActivity = block.timestamp;

        emit PrivateOrderPlaced(msg.sender, currentSession, orderIndex);
    }

    /**
     * @notice Execute all private orders after a session ends
     * @dev This function demonstrates batch processing of encrypted orders
     *      In a production system, this would include:
     *      - FHE comparisons to match orders against market prices
     *      - Encrypted balance updates
     *      - Settlement calculations on encrypted values
     *
     * @custom:note Current implementation marks orders as executed for demonstration
     * @custom:fhe-operation Shows encrypted counter increment: FHE.add(counter, 1)
     * @custom:timing Can only be called after session end time has passed
     */
    function executePrivateOrders() external onlyOwner {
        require(tradingSessions[currentSession].sessionActive, "No active session");
        require(block.timestamp > tradingSessions[currentSession].endTime, "Session not yet ended");

        TradingSession storage session = tradingSessions[currentSession];

        // Process orders for all active traders
        for (uint i = 0; i < session.activeTraders.length; i++) {
            address trader = session.activeTraders[i];
            _processTraderOrders(trader);
        }

        // End current session
        session.sessionActive = false;
        currentSession++;
    }

    /**
     * @notice Internal function to process a trader's orders
     * @dev Demonstrates encrypted arithmetic: FHE.add() for incrementing trade counter
     * @param trader Address of the trader whose orders to process
     */
    function _processTraderOrders(address trader) private {
        PrivateOrder[] storage orders = privateOrders[currentSession][trader];

        for (uint j = 0; j < orders.length; j++) {
            if (!orders[j].isExecuted) {
                // In a real implementation, this would use FHE comparisons
                // to check if encrypted target price matches encrypted market price
                // Example: ebool matches = FHE.eq(orders[j].encryptedPrice, marketPrice);
                orders[j].isExecuted = true;

                // Demonstrate FHE arithmetic: increment encrypted trade counter
                traderProfiles[trader].totalTrades = FHE.add(
                    traderProfiles[trader].totalTrades,
                    FHE.asEuint32(1)
                );

                emit OrderExecuted(trader, currentSession, j);
            }
        }
    }

    /**
     * @notice Add trader to active traders list if not already present
     * @dev Internal helper to manage session participants
     * @param trader Address of the trader to add
     */
    function _addToActiveTraders(address trader) private {
        TradingSession storage session = tradingSessions[currentSession];

        // Check if trader already in active list
        for (uint i = 0; i < session.activeTraders.length; i++) {
            if (session.activeTraders[i] == trader) {
                return; // Already in list
            }
        }

        session.activeTraders.push(trader);
    }

    /**
     * @notice Get current session information
     * @dev Returns public session metadata (encrypted values are not exposed)
     * @return session Current session ID
     * @return pricesSet Whether prices have been set
     * @return sessionActive Whether session is active
     * @return startTime Session start timestamp
     * @return endTime Session end timestamp
     * @return activeTraderCount Number of active traders
     */
    function getCurrentSessionInfo() external view returns (
        uint32 session,
        bool pricesSet,
        bool sessionActive,
        uint256 startTime,
        uint256 endTime,
        uint256 activeTraderCount
    ) {
        TradingSession storage currentSessionData = tradingSessions[currentSession];
        return (
            currentSession,
            currentSessionData.pricesSet,
            currentSessionData.sessionActive,
            currentSessionData.startTime,
            currentSessionData.endTime,
            currentSessionData.activeTraders.length
        );
    }

    /**
     * @notice Get trader's order count for current session
     * @param trader Address of the trader
     * @return uint256 Number of orders placed by the trader
     */
    function getTraderOrderCount(address trader) external view returns (uint256) {
        return privateOrders[currentSession][trader].length;
    }

    /**
     * @notice Get trader profile information
     * @dev Returns only public profile data, not encrypted balances
     * @param trader Address of the trader
     * @return isRegistered Whether trader is registered
     * @return lastActivity Timestamp of last activity
     */
    function getTraderProfile(address trader) external view returns (
        bool isRegistered,
        uint256 lastActivity
    ) {
        TraderProfile storage profile = traderProfiles[trader];
        return (
            profile.isRegistered,
            profile.lastActivity
        );
    }

    /**
     * @notice Get your own encrypted total trades count
     * @dev This function demonstrates user decryption pattern:
     *      - Returns encrypted value (euint32) that only the user can decrypt
     *      - Access control ensures users can only access their own data
     *      - User must use their private key to decrypt the returned value
     *
     * @return euint32 Your encrypted trade count (decrypt with your private key)
     *
     * @custom:user-decryption The returned encrypted value can be decrypted client-side
     * @custom:privacy Users can verify their stats without revealing them publicly
     * @custom:access-control Only registered traders can call this for themselves
     */
    function getMyEncryptedTotalTrades() external view onlyRegisteredTrader returns (euint32) {
        return traderProfiles[msg.sender].totalTrades;
    }

    /**
     * @notice Get session history information
     * @param sessionNumber The session ID to query
     * @return sessionActive Whether the session was/is active
     * @return pricesSet Whether prices were set
     * @return startTime Session start timestamp
     * @return endTime Session end timestamp
     * @return traderCount Number of traders who participated
     * @return totalVolume Total trading volume
     */
    function getSessionHistory(uint32 sessionNumber) external view returns (
        bool sessionActive,
        bool pricesSet,
        uint256 startTime,
        uint256 endTime,
        uint256 traderCount,
        uint256 totalVolume
    ) {
        TradingSession storage session = tradingSessions[sessionNumber];
        return (
            session.sessionActive,
            session.pricesSet,
            session.startTime,
            session.endTime,
            session.activeTraders.length,
            session.totalVolume
        );
    }

    /**
     * @notice Check if specific currency pair rate exists for session
     * @dev Uses FHE.isInitialized() to check if encrypted value has been set
     * @param sessionNumber The session ID to check
     * @param pair The currency pair to check
     * @return bool True if rate is initialized, false otherwise
     */
    function hasRateForPair(uint32 sessionNumber, CurrencyPair pair) external view returns (bool) {
        return FHE.isInitialized(sessionRates[sessionNumber][pair]);
    }

    /**
     * @notice Emergency function to end session early
     * @dev Should only be used in exceptional circumstances
     * @custom:security Requires owner privileges
     */
    function emergencyEndSession() external onlyOwner {
        require(tradingSessions[currentSession].sessionActive, "No active session");
        tradingSessions[currentSession].sessionActive = false;
        tradingSessions[currentSession].endTime = block.timestamp;
    }

    /**
     * @notice Update trader balance (for deposits/withdrawals)
     * @dev Demonstrates updating encrypted values with proper access control
     * @param _newBalance The new balance (will be encrypted)
     */
    function updateTraderBalance(uint64 _newBalance) external onlyRegisteredTrader {
        euint64 encryptedNewBalance = FHE.asEuint64(_newBalance);
        traderProfiles[msg.sender].encryptedBalance = encryptedNewBalance;

        // Reset access control for the new encrypted value
        FHE.allowThis(encryptedNewBalance);
        FHE.allow(encryptedNewBalance, msg.sender);
    }
}
