# 🚀 Quick Start Guide

> Get up and running with FHEVM Private Forex Trading in 5 minutes!

---

## Prerequisites

Make sure you have installed:

- ✅ Node.js >= 18.0.0
- ✅ npm >= 9.0.0
- ✅ Git
- ✅ MetaMask (for frontend)

Check versions:
```bash
node --version  # Should be >= 18
npm --version   # Should be >= 9
```

---

## 📦 Step 1: Installation (1 minute)

```bash
# Clone the repository
git clone <your-repo-url>
cd fhevm-private-forex-trading

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

**Expected Output:**
```
✓ Dependencies installed successfully
✓ Found 0 vulnerabilities
```

---

## ⚙️ Step 2: Configuration (30 seconds)

Edit `.env` file (optional for local testing):

```bash
# For local Hardhat network (default)
# No configuration needed!

# For testnet deployment (optional)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
ZAMA_RPC_URL=https://devnet.zama.ai
PRIVATE_KEY=your_private_key_here
```

---

## 🔨 Step 3: Compile Contracts (30 seconds)

```bash
npm run compile
```

**Expected Output:**
```
Compiled 1 Solidity file successfully
✓ PrivateForexTrading compiled
```

---

## 🧪 Step 4: Run Tests (1 minute)

```bash
npm test
```

**Expected Output:**
```
  PrivateForexTrading
    Deployment
      ✓ Should set the correct owner
      ✓ Should initialize with session 1
      ✓ Should have no active session initially
    Trader Registration
      ✓ Should allow a trader to register
      ✓ Should prevent double registration
      ... (50+ more tests)

  50 passing (4s)
```

---

## 🚀 Step 5: Deploy Contract (1 minute)

### Local Deployment

**Terminal 1 - Start Local Node:**
```bash
npx hardhat node
```

**Terminal 2 - Deploy:**
```bash
npm run deploy
```

**Expected Output:**
```
🚀 Starting PrivateForexTrading deployment...
📝 Deploying with account: 0x...
💰 Account balance: 10000.0 ETH

✅ Contract deployed successfully!
📍 Contract address: 0x5FbDB2315678afecb367f032d93F642f64180aa3

📚 Next Steps:
1. Save the contract address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
2. Update your .env file with CONTRACT_ADDRESS
```

### Save Contract Address

Add to your `.env`:
```
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

## 💻 Step 6: Launch Frontend (30 seconds)

```bash
npm run frontend
```

**Open in browser:** http://localhost:3000

You should see:
- 🎨 Professional gradient UI
- 🔗 Wallet connection button
- 📊 Trading dashboard
- 📝 Order placement form

---

## 🎮 Step 7: Interact with Contract (1 minute)

### Using Frontend

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Approve MetaMask connection
   - See your address displayed

2. **Load Contract**
   - Enter contract address (from deployment)
   - Click "Load Contract"
   - Contract status will show

3. **Register as Trader**
   - Enter initial balance: `10000`
   - Click "Register as Trader"
   - Approve transaction in MetaMask
   - Wait for confirmation

4. **Start Trading Session** (as owner)
   - Enter forex rates (defaults provided)
   - Click "Start Trading Session"
   - Approve transaction
   - Session becomes active

5. **Place Private Order**
   - Select currency pair
   - Enter amount: `1000`
   - Enter target price: `11000`
   - Click "Place Private Order"
   - Order is placed with encrypted details!

### Using Scripts

```bash
# Interact programmatically
export CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
npm run interact
```

**Output shows:**
- ✅ Contract status
- ✅ Trader registration
- ✅ Session creation
- ✅ Order placement
- ✅ Order execution

---

## 📚 Step 8: Generate Documentation (30 seconds)

```bash
npm run docs:generate
```

**Generated files in `docs/`:**
- `index.md` - Documentation home
- `quick-start.md` - Setup guide
- `concepts-guide.md` - FHEVM concepts
- `testing-guide.md` - Test patterns
- `privateforextrading.md` - Contract reference
- `SUMMARY.md` - GitBook TOC

**View documentation:**
```bash
# Install a markdown viewer or use GitHub
cat docs/index.md
```

---

## 🛠️ Step 9: Create New Example (Optional)

```bash
npm run example:create -- --name "MyExample" --category "encryption"
```

