# Scripts Documentation

This directory contains deployment and interaction scripts for the Private Forex Trading FHEVM example.

## Available Scripts

### deploy.ts

**Purpose:** Deploys the PrivateForexTrading smart contract to the specified network.

**Usage:**

```bash
# Deploy to local Hardhat network
npm run node  # Terminal 1
npm run deploy  # Terminal 2

# Deploy to Zama testnet
npm run deploy:zama

# Deploy to Sepolia testnet
npm run deploy:sepolia
```

**Features:**
- Automated contract deployment with verification
- Network configuration validation
- Deployment address logging
- Gas estimation
- Error handling and retries

**Output:**
- Contract address
- Deployment transaction hash
- Gas used
- Network confirmation

**Example:**
```bash
Deploying PrivateForexTrading...
✅ Contract deployed to: 0x1234567890abcdef...
📝 Transaction hash: 0xabcdef1234567890...
⛽ Gas used: 2,543,210
🌐 Network: zama
```

### interact.ts

**Purpose:** Provides example interactions with the deployed PrivateForexTrading contract.

**Usage:**

```bash
# Run interaction script
npx hardhat run scripts/interact.ts --network <network-name>

# Example: Interact on Zama testnet
npx hardhat run scripts/interact.ts --network zama
```

**Features:**
- Register trader with encrypted balance
- Start trading session with encrypted rates
- Place private orders with encrypted data
- Execute orders and process trades
- Query encrypted balances
- User decryption examples

**Example Interactions:**

```typescript
// 1. Register as trader
await contract.registerTrader(10000); // Encrypted balance

// 2. Start trading session (owner only)
const forexRates = [100, 200, 150, 180, 220];
await contract.startTradingSession(forexRates);

// 3. Place private order
await contract.placePrivateOrder(
  1000,  // amount (encrypted)
  105,   // target price (encrypted)
  0      // currency pair ID (encrypted)
);

// 4. Execute orders (owner only)
await contract.executeOrders();

// 5. Query encrypted balance
const encryptedBalance = await contract.getMyEncryptedBalance();
// Decrypt client-side with user's private key
```

**Output:**
```
🔐 Registering trader...
✅ Trader registered successfully

📊 Starting trading session...
✅ Session started: Session ID 1

🛒 Placing private order...
✅ Order placed: Order #0

⚙️ Executing orders...
✅ Orders executed: 3 orders processed

💰 Querying encrypted balance...
🔒 Encrypted balance: [encrypted handle]
```

## Script Configuration

### Environment Variables

Both scripts require environment variables defined in `.env`:

```bash
# Required for deployment
PRIVATE_KEY=your_private_key_here

# Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
ZAMA_RPC_URL=https://devnet.zama.ai

# Optional: Etherscan API key for verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Network Configuration

Networks are configured in `hardhat.config.ts`:

- **hardhat**: Local development network
- **sepolia**: Ethereum Sepolia testnet
- **zama**: Zama FHEVM devnet

## Development Workflow

### 1. Local Development

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy contract
npm run deploy

# Terminal 3: Run interactions
npx hardhat run scripts/interact.ts --network localhost
```

### 2. Testnet Deployment

```bash
# 1. Ensure .env is configured
cp .env.example .env
nano .env  # Add your PRIVATE_KEY and RPC URLs

# 2. Deploy to Zama testnet
npm run deploy:zama

# 3. Note the contract address from output

# 4. Interact with deployed contract
npx hardhat run scripts/interact.ts --network zama
```

### 3. Production Deployment

```bash
# 1. Audit the contract
npm run test:coverage
npm run lint

# 2. Deploy to mainnet (when ready)
npm run deploy:mainnet

# 3. Verify contract on explorer
npx hardhat verify --network mainnet <CONTRACT_ADDRESS>
```

## Creating Custom Scripts

### Template for Deployment Script

```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying YourContract...");

  const Contract = await ethers.getContractFactory("YourContract");
  const contract = await Contract.deploy(
    /* constructor args */
  );

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`✅ YourContract deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Template for Interaction Script

```typescript
import { ethers } from "hardhat";

async function main() {
  // Get contract address from deployment
  const CONTRACT_ADDRESS = "0x...";

  // Get contract instance
  const Contract = await ethers.getContractFactory("YourContract");
  const contract = Contract.attach(CONTRACT_ADDRESS);

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log(`Using account: ${signer.address}`);

  // Perform interactions
  const tx = await contract.yourFunction(args);
  await tx.wait();

  console.log("✅ Transaction successful");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Testing Scripts

Before deploying to mainnet, test your scripts:

```bash
# Test deployment script locally
npx hardhat run scripts/deploy.ts --network hardhat

# Test interaction script locally
npx hardhat run scripts/interact.ts --network hardhat

# Test on testnets before mainnet
npx hardhat run scripts/deploy.ts --network sepolia
npx hardhat run scripts/interact.ts --network sepolia
```

## Troubleshooting

### Common Issues

**Issue:** "Cannot connect to network"
```bash
# Solution: Check your RPC URL in .env
echo $ZAMA_RPC_URL
# Verify network is accessible
curl -X POST $ZAMA_RPC_URL -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

**Issue:** "Insufficient funds"
```bash
# Solution: Get testnet tokens
# For Sepolia: https://sepoliafaucet.com/
# For Zama: https://faucet.zama.ai/
```

**Issue:** "Contract already deployed"
```bash
# Solution: Either:
# 1. Use existing contract address
# 2. Deploy to different network
# 3. Clear deployments and redeploy
rm -rf deployments/
npm run deploy
```

**Issue:** "TypeScript compilation errors"
```bash
# Solution: Recompile contracts
npm run clean
npm run compile
```

## Gas Optimization Tips

1. **Batch Operations**: Group multiple calls in single transaction
2. **Use Events**: Emit events instead of storing unnecessary data
3. **Optimize Storage**: Use appropriate data types (euint8 vs euint64)
4. **Test Gas Usage**: Run tests with gas reporting
   ```bash
   REPORT_GAS=true npm test
   ```

## Security Best Practices

1. **Never Commit Private Keys**: Use .env and .gitignore
2. **Verify Contracts**: Always verify on block explorers
3. **Test Thoroughly**: Run full test suite before deployment
4. **Use Multi-Sig**: For production deployments
5. **Audit Access Control**: Verify only authorized addresses can call sensitive functions

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Deployment Best Practices](https://docs.zama.ai/fhevm/guides/deployment)

## Support

For issues or questions:
- Open an issue on GitHub
- Join Zama Discord: https://discord.gg/zama
- Check FHEVM documentation: https://docs.zama.ai/fhevm
