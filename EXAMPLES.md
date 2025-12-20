# FHEVM Examples Guide

Complete guide to all FHEVM examples provided in this project, demonstrating various concepts from basic encryption to advanced patterns.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Example Categories](#example-categories)
3. [Basic Examples](#basic-examples)
4. [Advanced Examples](#advanced-examples)
5. [How to Use Examples](#how-to-use-examples)
6. [Generating Standalone Projects](#generating-standalone-projects)
7. [Learning Path](#learning-path)
8. [Common Patterns](#common-patterns)

---

## Overview

This project provides multiple FHEVM examples organized by complexity and concept. Each example demonstrates specific FHEVM features and can be used as a learning resource or starting point for your own projects.

### Available Examples

| Example | Category | Difficulty | Key Concepts |
|---------|----------|------------|--------------|
| FHE Counter | Encryption | Beginner | Basic encryption, arithmetic, access control |
| Encrypt Single Value | Encryption | Beginner | Single value encryption, user decryption |
| Encrypt Multiple Values | Encryption | Beginner | Multi-field encryption, type selection |
| User Decryption | User Decryption | Intermediate | Client-side decryption, privacy patterns |
| Private Forex Trading | Advanced | Advanced | Multi-session, complex state, production patterns |

---

## Example Categories

### 1. Encryption Examples 🔐

Focus on basic encryption patterns and workflows.

**Topics Covered**:
- Converting plaintext to encrypted types
- Storing encrypted values
- Basic access control
- Type selection (euint8, euint32, euint64)

**Examples**:
- FHE Counter
- Encrypt Single Value
- Encrypt Multiple Values

### 2. User Decryption Examples 🔓

Demonstrate how users decrypt their encrypted data.

**Topics Covered**:
- Client-side decryption workflow
- Permission management
- Privacy guarantees
- Shared value patterns

**Examples**:
- User Decryption

### 3. Advanced Examples 🚀

Complex real-world use cases with multiple FHEVM concepts.

**Topics Covered**:
- Multi-session management
- Complex encrypted state
- Production-ready patterns
- Advanced access control

**Examples**:
- Private Forex Trading

---

## Basic Examples

### 1. FHE Counter

**Location**: `fhevm-hardhat-template/contracts/FHECounter.sol`

**Description**: A simple encrypted counter demonstrating fundamental FHEVM operations.

**Key Concepts**:
- ✅ Encrypted state storage
- ✅ Encrypted arithmetic (`FHE.add`, `FHE.sub`)
- ✅ Access control basics
- ✅ User decryption pattern

**Code Highlights**:

```solidity
// Encrypted counter storage
euint32 private counter;

// Encrypted increment
function incrementBy1() external {
    counter = FHE.add(counter, FHE.asEuint32(1));
    FHE.allowThis(counter);
    FHE.allow(counter, msg.sender);
}

// User decryption
function getCounter() external view returns (euint32) {
    return counter;
}
```

**Use Cases**:
- Vote counters with private tallies
- Private usage metrics
- Confidential statistics

**Generate Standalone**:
```bash
# Use the base template directly
cd fhevm-hardhat-template
npm install
npm test
```

---

### 2. Encrypt Single Value

**Location**: `contracts/EncryptSingleValue.sol`

**Description**: Demonstrates encrypting and storing a single value with proper access control.

**Key Concepts**:
- ✅ Basic encryption workflow
- ✅ Mapping storage
- ✅ Critical access control patterns
- ✅ Common pitfalls

**Code Highlights**:

```solidity
mapping(address => euint32) private userValues;

function storeValue(inEuint32 calldata encryptedValue) external {
    euint32 value = FHE.asEuint32(encryptedValue);
    userValues[msg.sender] = value;

    // CRITICAL: Both permissions required
    FHE.allowThis(value);
    FHE.allow(value, msg.sender);
}
```

**Common Pitfalls Avoided**:
- ❌ Forgetting `FHE.allowThis()` - contract can't use value
- ❌ Forgetting `FHE.allow()` - user can't decrypt
- ❌ Using plaintext instead of encrypted input

**Use Cases**:
- Private user settings
- Confidential preferences
- Secret storage

**Generate Standalone**:
```bash
npm run example:create -- --name "EncryptSingleValue" --category "encryption"
```

---

### 3. Encrypt Multiple Values

**Location**: `contracts/EncryptMultipleValues.sol`

**Description**: Shows how to manage multiple encrypted fields with different types.

**Key Concepts**:
- ✅ Multiple encrypted types
- ✅ Type selection guide
- ✅ Struct usage
- ✅ Individual field access control

**Code Highlights**:

```solidity
struct UserProfile {
    euint64 balance;      // Large values
    euint32 score;        // Medium values
    euint8 level;         // Small values (0-255)
    bool isActive;        // Plaintext (not all data needs encryption)
}

function updateProfile(
    inEuint64 calldata encryptedBalance,
    inEuint32 calldata encryptedScore,
    inEuint8 calldata encryptedLevel
) external {
    // Convert all inputs
    euint64 balance = FHE.asEuint64(encryptedBalance);
    euint32 score = FHE.asEuint32(encryptedScore);
    euint8 level = FHE.asEuint8(encryptedLevel);

    // Set access control for EACH field
    FHE.allowThis(balance);
    FHE.allow(balance, msg.sender);

    FHE.allowThis(score);
    FHE.allow(score, msg.sender);

    FHE.allowThis(level);
    FHE.allow(level, msg.sender);
}
```

**Type Selection Guide**:
- `euint8`: 0-255 (flags, levels, categories)
- `euint32`: 0-4,294,967,295 (scores, counts, prices)
- `euint64`: 0-2^64-1 (balances, large amounts)

**Use Cases**:
- User profiles with private data
- Multi-field credentials
- Complex private state

**Generate Standalone**:
```bash
npm run example:create -- --name "EncryptMultipleValues" --category "encryption"
```

---

### 4. User Decryption

**Location**: `contracts/UserDecryption.sol`

**Description**: Demonstrates comprehensive user decryption patterns.

**Key Concepts**:
- ✅ Client-side decryption workflow
- ✅ Privacy guarantees
- ✅ Shared value patterns
- ✅ Permission management

**Code Highlights**:

```solidity
// Private user secret
mapping(address => euint32) private userSecrets;

// Store secret (only user can decrypt)
function storeSecret(inEuint32 calldata encryptedSecret) external {
    euint32 secret = FHE.asEuint32(encryptedSecret);
    userSecrets[msg.sender] = secret;

    FHE.allowThis(secret);
    FHE.allow(secret, msg.sender);  // Only this user!
}

// Get for decryption
function getMySecret() external view returns (euint32) {
    return userSecrets[msg.sender];
}

// Grant access to shared value
function grantSharedAccess(address user) external {
    require(msg.sender == owner, "Only owner");
    FHE.allow(sharedValue, user);
}
```

**Client-Side Decryption**:

```javascript
// 1. Get encrypted value from contract
const encryptedSecret = await contract.getMySecret();

// 2. Generate keypair
const { publicKey, privateKey } = instance.generateKeypair();

// 3. Create EIP-712 signature
const eip712 = instance.createEIP712(publicKey, contractAddress);
const signature = await signer._signTypedData(...eip712);

// 4. Decrypt
const plaintext = await instance.decrypt(contractAddress, encryptedSecret);
```

**Privacy Guarantees**:
- Value encrypted on-chain
- Only users with permission can decrypt
- Even contract owner cannot see plaintext
- Decryption happens client-side

**Use Cases**:
- Private messaging
- Secret sharing
- Confidential data queries

**Generate Standalone**:
```bash
npm run example:create -- --name "UserDecryption" --category "user-decryption"
```

---

## Advanced Examples

### 5. Private Forex Trading

**Location**: `contracts/PrivateForexTrading.sol`

**Description**: Production-grade example of a private forex trading platform with encrypted orders and balances.

**Key Concepts**:
- ✅ Multi-session management
- ✅ Complex encrypted state
- ✅ Multi-field order encryption
- ✅ Encrypted arithmetic in production
- ✅ Advanced access control patterns

**Code Highlights**:

```solidity
struct PrivateOrder {
    euint64 encryptedAmount;
    euint32 encryptedPrice;
    euint8 encryptedPairId;
    bool isExecuted;
    uint256 timestamp;
    address trader;
}

function placePrivateOrder(
    uint64 _amount,
    uint32 _targetPrice,
    uint8 _currencyPairId
) external onlyRegisteredTrader onlyDuringSession {
    // Encrypt all order components
    euint64 encryptedAmount = FHE.asEuint64(_amount);
    euint32 encryptedPrice = FHE.asEuint32(_targetPrice);
    euint8 encryptedPairId = FHE.asEuint8(_currencyPairId);

    // Set access control for each field
    FHE.allowThis(encryptedAmount);
    FHE.allowThis(encryptedPrice);
    FHE.allowThis(encryptedPairId);
    FHE.allow(encryptedAmount, msg.sender);
    FHE.allow(encryptedPrice, msg.sender);
    FHE.allow(encryptedPairId, msg.sender);
}

// Encrypted arithmetic
function _processTraderOrders(address trader) private {
    traderProfiles[trader].totalTrades = FHE.add(
        traderProfiles[trader].totalTrades,
        FHE.asEuint32(1)
    );
}
```

**Architecture**:
1. **Trader Registration**: Encrypted initial balance
2. **Session Management**: Time-bound trading sessions
3. **Private Orders**: All order details encrypted
4. **Order Execution**: Batch processing with encrypted counters
5. **Balance Queries**: User decryption pattern

**Use Cases**:
- Private trading platforms
- Confidential auctions
- Sealed-bid systems
- Private financial applications

**Generate Standalone**:
```bash
npm run example:create -- --name "PrivateForexTrading" --category "advanced"
```

**Full Documentation**: See [COMPETITION_README.md](./COMPETITION_README.md) for detailed walkthrough.

---

## How to Use Examples

### Method 1: Use In-Place

Work with examples directly in this repository:

```bash
# 1. Compile all contracts
npm run compile

# 2. Run tests
npm test

# 3. Test specific example
npx hardhat test test/EncryptSingleValue.test.ts
```

### Method 2: Generate Standalone

Create independent repositories:

```bash
# Generate standalone project
npm run example:create -- --name "ExampleName" --category "encryption"

# Navigate and use
cd ../fhevm-examplename
npm install
npm test
```

### Method 3: Use Base Template

Start from the base template:

```bash
# Use template directly
cd fhevm-hardhat-template
npm install
npm run compile
npm test

# Customize for your needs
```

---

## Generating Standalone Projects

### Generate Single Example

```bash
npm run example:create -- --name "ExampleName" --category "category"
```

**Available Categories**:
- `encryption` - Basic encryption examples
- `access-control` - Access control patterns
- `user-decryption` - User decryption examples
- `arithmetic` - FHE arithmetic operations
- `advanced` - Complex use cases

### Generate Category Project

Create project with multiple related examples:

```bash
npm run category:create -- trading ./output/fhevm-trading-examples
```

**What Gets Generated**:
- Complete Hardhat setup
- All contracts from category
- All tests with documentation
- Deployment scripts
- README and guides
- Git repository

---

## Learning Path

Recommended progression for learning FHEVM:

### Level 1: Basics (Start Here)
1. **FHE Counter**
   - Understand encrypted state
   - Learn basic arithmetic
   - Master access control

2. **Encrypt Single Value**
   - Basic encryption workflow
   - Access control patterns
   - Common pitfalls

### Level 2: Intermediate
3. **Encrypt Multiple Values**
   - Type selection
   - Struct usage
   - Multi-field management

4. **User Decryption**
   - Client-side decryption
   - Privacy patterns
   - Permission management

### Level 3: Advanced
5. **Private Forex Trading**
   - Production patterns
   - Complex state management
   - Real-world architecture

---

## Common Patterns

### Pattern 1: Basic Encryption

```solidity
function storeValue(inEuint32 calldata encryptedInput) external {
    euint32 value = FHE.asEuint32(encryptedInput);
    storage[msg.sender] = value;

    FHE.allowThis(value);
    FHE.allow(value, msg.sender);
}
```

### Pattern 2: Encrypted Arithmetic

```solidity
function increment() external {
    counter = FHE.add(counter, FHE.asEuint32(1));
    FHE.allowThis(counter);
    FHE.allow(counter, msg.sender);
}
```

### Pattern 3: User Decryption

```solidity
function getValue() external view returns (euint32) {
    return userValues[msg.sender];
}
```

### Pattern 4: Shared Access

```solidity
function grantAccess(address user) external onlyOwner {
    FHE.allow(sharedValue, user);
}
```

### Pattern 5: Multi-Field Encryption

```solidity
struct Data {
    euint64 field1;
    euint32 field2;
    euint8 field3;
}

// Set access for each field
FHE.allowThis(data.field1);
FHE.allow(data.field1, user);
FHE.allowThis(data.field2);
FHE.allow(data.field2, user);
FHE.allowThis(data.field3);
FHE.allow(data.field3, user);
```

---

## Testing Examples

All examples include comprehensive test suites:

```bash
# Run all tests
npm test

# Run specific example test
npx hardhat test test/ExampleName.test.ts

# Run with coverage
npm run test:coverage

# Run with gas reporting
REPORT_GAS=true npm test
```

---

## Documentation

Each example includes:

- **NatSpec Comments**: In Solidity contracts
- **TSDoc Comments**: In TypeScript tests
- **Generated Docs**: Auto-generated from code
- **README**: Example-specific guide

Generate documentation:
```bash
npm run docs:generate
```

---

## Resources

- **FHEVM Docs**: https://docs.zama.ai/fhevm
- **Base Template**: [BASE_TEMPLATE_GUIDE.md](./BASE_TEMPLATE_GUIDE.md)
- **Developer Guide**: [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- **Tools Docs**: [tools/README.md](./tools/README.md)
- **Zama Discord**: https://discord.gg/zama

---

## Support

Need help with examples?
- Check the [README.md](./README.md)
- Review [QUICKSTART.md](./QUICKSTART.md)
- See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- Join [Zama Discord](https://discord.gg/zama)
- Open a GitHub issue

---

**Start learning with the examples today!** 🎓🚀
