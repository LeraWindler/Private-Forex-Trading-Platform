# Demo Video Script for FHEVM Private Forex Trading

> **Required by Zama FHEVM Bounty Program**
> This script outlines what should be shown in the demonstration video

## Video Overview

**Duration:** 5-8 minutes
**Objective:** Demonstrate all key features and FHEVM concepts
**Audience:** Developers evaluating FHEVM examples

---

## 🎬 Section 1: Introduction (30 seconds)

### On Screen
- Project title: "FHEVM Private Forex Trading Platform"
- Subtitle: "Zama FHEVM Bounty December 2025"

### Narration
> "Welcome! This is a comprehensive FHEVM example demonstrating how to build a privacy-preserving forex trading platform where order amounts, prices, and trading balances remain completely encrypted on-chain."

### Show
- Brief overview slide with key features
- Project structure in VS Code

---

## 🎬 Section 2: Project Setup (1 minute)

### Show Terminal Commands

```bash
# Clone and install
git clone <repo-url>
cd fhevm-private-forex-trading
npm install
```

### Narration
> "The project is a standard Hardhat setup with TypeScript. Installation is straightforward with npm install."

### Show
- package.json (highlight key dependencies)
- Project structure in file explorer
- hardhat.config.ts configuration

### Highlight
- `@fhevm/solidity` dependency
- Proper TypeScript configuration
- Test and deployment scripts

---

## 🎬 Section 3: Smart Contract Deep Dive (2 minutes)

### Show Contract Code

**File:** `contracts/PrivateForexTrading.sol`

#### Part A: Encrypted Data Types (30 seconds)

```solidity
struct PrivateOrder {
    euint64 encryptedAmount;      // Encrypted trade amount
    euint32 encryptedPrice;       // Encrypted target price
    euint8 encryptedPairId;       // Encrypted currency pair
    bool isExecuted;
    uint256 timestamp;
    address trader;
}
```

### Narration
> "Notice how sensitive data uses encrypted types - euint64, euint32, euint8 - while metadata like timestamp and execution status remain public."

#### Part B: Encryption Pattern (30 seconds)

```solidity
function registerTrader(uint64 _initialBalance) external {
    // Convert plaintext to encrypted
    euint64 encryptedBalance = FHE.asEuint64(_initialBalance);

    // Critical: Set access control
    FHE.allowThis(encryptedBalance);        // Contract access
    FHE.allow(encryptedBalance, msg.sender); // User access
}
```

### Narration
> "This shows the encryption pattern: convert plaintext with FHE.asEuint, then explicitly grant access using FHE.allowThis for the contract and FHE.allow for the user."

#### Part C: Encrypted Arithmetic (30 seconds)

```solidity
function _processTraderOrders(address trader) private {
    // Operate on encrypted values
    traderProfiles[trader].totalTrades = FHE.add(
        traderProfiles[trader].totalTrades,
        FHE.asEuint32(1)
    );
}
```

### Narration
> "FHE operations like FHE.add work directly on encrypted values without decryption. The trade counter increments while remaining completely private."

#### Part D: Access Control Pattern (30 seconds)

```solidity
function placePrivateOrder(...) external {
    // Encrypt multiple fields
    euint64 encryptedAmount = FHE.asEuint64(_amount);
    euint32 encryptedPrice = FHE.asEuint32(_targetPrice);

    // Each encrypted value needs access control
    FHE.allowThis(encryptedAmount);
    FHE.allow(encryptedAmount, msg.sender);
    FHE.allowThis(encryptedPrice);
    FHE.allow(encryptedPrice, msg.sender);
}
```

### Narration
> "For multi-field encrypted structures, each encrypted value requires explicit access control. This gives fine-grained permission management."

---

## 🎬 Section 4: Comprehensive Test Suite (1.5 minutes)

### Show Test File

**File:** `test/PrivateForexTrading.test.ts`

### Run Tests in Terminal

```bash
npm test
```

### Show Test Output
- All tests passing (green checkmarks)
- Test coverage report

### Highlight Key Tests

#### Access Control Test
```typescript
it("Should prevent non-owner from starting session", async function () {
  await expect(
    contract.connect(trader1).startTradingSession(forexRates)
  ).to.be.revertedWith("Not authorized");
});
```

