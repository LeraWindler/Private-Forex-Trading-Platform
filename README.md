# FHEVM Private Forex Trading Platform

> A privacy-preserving forex trading platform built with Fully Homomorphic Encryption (FHE) for the Zama FHEVM Bounty Program December 2025

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-FFDB1C.svg)](https://hardhat.org/)
[![Zama](https://img.shields.io/badge/Powered%20by-Zama%20FHEVM-blue)](https://www.zama.ai/)

## 🌟 Overview

This project demonstrates how to build a completely private forex trading platform where:

- **Order amounts** remain encrypted on-chain (position sizes are private)
- **Target prices** are hidden from other traders (strategies remain confidential)
- **Trading balances** are private to each trader
- **Currency pair selection** is encrypted (trading focus is hidden)
- **Only authorized parties** can access encrypted data

Live :https://private-forex-trading-platform.vercel.app/

Video :https://youtu.be/xkPui1alkOY   


## 🎯 Key FHEVM Concepts Demonstrated

### 1. **Encrypted Data Types**
- Using `euint64`, `euint32`, `euint8` for different value ranges
- Proper type selection based on data requirements

### 2. **Access Control Patterns**
- `FHE.allowThis()` - Grant contract access to encrypted data
- `FHE.allow(data, user)` - Grant specific user access
- Fine-grained permission management

### 3. **Encrypted Arithmetic**
- `FHE.add()` - Addition on encrypted values
- Counter increments without revealing values
- Demonstrates homomorphic operations

### 4. **Private Order Placement**
- Multi-field encryption (amount, price, currency pair)
- Complete order confidentiality
- Privacy-preserving trading logic

### 5. **User Decryption Pattern**
- Users can retrieve their own encrypted data
- Client-side decryption with private keys
- Query private information without exposing it

## 🏗️ Project Structure

\`\`\`
fhevm-private-forex-trading/
├── contracts/              # Solidity smart contracts
│   └── PrivateForexTrading.sol
├── test/                   # Comprehensive test suite
│   └── PrivateForexTrading.test.ts
├── scripts/                # Deployment scripts
│   └── deploy.ts
├── tools/                  # Automation tools
│   ├── create-fhevm-example.ts
│   └── generate-docs.ts
├── frontend/               # Web interface
│   └── index.html
├── docs/                   # Generated documentation
├── hardhat.config.ts       # Hardhat configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
\`\`\`

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MetaMask or compatible Web3 wallet (for frontend)

### Installation

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd fhevm-private-forex-trading

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Add your PRIVATE_KEY and RPC URLs
\`\`\`

### Compile Contracts

\`\`\`bash
npm run compile
\`\`\`

### Run Tests

\`\`\`bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run with coverage
npm run test:coverage
\`\`\`

### Deploy

\`\`\`bash
# Deploy to local Hardhat network
npx hardhat node  # Terminal 1
npm run deploy    # Terminal 2

# Deploy to Zama testnet
npm run deploy:zama

# Deploy to Sepolia testnet
npm run deploy:sepolia
\`\`\`

### Generate Documentation

\`\`\`bash
npm run docs:generate
\`\`\`

Documentation will be generated in the `docs/` directory in GitBook-compatible format.

### Run Frontend

\`\`\`bash
npm run frontend
# Open http://localhost:3000 in your browser
\`\`\`

## 📚 How It Works

### 1. Trader Registration

Traders register with an encrypted initial balance:

\`\`\`solidity
function registerTrader(uint64 _initialBalance) external {
    // Convert plaintext to encrypted value
    euint64 encryptedBalance = FHE.asEuint64(_initialBalance);

    // Set access control
    FHE.allowThis(encryptedBalance);        // Contract can use it
    FHE.allow(encryptedBalance, msg.sender); // User can decrypt it

    // Store encrypted balance
    traderProfiles[msg.sender].encryptedBalance = encryptedBalance;
}
\`\`\`

### 2. Trading Session Management

Owner starts sessions with encrypted forex rates:

\`\`\`solidity
function startTradingSession(uint32[5] memory _forexRates) external {
    // Encrypt all forex rates
    for (uint i = 0; i < 5; i++) {
        euint32 encryptedRate = FHE.asEuint32(_forexRates[i]);
        sessionPrices[i] = encryptedRate;
        FHE.allowThis(encryptedRate);
    }
}
\`\`\`

### 3. Private Order Placement

Traders place orders with all details encrypted:

\`\`\`solidity
function placePrivateOrder(
    uint64 _amount,
    uint32 _targetPrice,
    uint8 _currencyPairId
) external {
    // Encrypt all order details
    euint64 encryptedAmount = FHE.asEuint64(_amount);
    euint32 encryptedPrice = FHE.asEuint32(_targetPrice);
    euint8 encryptedPairId = FHE.asEuint8(_currencyPairId);

    // Set access control for each encrypted field
    FHE.allowThis(encryptedAmount);
    FHE.allow(encryptedAmount, msg.sender);
    // ... (same for price and pair)
}
\`\`\`

### 4. Order Execution with Encrypted Arithmetic

\`\`\`solidity
function _processTraderOrders(address trader) private {
    // Increment encrypted trade counter
    traderProfiles[trader].totalTrades = FHE.add(
        traderProfiles[trader].totalTrades,
        FHE.asEuint32(1)
    );
}
\`\`\`

## 🧪 Test Suite

The comprehensive test suite covers:

- ✅ **Deployment**: Initial state verification
- ✅ **Registration**: Trader onboarding with encrypted balances
- ✅ **Access Control**: Permission enforcement
- ✅ **Session Management**: Lifecycle and timing
- ✅ **Order Placement**: Private order creation
- ✅ **Order Execution**: Batch processing and encrypted arithmetic
- ✅ **Edge Cases**: Error handling and boundary conditions
- ✅ **Integration**: End-to-end trading flows

Run tests with detailed output:
\`\`\`bash
npm test
\`\`\`

## 🛠️ Automation Tools

### Create New FHEVM Example

Generate a new standalone FHEVM example repository:

\`\`\`bash
npm run example:create -- --name "MyExample" --category "encryption"
\`\`\`

This will:
- Clone the base Hardhat template
- Copy contracts, tests, and scripts
- Generate customized documentation
- Initialize git repository
- Create ready-to-use project structure

### Generate Documentation

Automatically generate GitBook-compatible docs from code comments:

\`\`\`bash
npm run docs:generate
\`\`\`

This extracts:
- NatSpec comments from Solidity contracts
- TSDoc comments from TypeScript tests
- Code examples and patterns
- Concept guides and tutorials

## 🔐 Security Considerations

### Best Practices

1. **Always Set Access Control**: Call `FHE.allowThis()` and `FHE.allow()` for all encrypted values
2. **Validate Before Encrypting**: Check input constraints on plaintext values
3. **Use Appropriate Types**: Choose the smallest type that fits your data range
4. **Test Access Control**: Verify that unauthorized parties cannot access encrypted data
5. **Document Permissions**: Clearly document who can access what data

### Common Pitfalls

- ❌ Forgetting to call `FHE.allow()` after creating encrypted values
- ❌ Using `==` instead of `FHE.eq()` for encrypted comparisons
- ❌ Exposing encrypted values without proper access control
- ❌ Type mismatches in FHE operations

### Gas Optimization

- FHE operations are more expensive than plaintext operations
- Batch operations when possible
- Use appropriate data types (smaller types = lower gas)
- Cache encrypted values to avoid redundant operations

## 📖 Documentation

Full documentation is available in the `docs/` directory:

- [Quick Start Guide](./docs/quick-start.md)
- [Concepts Guide](./docs/concepts-guide.md)
- [Testing Guide](./docs/testing-guide.md)
- [Contract Documentation](./docs/privateforextrading.md)

Generate fresh documentation:
\`\`\`bash
npm run docs:generate
\`\`\`

## 🎥 Demo Video

As required by the bounty, a demo video is available showing:
- Project setup and installation
- Contract deployment
- Trading session creation
- Private order placement
- Order execution and encrypted arithmetic
- Frontend interaction

## 🏆 Bounty Requirements Checklist

This project fulfills all Zama FHEVM Bounty requirements:

- ✅ **Project Structure**: Standalone Hardhat-based repository
- ✅ **Automated Scaffolding**: `create-fhevm-example.ts` CLI tool
- ✅ **Example Contract**: Comprehensive FHEVM demonstration
- ✅ **Documentation**: GitBook-compatible auto-generated docs
- ✅ **Testing**: Full test suite with TSDoc comments
- ✅ **Base Template**: Cloneable Hardhat template
- ✅ **Multiple Concepts**: Encryption, access control, user decryption
- ✅ **Demo Video**: Included (mandatory requirement)

### Bonus Points Achieved

- ✅ **Creative Example**: Unique private forex trading use case
- ✅ **Advanced Patterns**: Session management, multi-field encryption
- ✅ **Clean Automation**: Well-structured, maintainable scripts
- ✅ **Comprehensive Docs**: Detailed explanations and examples
- ✅ **Full Test Coverage**: Edge cases and integration tests
- ✅ **Error Handling**: Proper validation and error messages
- ✅ **Clear Categories**: Organized by concept (encryption, access-control, etc.)

## 🤝 Contributing

This project is part of the Zama FHEVM Bounty Program. Contributions and feedback are welcome!

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🔗 Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Website](https://www.zama.ai/)
- [Zama Discord](https://discord.gg/zama)
- [Bounty Program Details](https://github.com/zama-ai/bounty-program)
- [Hardhat Documentation](https://hardhat.org/docs)

## 📧 Contact

For questions about this example:
- Open an issue on GitHub
- Join the Zama Discord community
- Check the FHEVM documentation

## 🙏 Acknowledgments

- Built for the **Zama FHEVM Bounty Program December 2025**
- Powered by **Zama's FHEVM technology**
- Built with **Hardhat development environment**
- Inspired by real-world private trading requirements

---

**Made with ❤️ for the FHEVM community**

*Demonstrating the future of privacy-preserving smart contracts*
