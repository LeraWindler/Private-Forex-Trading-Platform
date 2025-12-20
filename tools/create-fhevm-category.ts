#!/usr/bin/env ts-node

/**
 * @title FHEVM Category Project Generator
 * @notice Creates FHEVM projects with multiple examples from a category
 * @dev This tool demonstrates bounty requirement for category-based project generation
 *      It creates complete Hardhat projects containing multiple related examples
 *
 * @custom:usage ts-node tools/create-fhevm-category.ts <category> [output-dir]
 * @custom:example ts-node tools/create-fhevm-category.ts trading ./output/fhevm-trading-examples
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// Terminal color codes for better UX
enum Color {
  Reset = "\x1b[0m",
  Green = "\x1b[32m",
  Blue = "\x1b[34m",
  Yellow = "\x1b[33m",
  Red = "\x1b[31m",
  Cyan = "\x1b[36m",
}

function log(message: string, color: Color = Color.Reset): void {
  console.log(`${color}${message}${Color.Reset}`);
}

function error(message: string): never {
  log(`❌ Error: ${message}`, Color.Red);
  process.exit(1);
}

function success(message: string): void {
  log(`✅ ${message}`, Color.Green);
}

function info(message: string): void {
  log(`ℹ️  ${message}`, Color.Blue);
}

/**
 * Contract item configuration interface
 */
interface ContractItem {
  path: string;
  test: string;
  description: string;
}

/**
 * Category configuration interface
 */
interface CategoryConfig {
  name: string;
  description: string;
  contracts: ContractItem[];
  keywords: string[];
}

/**
 * Available categories for generation
 * Each category contains related FHEVM examples
 */
const CATEGORIES: Record<string, CategoryConfig> = {
  trading: {
    name: "Private Trading Examples",
    description: "Privacy-preserving trading and financial applications using FHEVM",
    contracts: [
      {
        path: "contracts/PrivateForexTrading.sol",
        test: "test/PrivateForexTrading.test.ts",
        description: "Private forex trading platform with encrypted orders and balances",
      },
    ],
    keywords: ["forex", "trading", "financial", "orders", "encrypted-trading"],
  },
  advanced: {
    name: "Advanced FHEVM Examples",
    description: "Complex use cases demonstrating advanced FHEVM patterns",
    contracts: [
      {
        path: "contracts/PrivateForexTrading.sol",
        test: "test/PrivateForexTrading.test.ts",
        description: "Multi-session trading platform with complex encrypted state",
      },
    ],
    keywords: ["advanced", "complex", "multi-party", "session-management"],
  },
};

/**
 * Main function to create category project
 */
async function createCategoryProject() {
  log("\n🚀 FHEVM Category Project Generator\n", Color.Cyan);

  // Parse command line arguments
  const args = process.argv.slice(2);

  if (args.length === 0) {
    log("Usage: ts-node tools/create-fhevm-category.ts <category> [output-dir]\n", Color.Yellow);
    log("Available categories:", Color.Yellow);
    Object.keys(CATEGORIES).forEach((cat) => {
      log(`  - ${cat}: ${CATEGORIES[cat].description}`, Color.Yellow);
    });
    process.exit(0);
  }

  const category = args[0];
  const outputDir =
    args[1] || path.join(process.cwd(), "..", `fhevm-${category}-examples`);

  // Validate category
  if (!CATEGORIES[category]) {
    error(
      `Unknown category: ${category}\nAvailable: ${Object.keys(CATEGORIES).join(", ")}`
    );
  }

  const categoryConfig = CATEGORIES[category];
  info(`Creating category: ${categoryConfig.name}`);
  info(`Output directory: ${outputDir}\n`);

  try {
    // Step 1: Create directory structure
    createDirectoryStructure(outputDir);

    // Step 2: Copy configuration files
    copyConfigFiles(outputDir);

    // Step 3: Copy contracts and tests
    copyContractsAndTests(outputDir, categoryConfig);

    // Step 4: Copy scripts
    copyScripts(outputDir);

    // Step 5: Generate package.json
    generatePackageJson(outputDir, category, categoryConfig);

    // Step 6: Generate README
    generateReadme(outputDir, category, categoryConfig);

    // Step 7: Generate deployment script
    generateDeployScript(outputDir, categoryConfig);

    // Step 8: Copy tools
    copyTools(outputDir);

    // Step 9: Initialize git
    initializeGit(outputDir);

    log("\n✨ Category project created successfully!\n", Color.Green);
    success("Next steps:");
    console.log(`   cd ${path.relative(process.cwd(), outputDir)}`);
    console.log(`   npm install`);
    console.log(`   npm run compile`);
    console.log(`   npm test\n`);
  } catch (err) {
    error(`Failed to create category project: ${err}`);
  }
}

