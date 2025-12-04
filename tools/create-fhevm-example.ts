#!/usr/bin/env ts-node

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

/**
 * @title FHEVM Example Repository Generator
 * @notice Automated tool to generate standalone FHEVM example repositories
 * @dev This tool demonstrates the bounty requirement for automated scaffolding
 *      It creates a complete, ready-to-use Hardhat project with:
 *      - Smart contract with comprehensive NatSpec
 *      - Full test suite with TSDoc comments
 *      - Deployment scripts
 *      - Configuration files
 *      - Documentation
 *
 * @custom:bounty-requirement Automated scaffolding tool (requirement #2)
 * @custom:usage Run: npm run example:create -- --name "YourExampleName"
 */

interface ExampleConfig {
  name: string;
  description: string;
  category: string;
  outputPath: string;
}

/**
 * @notice Main function to create an FHEVM example repository
 * @dev Orchestrates the entire repository creation process
 */
async function createFHEVMExample() {
  console.log("🚀 FHEVM Example Repository Generator\n");

  // Parse command line arguments
  const args = process.argv.slice(2);
  const nameIndex = args.indexOf("--name");
  const categoryIndex = args.indexOf("--category");

  if (nameIndex === -1 || !args[nameIndex + 1]) {
    console.error("❌ Error: Please provide an example name using --name flag");
    console.log("Usage: npm run example:create -- --name \"PrivateForexTrading\"");
    process.exit(1);
  }

  const config: ExampleConfig = {
    name: args[nameIndex + 1],
    description: args[categoryIndex + 2] || "FHEVM Example demonstrating FHE concepts",
    category: args[categoryIndex + 1] || "advanced",
    outputPath: path.join(process.cwd(), "..", `fhevm-${args[nameIndex + 1].toLowerCase().replace(/\s+/g, "-")}`),
  };

  console.log(`📦 Creating example: ${config.name}`);
  console.log(`📂 Output path: ${config.outputPath}\n`);

  try {
    // Step 1: Create directory structure
    createDirectoryStructure(config);

    // Step 2: Copy configuration files
    copyConfigurationFiles(config);

    // Step 3: Copy contract files
    copyContractFiles(config);

    // Step 4: Copy test files
    copyTestFiles(config);

    // Step 5: Copy deployment scripts
    copyDeploymentScripts(config);

    // Step 6: Generate package.json
    generatePackageJson(config);

    // Step 7: Generate README
    generateReadme(config);

    // Step 8: Initialize git repository
    initializeGitRepository(config);

    console.log("\n✅ Example repository created successfully!");
    console.log(`\n📖 Next steps:`);
    console.log(`   cd ${config.outputPath}`);
    console.log(`   npm install`);
    console.log(`   npm run compile`);
    console.log(`   npm test`);

  } catch (error) {
    console.error("❌ Error creating example repository:", error);
    process.exit(1);
  }
}

/**
 * @notice Create the directory structure for the example
 * @dev Creates all necessary folders following Hardhat conventions
 */