### Narration
> "The test suite covers all functionality including access control, encryption patterns, and edge cases. Watch as all 50+ tests pass, demonstrating comprehensive coverage."

#### Encryption Pattern Test
```typescript
it("Should allow registered trader to place private order", async function () {
  const tx = await contract
    .connect(trader1)
    .placePrivateOrder(TRADE_AMOUNT, TARGET_PRICE, currencyPair);

  await expect(tx)
    .to.emit(contract, "PrivateOrderPlaced")
    .withArgs(trader1.address, 1, 0);
});
```

### Narration
> "Notice how tests verify events and state changes without directly reading encrypted values, demonstrating proper privacy preservation."

---

## 🎬 Section 5: Deployment (1 minute)

### Show Deployment Script

**File:** `scripts/deploy.ts`

### Run Deployment

```bash
npm run node  # Terminal 1
npm run deploy  # Terminal 2
```

### Show Output
- Deployment transaction
- Contract address
- Initial state verification
- Gas costs

### Narration
> "Deployment is automated with error handling and verification. The script checks deployer balance, deploys the contract, and verifies the initial state."

### Show Deployment Output
```
✅ Contract deployed successfully!
📍 Contract address: 0x...
   Owner: 0x...
   Current session: 1
   Session active: false
```

---

## 🎬 Section 6: Frontend Interaction (1.5 minutes)

### Launch Frontend

```bash
npm run frontend
```

### Show Browser
- Open http://localhost:3000
- Professional UI with gradient background

### Demonstrate Full Workflow

#### Step 1: Connect Wallet (15 seconds)
- Click "Connect Wallet"
- MetaMask popup appears
- Wallet connected successfully

### Narration
> "The frontend provides a user-friendly interface. Let's connect MetaMask..."

#### Step 2: Register as Trader (15 seconds)
- Enter initial balance: 10000
- Click "Register as Trader"
- Transaction confirmation
- Success message

### Narration
> "Now we register as a trader with an encrypted balance of 10,000 USD. Notice the balance is encrypted on-chain."

#### Step 3: Start Trading Session (Owner) (20 seconds)
- Show forex rates input
- Enter rates for all currency pairs
- Click "Start Trading Session"
- Session status updates to "Active"

### Narration
> "As the owner, we start a trading session with encrypted forex rates for all five currency pairs."

#### Step 4: Place Private Order (20 seconds)
- Select EUR/USD
- Amount: 1000 USD
- Target Price: 11000
- Click "Place Private Order"
- Order confirmation

### Narration
> "Now we place a private order. The amount, target price, and currency pair are all encrypted. Other traders cannot see these details."

#### Step 5: View Session Info (15 seconds)
- Show current session status
- Active traders count
- Time remaining

### Narration
> "The dashboard shows public information like session status and active trader count, while keeping individual order details private."

#### Step 6: Execute Orders (15 seconds)
- Fast forward time (if demo network)
- Click "Execute Orders & End Session"
- Orders processed
- Session ends

### Narration
> "After the session ends, orders are processed in batch. The encrypted trade counter is incremented using FHE.add."

---

## 🎬 Section 7: Documentation & Tools (1 minute)

### Show Documentation Generation

```bash
npm run docs:generate
```

### Show Generated Docs
- Open `docs/` directory
- Show generated markdown files
- GitBook-compatible structure

### Narration
> "Documentation is automatically generated from code comments, creating GitBook-compatible markdown files."

### Show Files
- `index.md` - Main documentation
- `privateforextrading.md` - Contract docs
- `concepts-guide.md` - Educational content
- `testing-guide.md` - Test documentation

### Show Automation Tool

```bash
npm run example:create -- --name "MyExample"
```

### Show Output
- New repository created
- Complete project structure
- Ready to use

### Narration
> "The automation tool generates a complete standalone repository with contracts, tests, scripts, and documentation - ready for deployment and customization."

---

## 🎬 Section 8: Key Concepts Summary (30 seconds)

### Show Slide with Key Points

**What This Example Demonstrates:**