**Creates:**
```
../fhevm-myexample/
├── contracts/
├── test/
├── scripts/
├── tools/
├── docs/
└── README.md (customized)
```

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] ✅ Dependencies installed (`npm install`)
- [ ] ✅ Contracts compile (`npm run compile`)
- [ ] ✅ All tests pass (`npm test`)
- [ ] ✅ Contract deploys (`npm run deploy`)
- [ ] ✅ Frontend loads (http://localhost:3000)
- [ ] ✅ Can connect wallet
- [ ] ✅ Can register as trader
- [ ] ✅ Documentation generates (`npm run docs:generate`)

If all checked, you're ready to go! 🎉

---

## 🐛 Troubleshooting

### Tests Failing

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Compilation Errors

```bash
# Clear cache
npx hardhat clean
npm run compile
```

### Deployment Issues

**Problem:** "Insufficient funds"
**Solution:** Make sure deployer account has ETH

**Problem:** "Contract address not set"
**Solution:** Add `CONTRACT_ADDRESS` to `.env`

**Problem:** "Network error"
**Solution:** Check Hardhat node is running (Terminal 1)

### Frontend Issues

**Problem:** "Failed to load ethers.js"
**Solution:** Reload page, library will load from fallback CDN

**Problem:** "Cannot connect wallet"
**Solution:** Install MetaMask extension

**Problem:** "Wrong network"
**Solution:** Switch MetaMask to Localhost 8545

### Port Already in Use

```bash
# Frontend
# Change port in package.json or kill existing process
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows

# Hardhat node
# Change port in hardhat.config.ts or use different terminal
```

---

## 📖 Next Steps

### Learn More

1. **Read the Documentation**
   ```bash
   # View generated docs
   ls docs/
   ```

2. **Study the Contract**
   ```bash
   # View contract with comments
   cat contracts/PrivateForexTrading.sol
   ```

3. **Explore Tests**
   ```bash
   # View test patterns
   cat test/PrivateForexTrading.test.ts
   ```

### Customize

1. **Modify Contract**
   - Edit `contracts/PrivateForexTrading.sol`
   - Add new features
   - Compile: `npm run compile`
   - Test: `npm test`

2. **Add Tests**
   - Edit `test/PrivateForexTrading.test.ts`
   - Add new test cases
   - Run: `npm test`

3. **Customize Frontend**
   - Edit `frontend/index.html`
   - Add new UI elements
   - Test: `npm run frontend`

### Deploy to Testnet

1. **Get Testnet ETH**
   - Sepolia Faucet: https://sepoliafaucet.com/
   - Get test ETH for your address

2. **Configure Network**
   ```bash
   # Edit .env
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-KEY
   PRIVATE_KEY=your_private_key
   ```

3. **Deploy**
   ```bash
   npm run deploy:sepolia
   ```

4. **Verify**
   - View on Etherscan: https://sepolia.etherscan.io/

---

## 🎓 Learning Path

### Beginner

1. ✅ Complete this Quick Start
2. 📖 Read `docs/concepts-guide.md`
3. 🧪 Run tests and understand output
4. 💻 Use frontend to interact

### Intermediate

1. 📝 Study contract code in detail
2. 🧪 Add new test cases
3. 🔧 Modify contract features
4. 🚀 Deploy to testnet

### Advanced

1. 🏗️ Create new FHEVM examples
2. 📚 Contribute to documentation
3. 🔐 Add advanced features
4. 🎯 Optimize gas usage

---

## 📞 Get Help

### Documentation

- **README**: Project overview
- **CONTRIBUTING**: How to contribute
- **docs/**: Complete documentation

### Community

- **GitHub Issues**: Bug reports and questions
- **Zama Discord**: https://discord.gg/zama
- **FHEVM Docs**: https://docs.zama.ai/fhevm

### Resources

- **Hardhat**: https://hardhat.org/docs
- **Ethers.js**: https://docs.ethers.org/
- **Solidity**: https://docs.soliditylang.org/

---

## 🎉 Congratulations!

You've successfully:
- ✅ Installed the project
- ✅ Compiled the contracts
- ✅ Run comprehensive tests
- ✅ Deployed to local network
- ✅ Interacted via frontend
- ✅ Generated documentation

**You're now ready to:**
- Build your own FHEVM applications
- Contribute to this project
- Learn advanced FHE patterns
- Deploy to production networks

---

## 🚀 Quick Command Reference

```bash
# Development
npm install           # Install dependencies
npm run compile       # Compile contracts
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code

# Deployment
npx hardhat node     # Start local node
npm run deploy       # Deploy locally
npm run deploy:zama  # Deploy to Zama

# Interaction
npm run interact     # Interact with contract
npm run frontend     # Launch frontend

# Documentation
npm run docs:generate  # Generate docs

# Tools
npm run example:create  # Create new example
```

---

**Happy Building with FHEVM! 🔐✨**

*Build privacy-preserving applications that matter!*
