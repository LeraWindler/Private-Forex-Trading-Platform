# Developer Guide

This guide helps developers understand, maintain, and extend the Private Forex Trading FHEVM example project.

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Development Setup](#development-setup)
3. [Adding New Examples](#adding-new-examples)
4. [Updating Dependencies](#updating-dependencies)
5. [Testing Strategy](#testing-strategy)
6. [Documentation Workflow](#documentation-workflow)
7. [Deployment Guide](#deployment-guide)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)

---

## Project Architecture

### Directory Structure

```
PrivateForexTrading/
├── contracts/              # Solidity smart contracts
│   └── PrivateForexTrading.sol
├── test/                   # Test suites
│   └── PrivateForexTrading.test.ts
├── scripts/                # Deployment & interaction scripts
│   ├── deploy.ts
│   ├── interact.ts
│   └── README.md
├── tools/                  # Automation tools
│   ├── create-fhevm-example.ts
│   ├── create-fhevm-category.ts
│   └── generate-docs.ts
├── docs/                   # Generated documentation
│   ├── index.md
│   ├── SUMMARY.md
│   └── ...
├── frontend/               # Web interface
│   └── index.html
├── hardhat.config.ts       # Hardhat configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies & scripts
└── README.md               # Main documentation
```

### Key Components

#### 1. Smart Contracts (`contracts/`)

- **PrivateForexTrading.sol**: Main contract implementing FHE trading logic
- Uses `@fhevm/solidity` library for encrypted operations
- Follows NatSpec documentation standards

#### 2. Tests (`test/`)

- Comprehensive test suite using Hardhat and Chai
- TSDoc comments with `@chapter` tags for doc generation
- Tests encrypted data operations and access control

#### 3. Automation Tools (`tools/`)

- **create-fhevm-example.ts**: Generates standalone FHEVM repositories
- **create-fhevm-category.ts**: Creates category-based multi-example projects
- **generate-docs.ts**: Auto-generates GitBook-compatible documentation

#### 4. Scripts (`scripts/`)

- **deploy.ts**: Contract deployment script
- **interact.ts**: Example contract interactions
- Configured for multiple networks (local, testnet, mainnet)

---

## Development Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Git**: For version control
- **Code Editor**: VS Code recommended with Solidity extension

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd PrivateForexTrading

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables
# Edit .env and add:
#   PRIVATE_KEY=your_private_key
#   ZAMA_RPC_URL=https://devnet.zama.ai
#   SEPOLIA_RPC_URL=your_sepolia_rpc_url
```

### Development Workflow

```bash
# 1. Make changes to contracts
nano contracts/PrivateForexTrading.sol

# 2. Compile contracts
npm run compile

# 3. Run tests
npm test

# 4. Check code quality
npm run lint
npm run format

# 5. Generate documentation
npm run docs:generate

# 6. Test deployment locally
npm run node  # Terminal 1
npm run deploy  # Terminal 2
```

---

## Adding New Examples

### Creating a New FHEVM Example

#### Step 1: Write the Contract

Create a new Solidity contract in `contracts/`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title YourExampleName
 * @notice Brief description of what this example demonstrates
 * @dev Detailed explanation of implementation
 * @custom:category encryption | access-control | arithmetic | advanced
 */
contract YourExampleName is ZamaEthereumConfig {
    // State variables
    euint32 private encryptedValue;

    /**
     * @notice Function description
     * @param _value Parameter description
     * @dev Implementation details
     */
    function yourFunction(uint32 _value) external {
        encryptedValue = FHE.asEuint32(_value);
        FHE.allowThis(encryptedValue);
        FHE.allow(encryptedValue, msg.sender);
    }
}
```

#### Step 2: Write Tests

Create test file in `test/`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

/**
 * @chapter your-category
 * @description Test suite description
 */
describe("YourExampleName", function () {
  let contract: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("YourExampleName");
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  /**
   * @chapter encryption
   * @description Test encrypted value storage
   */
  it("Should encrypt and store value", async function () {
    await contract.yourFunction(42);
    // Add assertions
  });
});
```

#### Step 3: Update Automation Tools

Add your example to `tools/create-fhevm-example.ts`:

```typescript
const EXAMPLES_MAP: Record<string, ExampleInfo> = {
  // ... existing examples
  "your-example": {
    contractPath: "contracts/YourExampleName.sol",
    testPath: "test/YourExampleName.test.ts",
    description: "Your example description",
    category: "encryption",
  },
};
```

#### Step 4: Generate Documentation

```bash
npm run docs:generate
```

#### Step 5: Test the Example

```bash
# Compile
npm run compile

# Run tests
npm run test

# Generate standalone repository
npm run example:create -- --name "YourExampleName" --category "encryption"

# Test standalone repo
cd ../fhevm-yourexamplename
npm install
npm test
```

---

## Updating Dependencies

### Regular Updates

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Test after updates
npm run compile
npm test
```

### FHEVM Library Updates

When `@fhevm/solidity` releases a new version:

#### 1. Update Package Version

```bash
npm install @fhevm/solidity@latest
```

#### 2. Check Breaking Changes

Review the changelog:
- https://github.com/zama-ai/fhevm/releases

#### 3. Update Contract Imports

If import paths changed:

```solidity
// Old
import { FHE } from "@fhevm/solidity/lib/FHE.sol";

// New (if changed)
import { FHE } from "@fhevm/solidity/v2/lib/FHE.sol";
```

#### 4. Test Everything

```bash
npm run clean
npm run compile
npm test
npm run deploy  # Local test deployment
```

#### 5. Update Documentation

```bash
npm run docs:generate
```

#### 6. Update Templates

Ensure automation tools use updated versions:
- `tools/create-fhevm-example.ts`
- `tools/create-fhevm-category.ts`

---

## Testing Strategy

### Test Organization

Tests are organized by concept using `@chapter` tags:

```typescript
describe("Contract Name", function () {
  /**
   * @chapter deployment
   * @description Verify initial contract state
   */
  describe("Deployment", function () {
    // Deployment tests
  });

  /**
   * @chapter encryption
   * @description Test encrypted data operations
   */
  describe("Encryption", function () {
    // Encryption tests
  });

  /**
   * @chapter access-control
   * @description Test FHE.allow patterns
   */
  describe("Access Control", function () {
    // Access control tests
  });
});
```

### Writing Good Tests

#### 1. Test Both Success and Failure Cases

```typescript
it("Should allow registered traders to place orders", async function () {
  await contract.registerTrader(10000);
  await expect(contract.placePrivateOrder(100, 105, 0))
    .to.emit(contract, "PrivateOrderPlaced");
});

it("Should reject unregistered traders", async function () {
  await expect(contract.placePrivateOrder(100, 105, 0))
    .to.be.revertedWith("Not a registered trader");
});
```

#### 2. Test Access Control

```typescript
it("Should enforce owner-only functions", async function () {
  const [owner, user] = await ethers.getSigners();

  await expect(contract.connect(user).startTradingSession([100, 200, 150, 180, 220]))
    .to.be.revertedWith("Ownable: caller is not the owner");
});
```

#### 3. Test Time-Dependent Logic

```typescript
it("Should prevent session execution before end time", async function () {
  await contract.startTradingSession([100, 200, 150, 180, 220]);

  await expect(contract.executeOrders())
    .to.be.revertedWith("Session not ended");

  // Fast forward time
  await time.increase(SESSION_DURATION + 1);

  // Now should succeed
  await expect(contract.executeOrders())
    .to.emit(contract, "SessionEnded");
});
```

#### 4. Test Gas Usage

```bash
REPORT_GAS=true npm test
```

### Coverage

```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/index.html
```

---

## Documentation Workflow

### Auto-Generation

Documentation is generated from code comments:

```bash
npm run docs:generate
```

### Documentation Types

#### 1. NatSpec (Solidity)

```solidity
/**
 * @title Contract Title
 * @notice User-facing description
 * @dev Developer notes
 * @param _param Parameter description
 * @return Description of return value
 * @custom:category encryption
 */
```

#### 2. TSDoc (TypeScript)

```typescript
/**
 * @chapter access-control
 * @description Test description
 */
it("Test name", async function () {
  // Test implementation
});
```

### Manual Documentation

Edit these files as needed:
- `README.md` - Main project documentation
- `COMPETITION_README.md` - Bounty submission details
- `QUICKSTART.md` - Getting started guide
- `docs/*.md` - Additional guides

### Documentation Structure

Generated docs follow GitBook format:

```
docs/
├── index.md                    # Landing page
├── SUMMARY.md                  # Table of contents
├── quick-start.md              # Getting started
├── concepts-guide.md           # FHEVM concepts
├── testing-guide.md            # Testing guide
└── privateforextrading.md      # Contract documentation
```

---

## Deployment Guide

### Local Deployment

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npm run deploy

# Terminal 3: Interact
npx hardhat run scripts/interact.ts --network localhost
```

### Testnet Deployment

#### Zama Devnet

```bash
# 1. Get testnet tokens
# Visit: https://faucet.zama.ai/

# 2. Configure .env
ZAMA_RPC_URL=https://devnet.zama.ai
PRIVATE_KEY=your_private_key

# 3. Deploy
npm run deploy:zama

# 4. Verify deployment
# Note the contract address from output
```

#### Sepolia Testnet

```bash
# 1. Get Sepolia ETH
# Visit: https://sepoliafaucet.com/

# 2. Configure .env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key

# 3. Deploy
npm run deploy:sepolia
```

### Production Deployment

1. **Audit Contract**
   - Run full test suite
   - Check coverage
   - Security review

2. **Deploy to Mainnet**
   ```bash
   npm run deploy:mainnet
   ```

3. **Verify Contract**
   ```bash
   npx hardhat verify --network mainnet CONTRACT_ADDRESS
   ```

4. **Monitor**
   - Set up monitoring alerts
   - Track gas usage
   - Monitor events

---

## Troubleshooting

### Common Issues

#### Issue: "Cannot find module '@fhevm/solidity'"

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Type error in test files"

```bash
# Solution: Regenerate TypeChain types
npm run clean
npm run compile
```

#### Issue: "Transaction reverted"

```bash
# Solution: Check contract state
# - Add console.log for debugging
# - Review revert reasons in tests
# - Verify FHE.allow() calls are present
```

#### Issue: "Out of gas"

```bash
# Solution: Increase gas limit in hardhat.config.ts
gas: 30000000,
gasPrice: 1000000000,
```

### Debugging Tips

#### 1. Use Console Logging

```solidity
import "hardhat/console.sol";

function yourFunction() external {
    console.log("Debug value:", someValue);
}
```

#### 2. Test in Isolation

```bash
npx hardhat test test/YourTest.test.ts --grep "specific test name"
```

#### 3. Check Network Connection

```bash
curl -X POST $ZAMA_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

## Contributing

### Code Style

- **Solidity**: Follow Solidity style guide
- **TypeScript**: Use ESLint and Prettier
- **Comments**: Write comprehensive NatSpec/TSDoc

### Commit Messages

```bash
# Format
<type>: <subject>

# Types
feat: New feature
fix: Bug fix
docs: Documentation
test: Tests
refactor: Code refactoring
chore: Maintenance

# Examples
feat: add encrypted balance query function
fix: resolve access control issue in placePrivateOrder
docs: update deployment guide with Zama devnet steps
test: add edge cases for session management
```

### Pull Request Process

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make changes**
   - Write code
   - Add tests
   - Update docs
4. **Run quality checks**
   ```bash
   npm run lint
   npm run format
   npm test
   ```
5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```
6. **Push to fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open Pull Request**
   - Describe changes
   - Reference issues
   - Add screenshots if applicable

### Code Review Checklist

- [ ] Code follows style guide
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Gas optimization considered
- [ ] Security implications reviewed

---

## Additional Resources

### FHEVM Development

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM GitHub](https://github.com/zama-ai/fhevm)
- [Zama Discord](https://discord.gg/zama)

### Hardhat

- [Hardhat Documentation](https://hardhat.org/docs)
- [Hardhat Plugin List](https://hardhat.org/plugins)

### Solidity

- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

### Testing

- [Chai Assertion Library](https://www.chaijs.com/)
- [Hardhat Network Helpers](https://hardhat.org/hardhat-network-helpers)

---

## Getting Help

### Community Support

- **Discord**: [Zama Discord](https://discord.gg/zama)
- **Forum**: [Zama Community Forum](https://community.zama.ai/)
- **GitHub Issues**: Open an issue for bugs or feature requests

### Documentation

- Check the [README.md](./README.md) first
- Review [QUICKSTART.md](./QUICKSTART.md) for quick setup
- See [COMPETITION_README.md](./COMPETITION_README.md) for bounty details

---

## Maintenance Schedule

### Weekly

- [ ] Run full test suite
- [ ] Check for dependency updates
- [ ] Review open issues

### Monthly

- [ ] Update dependencies
- [ ] Regenerate documentation
- [ ] Review and update examples

### Quarterly

- [ ] Security audit
- [ ] Performance optimization
- [ ] Major version updates

---

**Happy coding! 🚀**

For questions or issues, please open a GitHub issue or join our Discord community.