1. ✅ **Encrypted Data Types**: euint64, euint32, euint8
2. ✅ **Access Control**: FHE.allow() and FHE.allowThis()
3. ✅ **Encrypted Arithmetic**: FHE.add() operations
4. ✅ **Privacy Preservation**: Sensitive data stays encrypted
5. ✅ **User Decryption**: Users can decrypt their own data
6. ✅ **Session Management**: Time-based trading windows
7. ✅ **Comprehensive Testing**: 50+ test cases
8. ✅ **Documentation**: Auto-generated from code
9. ✅ **Automation**: Repository generation tool

### Narration
> "This example demonstrates all core FHEVM concepts: encrypted data types, access control patterns, encrypted arithmetic, and privacy-preserving application architecture."

---

## 🎬 Section 9: Bounty Requirements (30 seconds)

### Show Checklist

**Zama FHEVM Bounty Requirements:**

- ✅ Standalone Hardhat-based repository
- ✅ Automated scaffolding CLI tool
- ✅ Comprehensive smart contract with NatSpec
- ✅ GitBook-compatible documentation
- ✅ Full test suite with TSDoc
- ✅ Cloneable base template
- ✅ Multiple FHEVM concepts demonstrated
- ✅ Demo video (this video!)

**Bonus Points:**
- ✅ Creative and practical use case
- ✅ Advanced encryption patterns
- ✅ Clean, maintainable automation
- ✅ Comprehensive documentation
- ✅ Full test coverage with edge cases

### Narration
> "This project fulfills all bounty requirements plus bonus criteria, providing a production-quality example for the FHEVM community."

---

## 🎬 Section 10: Closing (15 seconds)

### Show Final Slide

**FHEVM Private Forex Trading**
*A Comprehensive FHEVM Example*

**Resources:**
- GitHub: [repository-link]
- Documentation: [docs-link]
- Zama: https://www.zama.ai/

**Built for Zama FHEVM Bounty Program December 2025**

### Narration
> "Thank you for watching! All code and documentation are available on GitHub. Check out the resources to learn more about FHEVM and start building privacy-preserving applications."

---

## 📝 Recording Tips

### Technical Setup
- **Resolution:** 1920x1080 minimum
- **Frame Rate:** 30 FPS or higher
- **Audio:** Clear microphone (avoid background noise)
- **Screen Recording:** Use OBS Studio or similar

### Presentation Tips
1. **Pace:** Speak clearly and not too fast
2. **Cursor:** Use zoom/highlight for important code
3. **Editing:** Cut any errors or long pauses
4. **Captions:** Consider adding subtitles
5. **Music:** Optional light background music (not required)

### Code Display
- **Font Size:** Large enough to read (at least 14pt)
- **Theme:** High contrast (dark theme recommended)
- **Highlighting:** Use comments or cursor to highlight key lines
- **Zoom:** Zoom in on specific code sections

### Terminal Commands
- **Clear Terminal:** Before each major command
- **Readable Text:** Ensure terminal text is legible
- **Wait for Completion:** Show full output
- **Success Messages:** Highlight successful operations

### Browser Demo
- **Clean Browser:** Close unnecessary tabs
- **Full Screen:** Use full screen or large window
- **Smooth Operations:** Practice interactions beforehand
- **Network Issues:** Use local network to avoid delays

---

## 🎯 Success Criteria

Your demo video should:

1. ✅ Show complete project setup
2. ✅ Demonstrate all key FHEVM concepts
3. ✅ Display full test suite execution
4. ✅ Show successful deployment
5. ✅ Demonstrate frontend interaction
6. ✅ Highlight documentation generation
7. ✅ Show automation tool usage
8. ✅ Be clear, professional, and informative

---

## 📤 Video Submission

### Export Settings
- **Format:** MP4 (H.264)
- **Resolution:** 1920x1080
- **Bitrate:** 5-10 Mbps
- **Audio:** AAC, 128-192 kbps

### Upload
- Upload to YouTube (public or unlisted)
- Or host on your own platform
- Include link in bounty submission

### Filename Convention
```
FHEVM_PrivateForexTrading_Demo_v1.mp4
```

---

**Good luck with your demo video! 🎥**