/**
 * Create directory structure for the project
 */
function createDirectoryStructure(outputDir: string): void {
  info("Creating directory structure...");

  const dirs = [
    outputDir,
    path.join(outputDir, "contracts"),
    path.join(outputDir, "test"),
    path.join(outputDir, "scripts"),
    path.join(outputDir, "tools"),
    path.join(outputDir, "docs"),
    path.join(outputDir, "frontend"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  success("Directory structure created");
}

/**
 * Copy configuration files
 */
function copyConfigFiles(outputDir: string): void {
  info("Copying configuration files...");

  const configFiles = [
    "hardhat.config.ts",
    "tsconfig.json",
    ".gitignore",
    ".env.example",
    ".eslintrc.json",
    ".prettierrc",
  ];

  configFiles.forEach((file) => {
    const sourcePath = path.join(process.cwd(), file);
    const destPath = path.join(outputDir, file);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
    }
  });

  success("Configuration files copied");
}

/**
 * Copy contracts and tests from category
 */
function copyContractsAndTests(
  outputDir: string,
  categoryConfig: CategoryConfig
): void {
  info("Copying contracts and tests...");

  categoryConfig.contracts.forEach((item) => {
    // Copy contract
    const contractSource = path.join(process.cwd(), item.path);
    const contractDest = path.join(
      outputDir,
      "contracts",
      path.basename(item.path)
    );

    if (fs.existsSync(contractSource)) {
      fs.copyFileSync(contractSource, contractDest);
      log(`  ✓ Copied ${path.basename(item.path)}`, Color.Green);
    }

    // Copy test
    const testSource = path.join(process.cwd(), item.test);
    const testDest = path.join(outputDir, "test", path.basename(item.test));

    if (fs.existsSync(testSource)) {
      fs.copyFileSync(testSource, testDest);
      log(`  ✓ Copied ${path.basename(item.test)}`, Color.Green);
    }
  });

  success("Contracts and tests copied");
}

/**
 * Copy deployment and interaction scripts
 */
function copyScripts(outputDir: string): void {
  info("Copying scripts...");

  const scriptsDir = path.join(process.cwd(), "scripts");
  const destScriptsDir = path.join(outputDir, "scripts");

  if (fs.existsSync(scriptsDir)) {
    const files = fs.readdirSync(scriptsDir);
    files.forEach((file) => {
      if (file.endsWith(".ts")) {
        const sourcePath = path.join(scriptsDir, file);
        const destPath = path.join(destScriptsDir, file);
        fs.copyFileSync(sourcePath, destPath);
      }
    });
  }

  success("Scripts copied");
}

/**
 * Copy automation tools
 */
function copyTools(outputDir: string): void {
  info("Copying automation tools...");

  const toolsDir = path.join(process.cwd(), "tools");
  const destToolsDir = path.join(outputDir, "tools");

  if (fs.existsSync(toolsDir)) {
    const files = fs.readdirSync(toolsDir);
    files.forEach((file) => {
      if (file.endsWith(".ts")) {
        const sourcePath = path.join(toolsDir, file);
        const destPath = path.join(destToolsDir, file);
        fs.copyFileSync(sourcePath, destPath);
      }
    });
  }

  success("Automation tools copied");
}

/**
 * Generate package.json
 */
function generatePackageJson(
  outputDir: string,
  category: string,
  categoryConfig: CategoryConfig
): void {
  info("Generating package.json...");

  const packageJson = {
    name: `fhevm-${category}-examples`,
    version: "1.0.0",
    description: categoryConfig.description,
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
      "example:create": "ts-node tools/create-fhevm-example.ts",
      lint: "eslint . --ext .ts",
      format: 'prettier --write "**/*.{ts,sol,md}"',
    },
    keywords: [
      "fhevm",
      "zama",
      "fully-homomorphic-encryption",
      "blockchain",
      "privacy",
      ...categoryConfig.keywords,
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
      "@typescript-eslint/eslint-plugin": "^6.16.0",
      "@typescript-eslint/parser": "^6.16.0",
      chai: "^4.3.10",
      eslint: "^8.56.0",
      "eslint-config-prettier": "^9.1.0",
      hardhat: "^2.19.4",
      "hardhat-deploy": "^0.11.45",
      "hardhat-gas-reporter": "^1.0.9",
      prettier: "^3.1.1",
      "prettier-plugin-solidity": "^1.3.1",
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

  const destPath = path.join(outputDir, "package.json");
  fs.writeFileSync(destPath, JSON.stringify(packageJson, null, 2));

  success("package.json generated");
}

/**
 * Generate README for the category project
 */
function generateReadme(
  outputDir: string,
  category: string,
  categoryConfig: CategoryConfig
): void {
  info("Generating README...");

  const contractNames = categoryConfig.contracts.map((c) =>
    path.basename(c.path, ".sol")
  );

  const readme = `# FHEVM Examples: ${categoryConfig.name}

${categoryConfig.description}

## 📦 Included Examples

This project contains ${categoryConfig.contracts.length} example contract${
    categoryConfig.contracts.length > 1 ? "s" : ""
  }:

${categoryConfig.contracts
  .map(
    (c, i) =>
      `${i + 1}. **${path.basename(c.path, ".sol")}** - ${c.description}`
  )
  .join("\n")}

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

\`\`\`bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Add PRIVATE_KEY and RPC URLs
\`\`\`

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
npm run node  # Terminal 1
npm run deploy  # Terminal 2

# Deploy to Zama testnet
npm run deploy:zama
\`\`\`

## 📚 Contracts

${contractNames
  .map(
    (name) => `### ${name}

Located in \`contracts/${name}.sol\`

Run specific tests:
\`\`\`bash
npx hardhat test test/${name}.test.ts
\`\`\`
`
  )
  .join("\n")}

## 🛠️ Automation Tools

### Generate New Examples

\`\`\`bash
npm run example:create -- --name "YourExample" --category "${category}"
\`\`\`

### Generate Documentation

\`\`\`bash
npm run docs:generate
\`\`\`

## 📖 Documentation

Full documentation available in \`docs/\` directory.

## 🔗 Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Discord](https://discord.gg/zama)
- [Bounty Program](https://github.com/zama-ai/bounty-program)

## 📄 License

MIT License

## 🙏 Acknowledgments

Built for the Zama FHEVM Bounty Program December 2025.
`;

  const destPath = path.join(outputDir, "README.md");
  fs.writeFileSync(destPath, readme);

  success("README generated");
}