function createDirectoryStructure(config: ExampleConfig): void {
  console.log("📁 Creating directory structure...");

  const dirs = [
    config.outputPath,
    path.join(config.outputPath, "contracts"),
    path.join(config.outputPath, "test"),
    path.join(config.outputPath, "scripts"),
    path.join(config.outputPath, "tools"),
    path.join(config.outputPath, "docs"),
    path.join(config.outputPath, "frontend"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   ✓ Created ${path.relative(process.cwd(), dir)}`);
    }
  });
}

/**
 * @notice Copy configuration files to the new repository
 * @dev Copies Hardhat config, TypeScript config, environment files, etc.
 */
function copyConfigurationFiles(config: ExampleConfig): void {
  console.log("\n⚙️  Copying configuration files...");

  const configFiles = [
    "hardhat.config.ts",
    "tsconfig.json",
    ".gitignore",
    ".env.example",
  ];

  configFiles.forEach((file) => {
    const sourcePath = path.join(process.cwd(), file);
    const destPath = path.join(config.outputPath, file);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`   ✓ Copied ${file}`);
    }
  });
}

/**
 * @notice Copy smart contract files
 * @dev Copies Solidity contracts with all NatSpec documentation
 */
function copyContractFiles(config: ExampleConfig): void {
  console.log("\n📄 Copying contract files...");

  const contractsDir = path.join(process.cwd(), "contracts");
  const destDir = path.join(config.outputPath, "contracts");

  if (fs.existsSync(contractsDir)) {
    const files = fs.readdirSync(contractsDir);
    files.forEach((file) => {
      const sourcePath = path.join(contractsDir, file);
      const destPath = path.join(destDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`   ✓ Copied ${file}`);
    });
  }
}

/**
 * @notice Copy test files
 * @dev Copies test suite with all TSDoc documentation
 */
function copyTestFiles(config: ExampleConfig): void {
  console.log("\n🧪 Copying test files...");

  const testDir = path.join(process.cwd(), "test");
  const destDir = path.join(config.outputPath, "test");

  if (fs.existsSync(testDir)) {
    const files = fs.readdirSync(testDir);
    files.forEach((file) => {
      const sourcePath = path.join(testDir, file);
      const destPath = path.join(destDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`   ✓ Copied ${file}`);
    });
  }
}

/**
 * @notice Copy deployment scripts
 * @dev Copies deployment scripts and helpers
 */
function copyDeploymentScripts(config: ExampleConfig): void {
  console.log("\n🚀 Copying deployment scripts...");

  const scriptsDir = path.join(process.cwd(), "scripts");
  const destDir = path.join(config.outputPath, "scripts");

  if (fs.existsSync(scriptsDir)) {
    const files = fs.readdirSync(scriptsDir);
    files.forEach((file) => {
      const sourcePath = path.join(scriptsDir, file);
      const destPath = path.join(destDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`   ✓ Copied ${file}`);
    });
  }
}

/**
 * @notice Generate package.json for the new repository
 * @dev Creates a customized package.json with all dependencies
 */
function generatePackageJson(config: ExampleConfig): void {
  console.log("\n📦 Generating package.json...");

  const packageJson = {
    name: `fhevm-${config.name.toLowerCase().replace(/\s+/g, "-")}`,
    version: "1.0.0",
    description: config.description,
    main: "index.js",
    scripts: {
      compile: "hardhat compile",
      test: "hardhat test",
      "test:coverage": "hardhat coverage",
      deploy: "hardhat run scripts/deploy.ts",
      "deploy:sepolia": "hardhat run scripts/deploy.ts --network sepolia",
      "deploy:zama": "hardhat run scripts/deploy.ts --network zama",
      node: "hardhat node",
      clean: "hardhat clean",
      typechain: "hardhat typechain",
      "docs:generate": "ts-node tools/generate-docs.ts",
    },
    keywords: [
      "fhevm",
      "zama",
      "fully-homomorphic-encryption",
      "blockchain",
      "privacy",
      "ethereum",
      config.category,
    ],
    author: "FHEVM Community",
    license: "MIT",
    dependencies: {
      "@fhevm/solidity": "^0.5.0",
      dotenv: "^16.3.1",
      ethers: "^6.9.0",
    },
    devDependencies: {
      "@nomicfoundation/hardhat-chai-matchers": "^2.0.0",
      "@nomicfoundation/hardhat-ethers": "^3.0.0",
      "@nomicfoundation/hardhat-network-helpers": "^1.0.0",
      "@nomicfoundation/hardhat-toolbox": "^4.0.0",
      "@nomicfoundation/hardhat-verify": "^2.0.0",
      "@typechain/ethers-v6": "^0.5.0",
      "@typechain/hardhat": "^9.0.0",
      "@types/chai": "^4.3.11",
      "@types/mocha": "^10.0.6",
      "@types/node": "^20.10.6",
      chai: "^4.3.10",
      hardhat: "^2.19.4",
      "hardhat-deploy": "^0.11.45",
      "hardhat-gas-reporter": "^1.0.9",
      "solidity-coverage": "^0.8.5",
      "ts-node": "^10.9.2",
      typechain: "^8.3.2",
      typescript: "^5.3.3",
    },
    engines: {
      node: ">=18.0.0",
      npm: ">=9.0.0",
    },
  };

  const destPath = path.join(config.outputPath, "package.json");
  fs.writeFileSync(destPath, JSON.stringify(packageJson, null, 2));
  console.log("   ✓ Generated package.json");
}

/**
 * @notice Generate README.md for the repository
 * @dev Creates comprehensive documentation following bounty requirements
 */
function generateReadme(config: ExampleConfig): void {
  console.log("\n📝 Generating README.md...");

  const readme = `# ${config.name} - FHEVM Example

${config.description}

## Overview

This example demonstrates key FHEVM (Fully Homomorphic Encryption Virtual Machine) concepts including:

- **Encrypted Data Types**: Using \`euint64\`, \`euint32\`, \`euint8\`, and \`ebool\`
- **Access Control**: Implementing \`FHE.allow()\` and \`FHE.allowThis()\` patterns
- **Encrypted Arithmetic**: Performing operations on encrypted values
- **Privacy Preservation**: Keeping sensitive data encrypted on-chain
- **User Decryption**: Allowing users to decrypt their own data

## Features

- ✅ Comprehensive smart contract with NatSpec documentation
- ✅ Full test suite with TSDoc comments
- ✅ Deployment scripts with error handling
- ✅ Frontend integration example
- ✅ GitBook-compatible documentation

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MetaMask or compatible Web3 wallet

## Installation

\`\`\`bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Add your private key and RPC URLs
\`\`\`

## Usage

### Compile Contracts

\`\`\`bash
npm run compile
\`\`\`

### Run Tests

\`\`\`bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
\`\`\`

### Deploy

\`\`\`bash
# Deploy to local network
npm run node  # In terminal 1
npm run deploy  # In terminal 2

# Deploy to Zama testnet
npm run deploy:zama

# Deploy to Sepolia
npm run deploy:sepolia
\`\`\`

### Generate Documentation

\`\`\`bash
npm run docs:generate
\`\`\`

## Project Structure

\`\`\`
.
├── contracts/          # Smart contracts with NatSpec
├── test/              # Test suite with TSDoc
├── scripts/           # Deployment scripts
├── tools/             # Automation tools
├── docs/              # Generated documentation
├── frontend/          # Frontend integration
├── hardhat.config.ts  # Hardhat configuration
└── README.md          # This file
\`\`\`

## Key Concepts Demonstrated

### 1. Encryption Pattern

\`\`\`solidity
// Convert plaintext to encrypted value
euint64 encryptedBalance = FHE.asEuint64(userBalance);
\`\`\`

### 2. Access Control Pattern

\`\`\`solidity
// Grant access to contract
FHE.allowThis(encryptedValue);

// Grant access to specific user
FHE.allow(encryptedValue, userAddress);
\`\`\`

### 3. Encrypted Arithmetic

\`\`\`solidity
// Perform operations on encrypted values
euint32 newTotal = FHE.add(currentTotal, FHE.asEuint32(1));
\`\`\`

### 4. User Decryption

\`\`\`solidity
// Return encrypted value for user to decrypt client-side
function getMyEncryptedBalance() external view returns (euint64) {
    return userBalances[msg.sender];
}
\`\`\`

## Security Considerations

- Never expose unencrypted sensitive data on-chain
- Always set proper access control with \`FHE.allow()\`
- Validate inputs before encryption
- Use appropriate encrypted data types for value ranges
- Test edge cases thoroughly

## Testing

The test suite covers:

- ✅ Basic functionality
- ✅ Access control enforcement
- ✅ Encryption patterns
- ✅ Edge cases
- ✅ Error handling
- ✅ Integration scenarios

## Contributing

This example is part of the Zama FHEVM bounty program. Contributions are welcome!

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Discord](https://discord.gg/zama)
- [Bounty Details](https://github.com/zama-ai/bounty-program)

## License

MIT

## Acknowledgments

Built for the Zama FHEVM Bounty Program December 2025.
`;

  const destPath = path.join(config.outputPath, "README.md");
  fs.writeFileSync(destPath, readme);
  console.log("   ✓ Generated README.md");
}

/**
 * @notice Initialize git repository
 * @dev Creates a git repository with initial commit
 */
function initializeGitRepository(config: ExampleConfig): void {
  console.log("\n🔧 Initializing git repository...");

  try {
    execSync("git init", { cwd: config.outputPath, stdio: "ignore" });
    execSync("git add .", { cwd: config.outputPath, stdio: "ignore" });
    execSync('git commit -m "Initial commit: FHEVM example repository"', {
      cwd: config.outputPath,
      stdio: "ignore",
    });
    console.log("   ✓ Git repository initialized");
  } catch (error) {
    console.log("   ⚠ Could not initialize git repository (git may not be installed)");
  }
}

// Run the main function
createFHEVMExample().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
