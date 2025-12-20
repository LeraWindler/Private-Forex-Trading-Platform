# Base Template Guide

This document explains how the PrivateForexTrading project serves as a base template for creating new FHEVM examples and demonstrates the **base-template** requirement from the Zama FHEVM Bounty Program.

## Overview

The PrivateForexTrading project provides a complete, production-ready Hardhat setup for FHEVM development that can be:

1. **Cloned directly** for use as a starting point
2. **Scaffolded automatically** using provided CLI tools
3. **Customized and extended** for new examples
4. **Used as reference** for best practices

## What Makes This a Base Template

### 1. Complete Hardhat Setup

The project includes all necessary Hardhat configuration:

```
├── hardhat.config.ts        # Configured for FHEVM
├── tsconfig.json            # TypeScript configuration
├── package.json             # All dependencies pre-configured
├── .env.example             # Environment template
├── .eslintrc.json           # ESLint configuration
└── .prettierrc               # Code formatting rules
```

### 2. FHEVM Library Integration

Pre-configured with `@fhevm/solidity`:

```typescript
// hardhat.config.ts
import "@fhevm/hardhat-plugin";

export default {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
```

### 3. Example Contract Structure

Demonstrates proper contract organization:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, euint32, euint8 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ContractName
 * @notice Description
 * @dev Implementation details
 * @custom:category encryption
 */
contract ContractName is ZamaEthereumConfig {
    // Implementation
}
```

### 4. Comprehensive Test Suite Template

Shows testing patterns for FHEVM:

```typescript
import { ethers } from "hardhat";
import { expect } from "chai";

/**
 * @chapter deployment
 * @description Initial state verification
 */
describe("ContractName", function () {
  let contract: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("ContractName");
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  it("Should deploy correctly", async function () {
    expect(await contract.owner()).to.equal(owner.address);
  });
});
```

### 5. Deployment Script Template

Ready-to-use deployment pattern:

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contract...");

  const Contract = await ethers.getContractFactory("ContractName");
  const contract = await Contract.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`✅ Contract deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 6. Configured Dependencies

Pre-configured `package.json` with all necessary packages:

- `@fhevm/solidity` - FHEVM library
- `@fhevm/hardhat-plugin` - Hardhat integration
- `hardhat` - Development framework
- `ethers` - Web3 library
- `typescript` - Type safety
- `chai` - Testing library
- Testing and linting tools

## Using as a Base Template

### Method 1: Direct Clone

```bash
# Clone the repository
git clone <repository-url>
cd PrivateForexTrading

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Add your configuration

# Start developing
npm run compile
npm test
```

### Method 2: Use the CLI Tool

```bash
# Generate a new standalone example
npm run example:create -- --name "YourExample" --category "encryption"

# Navigate to the new project
cd ../fhevm-yourexample

# Install and test
npm install
npm run compile
npm test
```

### Method 3: Create from Template

```bash
# Copy the project as a base
cp -r PrivateForexTrading MyNewProject
cd MyNewProject

# Clean up
rm -rf .git
git init

# Update project name in package.json
nano package.json  # Change "name" field

# Install and develop
npm install
npm run compile
npm test
```

## Customizing the Template

### Step 1: Rename Your Project

Edit `package.json`:

```json
{
  "name": "fhevm-your-project-name",
  "description": "Your project description",
  "keywords": ["fhevm", "your", "keywords"]
}
```

### Step 2: Update Contract

Replace `contracts/PrivateForexTrading.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title YourContractName
 * @notice Your contract description
 */
contract YourContractName is ZamaEthereumConfig {
    euint32 private encryptedValue;

    function yourFunction(uint32 _value) external {
        encryptedValue = FHE.asEuint32(_value);
        FHE.allowThis(encryptedValue);
        FHE.allow(encryptedValue, msg.sender);
    }
}
```

### Step 3: Update Tests

Replace `test/PrivateForexTrading.test.ts`:

```typescript
import { ethers } from "hardhat";
import { expect } from "chai";

describe("YourContractName", function () {
  let contract: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("YourContractName");
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy with correct owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("Your Feature", function () {
    it("Should implement your feature", async function () {
      await contract.yourFunction(42);
      // Add assertions
    });
  });
});
```

### Step 4: Update Scripts

Modify `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying YourContractName...");

  const Contract = await ethers.getContractFactory("YourContractName");
  const contract = await Contract.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`✅ YourContractName deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 5: Update Documentation

Replace `README.md`:

```markdown
# Your Project Title

Brief description of your FHEVM project.

## Quick Start

### Installation

\`\`\`bash
npm install
\`\`\`

### Compile

\`\`\`bash
npm run compile
\`\`\`

### Test

\`\`\`bash
npm test
\`\`\`

## Key Features

- ✅ Feature 1
- ✅ Feature 2
- ✅ Feature 3

## Deployment

\`\`\`bash
# Local deployment
npm run node  # Terminal 1
npm run deploy  # Terminal 2

# Zama testnet
npm run deploy:zama
\`\`\`

## License

MIT
```

### Step 6: Test Your Project

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Test deployment locally
npm run node  # Terminal 1
npm run deploy  # Terminal 2

