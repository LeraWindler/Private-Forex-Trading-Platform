# Quick Start Guide

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd <repository-directory>

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

## Configuration

Edit `.env` file with your settings:

```
SEPOLIA_RPC_URL=your_rpc_url
ZAMA_RPC_URL=https://devnet.zama.ai
PRIVATE_KEY=your_private_key
```

## Compile Contracts

```bash
npm run compile
```

## Run Tests

```bash
npm test
```

## Deploy

```bash
# Local deployment
npm run node  # Terminal 1
npm run deploy  # Terminal 2

# Zama testnet
npm run deploy:zama
```

## Next Steps

- Read the [Concepts Guide](./concepts-guide.md) to understand FHEVM patterns
- Explore the contract documentation
- Run the test suite to see examples in action
- Check out the frontend integration