/**
 * Generate deployment script for all contracts
 */
function generateDeployScript(
  outputDir: string,
  categoryConfig: CategoryConfig
): void {
  info("Generating deployment script...");

  const contractNames = categoryConfig.contracts.map((c) =>
    path.basename(c.path, ".sol")
  );

  const deployScript = `import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ${categoryConfig.name}...\\n");

${contractNames
  .map(
    (name) => `
  // Deploy ${name}
  console.log("Deploying ${name}...");
  const ${name} = await ethers.getContractFactory("${name}");
  const ${name.toLowerCase()} = await ${name}.deploy();
  await ${name.toLowerCase()}.waitForDeployment();
  const ${name.toLowerCase()}Address = await ${name.toLowerCase()}.getAddress();
  console.log("✅ ${name} deployed to:", ${name.toLowerCase()}Address);
`
  )
  .join("\n")}

  console.log("\\n✨ All contracts deployed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
`;

  const destPath = path.join(outputDir, "scripts", "deploy.ts");
  fs.writeFileSync(destPath, deployScript);

  success("Deployment script generated");
}

/**
 * Initialize git repository
 */
function initializeGit(outputDir: string): void {
  info("Initializing git repository...");

  try {
    execSync("git init", { cwd: outputDir, stdio: "ignore" });
    execSync("git add .", { cwd: outputDir, stdio: "ignore" });
    execSync('git commit -m "Initial commit: FHEVM category project"', {
      cwd: outputDir,
      stdio: "ignore",
    });
    success("Git repository initialized");
  } catch (err) {
    log(
      "⚠️  Could not initialize git repository (git may not be installed)",
      Color.Yellow
    );
  }
}

// Run the main function
createCategoryProject().catch((err) => {
  error(`Fatal error: ${err}`);
});
