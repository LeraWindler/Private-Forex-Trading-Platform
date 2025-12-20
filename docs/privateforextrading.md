# PrivateForexTrading

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

## Key Concepts

This example demonstrates:

- access-control
- encryption
- user-decryption

## Functions

### isSessionActive

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:

---

### registerTrader

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:

---

### startTradingSession

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Only owner can start sessions
- **timing**: Enforces SESSION_DURATION between sessions

---

### placePrivateOrder

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Only owner can start sessions
- **timing**: Enforces SESSION_DURATION between sessions

---

### executePrivateOrders

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Only owner can start sessions
- **timing**: Can only be called after session end time has passed
- **note**: Current implementation marks orders as executed for demonstration

---

### _processTraderOrders

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)
- `trader`: Address of the trader whose orders to process

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Only owner can start sessions
- **timing**: Can only be called after session end time has passed
- **note**: Current implementation marks orders as executed for demonstration

---

### _addToActiveTraders

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)
- `trader`: Address of the trader whose orders to process
- `trader`: Address of the trader to add

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Only owner can start sessions
- **timing**: Can only be called after session end time has passed
- **note**: Current implementation marks orders as executed for demonstration

---

### getCurrentSessionInfo

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)
- `trader`: Address of the trader whose orders to process
- `trader`: Address of the trader to add

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Only owner can start sessions
- **timing**: Can only be called after session end time has passed
- **note**: Current implementation marks orders as executed for demonstration

---

### getTraderOrderCount

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)
- `trader`: Address of the trader whose orders to process
- `trader`: Address of the trader to add
- `trader`: Address of the trader

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Only owner can start sessions
- **timing**: Can only be called after session end time has passed
- **note**: Current implementation marks orders as executed for demonstration

---

### getTraderProfile

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)
- `trader`: Address of the trader whose orders to process
- `trader`: Address of the trader to add
- `trader`: Address of the trader
- `trader`: Address of the trader

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Only owner can start sessions
- **timing**: Can only be called after session end time has passed
- **note**: Current implementation marks orders as executed for demonstration

---

### getMyEncryptedTotalTrades

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)
- `trader`: Address of the trader whose orders to process
- `trader`: Address of the trader to add
- `trader`: Address of the trader
- `trader`: Address of the trader

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Only owner can start sessions
- **timing**: Can only be called after session end time has passed
- **note**: Current implementation marks orders as executed for demonstration
- **privacy**: Users can verify their stats without revealing them publicly

---

### getSessionHistory

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)
- `trader`: Address of the trader whose orders to process
- `trader`: Address of the trader to add
- `trader`: Address of the trader
- `trader`: Address of the trader
- `sessionNumber`: The session ID to query

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Only owner can start sessions
- **timing**: Can only be called after session end time has passed
- **note**: Current implementation marks orders as executed for demonstration
- **privacy**: Users can verify their stats without revealing them publicly

---

### hasRateForPair

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)
- `trader`: Address of the trader whose orders to process
- `trader`: Address of the trader to add
- `trader`: Address of the trader
- `trader`: Address of the trader
- `sessionNumber`: The session ID to query
- `sessionNumber`: The session ID to check
- `pair`: The currency pair to check

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Only owner can start sessions
- **timing**: Can only be called after session end time has passed
- **note**: Current implementation marks orders as executed for demonstration
- **privacy**: Users can verify their stats without revealing them publicly

---

### emergencyEndSession

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)
- `trader`: Address of the trader whose orders to process
- `trader`: Address of the trader to add
- `trader`: Address of the trader
- `trader`: Address of the trader
- `sessionNumber`: The session ID to query
- `sessionNumber`: The session ID to check
- `pair`: The currency pair to check

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Requires owner privileges
- **timing**: Can only be called after session end time has passed
- **note**: Current implementation marks orders as executed for demonstration
- **privacy**: Users can verify their stats without revealing them publicly

---

### updateTraderBalance

A privacy-preserving forex trading platform using Fully Homomorphic Encryption (FHE)

**Parameters:**

- `encryptedAmount`: The encrypted trade amount (euint64)
- `encryptedPrice`: The encrypted target price scaled by 10000 (euint32)
- `encryptedPairId`: The encrypted currency pair identifier (euint8)
- `isExecuted`: Flag indicating if order has been processed
- `timestamp`: Block timestamp when order was placed
- `trader`: Address of the trader who placed the order
- `sessionPrices`: Array of encrypted prices for all currency pairs
- `pricesSet`: Flag indicating if session prices have been initialized
- `sessionActive`: Flag indicating if session is currently active
- `startTime`: Unix timestamp when session began
- `endTime`: Unix timestamp when session will end
- `activeTraders`: Array of trader addresses participating in this session
- `totalVolume`: Total trading volume (currently unused, reserved for future use)
- `encryptedBalance`: The trader's private balance (euint64)
- `totalTrades`: Encrypted count of total trades executed (euint32)
- `isRegistered`: Flag indicating if trader has completed registration
- `lastActivity`: Timestamp of trader's last interaction
- `session`: The session ID
- `startTime`: Unix timestamp of session start
- `trader`: Address of the trader placing the order
- `session`: The session ID
- `orderIndex`: Index of the order in the trader's order array
- `trader`: Address of the trader whose order was executed
- `session`: The session ID
- `orderIndex`: Index of the executed order
- `session`: The session ID
- `trader`: Address of the newly registered trader
- `_initialBalance`: The initial balance to register with (will be encrypted)
- `_forexRates`: Array of 5 forex rates (scaled by 10000) for:
- `_amount`: Trade amount in USD (will be encrypted as euint64)
- `_targetPrice`: Target price scaled by 10000 (will be encrypted as euint32)
- `_currencyPairId`: Currency pair ID (0-4, will be encrypted as euint8)
- `trader`: Address of the trader whose orders to process
- `trader`: Address of the trader to add
- `trader`: Address of the trader
- `trader`: Address of the trader
- `sessionNumber`: The session ID to query
- `sessionNumber`: The session ID to check
- `pair`: The currency pair to check
- `_newBalance`: The new balance (will be encrypted)

**Returns:** bool True if session is active, false otherwise

**Tags:**

- **category**: user-decryption
- **example**: This contract shows how to build a private trading system where:
- **security**: Requires owner privileges
- **timing**: Can only be called after session end time has passed
- **note**: Current implementation marks orders as executed for demonstration
- **privacy**: Users can verify their stats without revealing them publicly

---

