# FHEVM Hardhat Template

A minimal Hardhat template for developing FHEVM (Fully Homomorphic Encryption Virtual Machine) smart contracts.

## Features

- ✅ Pre-configured for FHEVM development
- ✅ TypeScript support
- ✅ Example encrypted counter contract
- ✅ Comprehensive test suite
- ✅ Deployment scripts
- ✅ Code quality tools (ESLint, Prettier)

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure .env with your settings
```

### Compile

```bash
npm run compile
```

### Test

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

### Deploy

```bash
# Deploy to local network
npm run node  # Terminal 1
npm run deploy  # Terminal 2

# Deploy to Zama testnet
npm run deploy:zama
```

## Project Structure

```
fhevm-hardhat-template/
├── contracts/          # Solidity contracts
│   └── FHECounter.sol
├── test/              # Test files
│   └── FHECounter.test.ts
├── scripts/           # Deployment scripts
│   └── deploy.ts
├── deploy/            # Hardhat-deploy scripts
│   └── 001_deploy_counter.ts
├── hardhat.config.ts  # Hardhat configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies
```

## Example Contract

The template includes `FHECounter.sol`, demonstrating:

- **Encrypted State Storage**: Using `euint32` for encrypted counter
- **Access Control**: Proper use of `FHE.allow()` and `FHE.allowThis()`
- **Encrypted Arithmetic**: Using `FHE.add()` and `FHE.sub()`
- **User Decryption**: Pattern for users to decrypt their data

## Key Concepts

### Encrypted Data Types

```solidity
euint32 private counter;
```

### Access Control

```solidity
FHE.allowThis(counter);        // Contract can use it
FHE.allow(counter, msg.sender); // User can decrypt it
```

### Encrypted Operations

```solidity
counter = FHE.add(counter, value);  // Encrypted addition
```

### User Decryption

```solidity
function getCounter() external view returns (euint32) {
    return counter;  // User decrypts client-side
}
```

## Development

### Add New Contracts

1. Create contract in `contracts/`
2. Add tests in `test/`
3. Compile: `npm run compile`
4. Test: `npm test`

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [Zama Discord](https://discord.gg/zama)

## License

MIT