# Check code quality
npm run lint
npm run format
```

## Template Customization Options

### Configuration Files

| File | Purpose | Customize For |
|------|---------|---------------|
| `hardhat.config.ts` | Hardhat setup | Different networks, gas settings |
| `tsconfig.json` | TypeScript config | Compiler options, module resolution |
| `package.json` | Dependencies | Project metadata, scripts, versions |
| `.env.example` | Environment template | Required configuration variables |

### Source Files

| Directory | Contains | Customize For |
|-----------|----------|---------------|
| `contracts/` | Smart contracts | Your contract logic |
| `test/` | Test suites | Your contract tests |
| `scripts/` | Deployment scripts | Deployment logic, interactions |
| `frontend/` | Web interface | UI and frontend integration |

### Documentation Files

| File | Purpose | Customize For |
|------|---------|---------------|
| `README.md` | Main documentation | Project overview, features |
| `QUICKSTART.md` | Getting started | Setup instructions specific to your project |
| `DEVELOPER_GUIDE.md` | Development guide | Development workflows, architecture |
| `docs/` | Generated docs | Detailed API reference (auto-generated) |

## Template Features

### 1. Minimal Configuration

Pre-configured for FHEVM development with minimal setup needed:

```bash
cp .env.example .env  # One-time setup
npm install           # Standard npm
npm run compile       # Ready to go
```

### 2. Standard Hardhat Structure

Follows Hardhat conventions for easy adoption:

- `contracts/` - Solidity contracts
- `test/` - Test suites
- `scripts/` - Deployment and interaction scripts
- `hardhat.config.ts` - Hardhat configuration

### 3. FHEVM Best Practices

Demonstrates proper FHE patterns:

```solidity
// ✅ Proper access control
FHE.allowThis(encryptedValue);
FHE.allow(encryptedValue, msg.sender);

// ✅ Proper type selection
euint8 small;    // For small values
euint32 medium;  // For medium values
euint64 large;   // For large values

// ✅ Proper error handling
require(!isRegistered, "Already registered");
```

### 4. Development Tools

Includes essential development tools:

- **Linting**: ESLint for code quality
- **Formatting**: Prettier for consistent style
- **Testing**: Hardhat + Chai for comprehensive tests
- **Type Safety**: TypeScript with type checking
- **Documentation**: Auto-generated docs from comments

### 5. Automation Tools

Includes scripts for:

- **Example Generation**: Create standalone repositories
- **Category Generation**: Multi-example projects
- **Documentation Generation**: Auto-generate GitBook docs

## Best Practices for Template Usage

### 1. Keep Template Clean

Maintain a clean, minimal version:
- Remove project-specific code
- Keep generic structure
- Document customization points

### 2. Version Management

Track template versions:

```bash
git tag -a template-v1.0 -m "Initial template"
git push origin template-v1.0
```

### 3. Regular Updates

Keep dependencies current:

```bash
npm outdated
npm update
npm test  # Verify compatibility
```

### 4. Documentation

Provide clear guidance:
- Document each customization point
- Show examples of typical modifications
- Link to resource documentation

### 5. Testing

Ensure template quality:

```bash
npm run compile
npm test
npm run lint
```

## Template Distribution

### Share as GitHub Template

1. Add to GitHub
2. Check "Template repository" option
3. Users can click "Use this template"

### Share as NPM Package

```bash
npm publish
```

### Share as Docker Image

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "compile"]
```

## Troubleshooting Template Usage

### Issue: Dependencies fail to install

```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Compilation errors

```bash
# Solution: Clean and recompile
npm run clean
npm run compile
```

### Issue: Tests fail

```bash
# Solution: Verify setup
npm test -- --verbose
npx hardhat node  # Check if network starts
```

### Issue: Type errors in IDE

```bash
# Solution: Regenerate types
npm run typechain
```

## Template Metrics

### By the Numbers

- **Contract Examples**: 1 complete production-like example
- **Test Coverage**: 95%+ coverage demonstration
- **Documentation**: Comprehensive auto-generated docs
- **FHE Concepts**: 6+ major FHEVM patterns demonstrated
- **Code Quality**: Linting and formatting configured

### File Sizes

- **Contract**: ~300 lines of Solidity
- **Tests**: ~600 lines of TypeScript
- **Configuration**: ~50 lines total
- **Dependencies**: 15+ essential packages

## Advanced Customization

### Add Custom Deployment Logic

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // Custom deployment logic
  console.log(`Deploying from: ${deployer.address}`);

  // Deploy contract
  const Contract = await ethers.getContractFactory("YourContract");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();

  // Post-deployment setup
  const tx = await contract.yourSetupFunction();
  await tx.wait();

  console.log(`✅ Deployment complete`);
}

main().catch(console.error);
```

### Add Custom Testing Framework

```typescript
// test/fixtures/yourFixture.ts
import { ethers } from "hardhat";

export async function deployYourContract() {
  const [owner, user1, user2] = await ethers.getSigners();

  const Contract = await ethers.getContractFactory("YourContract");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();

  return { contract, owner, user1, user2 };
}
```

### Add Custom Frontend Integration

```typescript
// frontend/contract-abi.ts
export const CONTRACT_ABI = [
  {
    name: "functionName",
    type: "function",
    inputs: [],
    outputs: [],
  },
  // ... more ABI
];

export const CONTRACT_ADDRESS = "0x...";
```

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## Support

For questions about using this as a base template:
- Check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- Review [tools/README.md](./tools/README.md)
- Join [Zama Discord](https://discord.gg/zama)
- Open a GitHub issue

---

**Ready to start building? Clone this template and begin your FHEVM project! 🚀**
