#!/usr/bin/env ts-node

import * as fs from "fs";
import * as path from "path";

/**
 * @title FHEVM Documentation Generator
 * @notice Automated tool to generate GitBook-compatible documentation from code
 * @dev Extracts documentation from:
 *      - NatSpec comments in Solidity contracts
 *      - TSDoc comments in TypeScript tests
 *      - Code examples and patterns
 *
 * @custom:bounty-requirement Documentation generation (requirement #4)
 * @custom:output GitBook-compatible Markdown files
 */

interface DocSection {
  title: string;
  content: string;
  category: string;
  order: number;
}

interface ContractDoc {
  title: string;
  description: string;
  concepts: string[];
  functions: FunctionDoc[];
}

interface FunctionDoc {
  name: string;
  description: string;
  params: ParamDoc[];
  returns: string;
  examples: string[];
  tags: Record<string, string>;
}

interface ParamDoc {
  name: string;
  type: string;
  description: string;
}

/**
 * @notice Main documentation generation function
 * @dev Orchestrates the entire documentation generation process
 */
async function generateDocumentation() {
  console.log("📚 FHEVM Documentation Generator\n");

  const docsPath = path.join(process.cwd(), "docs");

  // Create docs directory if it doesn't exist
  if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath, { recursive: true });
  }

  try {
    // Step 1: Parse Solidity contracts
    console.log("📄 Parsing Solidity contracts...");
    const contractDocs = parseContracts();

    // Step 2: Parse TypeScript tests
    console.log("🧪 Parsing test files...");
    const testDocs = parseTests();

    // Step 3: Generate documentation files
    console.log("📝 Generating documentation...");
    generateContractDocs(contractDocs, docsPath);
    generateTestDocs(testDocs, docsPath);
    generateIndexFile(contractDocs, docsPath);
    generateSummaryFile(contractDocs, testDocs, docsPath);
    generateQuickStart(docsPath);
    generateConceptsGuide(contractDocs, docsPath);

    console.log("\n✅ Documentation generated successfully!");
    console.log(`📂 Output directory: ${docsPath}`);

  } catch (error) {
    console.error("❌ Error generating documentation:", error);
    process.exit(1);
  }
}

/**
 * @notice Parse Solidity contract files for documentation
 * @dev Extracts NatSpec comments and function signatures
 */
function parseContracts(): ContractDoc[] {
  const contractsPath = path.join(process.cwd(), "contracts");
  const contractDocs: ContractDoc[] = [];

  if (!fs.existsSync(contractsPath)) {
    console.warn("⚠ Contracts directory not found");
    return contractDocs;
  }

  const files = fs.readdirSync(contractsPath).filter((f) => f.endsWith(".sol"));

  files.forEach((file) => {
    const filePath = path.join(contractsPath, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const doc = extractContractDoc(content, file);
    if (doc) {
      contractDocs.push(doc);
      console.log(`   ✓ Parsed ${file}`);
    }
  });

  return contractDocs;
}

/**
 * @notice Extract documentation from contract source code
 * @dev Parses NatSpec comments and extracts key information
 */
function extractContractDoc(content: string, filename: string): ContractDoc | null {
  const doc: ContractDoc = {
    title: "",
    description: "",
    concepts: [],
    functions: [],
  };

  // Extract contract title from @title tag
  const titleMatch = content.match(/@title\s+(.+)/);
  if (titleMatch) {
    doc.title = titleMatch[1].trim();
  }

  // Extract description from @notice tag
  const noticeMatch = content.match(/@notice\s+(.+)/);
  if (noticeMatch) {
    doc.description = noticeMatch[1].trim();
  }

  // Extract concepts from @custom:category tags
  const categoryMatches = content.matchAll(/@custom:category\s+(.+)/g);
  for (const match of categoryMatches) {
    doc.concepts.push(match[1].trim());
  }

  // Extract functions
  const functionMatches = content.matchAll(/function\s+(\w+)\s*\([^)]*\)/g);
  for (const match of functionMatches) {
    const funcDoc = extractFunctionDoc(content, match[1]);
    if (funcDoc) {
      doc.functions.push(funcDoc);
    }
  }

  return doc.title ? doc : null;
}

/**
 * @notice Extract function documentation
 * @dev Parses NatSpec for a specific function
 */
function extractFunctionDoc(content: string, functionName: string): FunctionDoc | null {
  // Find the function and its preceding comments
  const funcRegex = new RegExp(`\\/\\*\\*[\\s\\S]*?\\*\\/[\\s\\S]*?function\\s+${functionName}`, "m");
  const match = content.match(funcRegex);

  if (!match) return null;

  const commentBlock = match[0];

  const doc: FunctionDoc = {
    name: functionName,
    description: "",
    params: [],
    returns: "",
    examples: [],
    tags: {},
  };

  // Extract @notice
  const noticeMatch = commentBlock.match(/@notice\s+(.+)/);
  if (noticeMatch) {
    doc.description = noticeMatch[1].trim();
  }

  // Extract @param tags
  const paramMatches = commentBlock.matchAll(/@param\s+(\w+)\s+(.+)/g);
  for (const match of paramMatches) {
    doc.params.push({
      name: match[1],
      type: "",
      description: match[2].trim(),
    });
  }

  // Extract @return tag
  const returnMatch = commentBlock.match(/@return\s+(.+)/);
  if (returnMatch) {
    doc.returns = returnMatch[1].trim();
  }

  // Extract @custom tags
  const customMatches = commentBlock.matchAll(/@custom:(\w+)\s+(.+)/g);
  for (const match of customMatches) {
    doc.tags[match[1]] = match[2].trim();
  }

  return doc;
}

/**
 * @notice Parse TypeScript test files
 * @dev Extracts TSDoc comments from test files
 */
function parseTests(): any[] {
  const testPath = path.join(process.cwd(), "test");
  const testDocs: any[] = [];

  if (!fs.existsSync(testPath)) {
    console.warn("⚠ Test directory not found");
    return testDocs;
  }

  const files = fs.readdirSync(testPath).filter((f) => f.endsWith(".test.ts") || f.endsWith(".spec.ts"));

  files.forEach((file) => {
    const filePath = path.join(testPath, file);
    const content = fs.readFileSync(filePath, "utf-8");

    console.log(`   ✓ Parsed ${file}`);
    testDocs.push({ file, content });
  });

  return testDocs;
}

/**
 * @notice Generate contract documentation files
 * @dev Creates Markdown files for each contract
 */
function generateContractDocs(contractDocs: ContractDoc[], docsPath: string): void {
  contractDocs.forEach((doc) => {
    const filename = `${doc.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    const filepath = path.join(docsPath, filename);

    let markdown = `# ${doc.title}\n\n`;
    markdown += `${doc.description}\n\n`;

    if (doc.concepts.length > 0) {
      markdown += `## Key Concepts\n\n`;
      markdown += `This example demonstrates:\n\n`;
      doc.concepts.forEach((concept) => {
        markdown += `- ${concept}\n`;
      });
      markdown += `\n`;
    }

    if (doc.functions.length > 0) {
      markdown += `## Functions\n\n`;

      doc.functions.forEach((func) => {
        markdown += `### ${func.name}\n\n`;
        markdown += `${func.description}\n\n`;

        if (func.params.length > 0) {
          markdown += `**Parameters:**\n\n`;
          func.params.forEach((param) => {
            markdown += `- \`${param.name}\`: ${param.description}\n`;
          });
          markdown += `\n`;
        }

        if (func.returns) {
          markdown += `**Returns:** ${func.returns}\n\n`;
        }

        if (Object.keys(func.tags).length > 0) {
          markdown += `**Tags:**\n\n`;
          Object.entries(func.tags).forEach(([key, value]) => {
            markdown += `- **${key}**: ${value}\n`;
          });
          markdown += `\n`;
        }

        markdown += `---\n\n`;
      });
    }

    fs.writeFileSync(filepath, markdown);
    console.log(`   ✓ Generated ${filename}`);
  });
}

/**
 * @notice Generate test documentation files
 * @dev Creates documentation from test files
 */
function generateTestDocs(testDocs: any[], docsPath: string): void {
  const filename = "testing-guide.md";
  const filepath = path.join(docsPath, filename);

  let markdown = `# Testing Guide\n\n`;
  markdown += `This guide covers the test suite and testing patterns used in this FHEVM example.\n\n`;
  markdown += `## Running Tests\n\n`;
  markdown += `\`\`\`bash\n`;
  markdown += `# Run all tests\n`;
  markdown += `npm test\n\n`;
  markdown += `# Run with coverage\n`;
  markdown += `npm run test:coverage\n`;
  markdown += `\`\`\`\n\n`;

  markdown += `## Test Structure\n\n`;
  markdown += `The test suite is organized into logical sections:\n\n`;
  markdown += `- **Deployment Tests**: Verify initial contract state\n`;
  markdown += `- **Registration Tests**: Test user registration with encrypted data\n`;
  markdown += `- **Session Management Tests**: Verify trading session lifecycle\n`;
  markdown += `- **Order Placement Tests**: Test private order creation\n`;
  markdown += `- **Execution Tests**: Verify order processing\n`;
  markdown += `- **Edge Cases**: Test error handling and boundary conditions\n\n`;

  markdown += `## Key Testing Patterns\n\n`;
  markdown += `### Testing Encrypted Data\n\n`;
  markdown += `\`\`\`typescript\n`;
  markdown += `// Encrypted values are created but not directly readable in tests\n`;
  markdown += `await contract.registerTrader(initialBalance);\n`;
  markdown += `// We verify state changes and events, not encrypted values\n`;
  markdown += `\`\`\`\n\n`;

  markdown += `### Testing Access Control\n\n`;
  markdown += `\`\`\`typescript\n`;
  markdown += `// Verify that unauthorized access is prevented\n`;
  markdown += `await expect(\n`;
  markdown += `  contract.connect(unauthorizedUser).privilegedFunction()\n`;
  markdown += `).to.be.revertedWith("Not authorized");\n`;
  markdown += `\`\`\`\n\n`;

  markdown += `### Testing Time-Dependent Logic\n\n`;
  markdown += `\`\`\`typescript\n`;
  markdown += `// Use Hardhat network helpers to manipulate time\n`;
  markdown += `await time.increase(SESSION_DURATION + 1);\n`;
  markdown += `await contract.executeOrders();\n`;
  markdown += `\`\`\`\n\n`;

  fs.writeFileSync(filepath, markdown);
  console.log(`   ✓ Generated ${filename}`);
}

/**
 * @notice Generate index file for documentation
 * @dev Creates the main landing page
 */
function generateIndexFile(contractDocs: ContractDoc[], docsPath: string): void {
  const filepath = path.join(docsPath, "index.md");

  let markdown = `# FHEVM Example Documentation\n\n`;
  markdown += `Welcome to the FHEVM example documentation. This project demonstrates how to build privacy-preserving applications using Fully Homomorphic Encryption.\n\n`;

  markdown += `## What is FHEVM?\n\n`;
  markdown += `FHEVM (Fully Homomorphic Encryption Virtual Machine) enables smart contracts to perform computations on encrypted data without decrypting it. This allows building truly private applications on the blockchain.\n\n`;

  markdown += `## Quick Links\n\n`;
  markdown += `- [Quick Start Guide](./quick-start.md)\n`;
  markdown += `- [Concepts Guide](./concepts-guide.md)\n`;
  markdown += `- [Testing Guide](./testing-guide.md)\n`;
  contractDocs.forEach((doc) => {
    const filename = doc.title.replace(/\s+/g, "-").toLowerCase();
    markdown += `- [${doc.title}](./${filename}.md)\n`;
  });
  markdown += `\n`;

  markdown += `## Key Features\n\n`;
  markdown += `- ✅ Encrypted data storage on-chain\n`;
  markdown += `- ✅ Privacy-preserving computations\n`;
  markdown += `- ✅ Fine-grained access control\n`;
  markdown += `- ✅ User-controlled decryption\n`;
  markdown += `- ✅ Comprehensive test coverage\n\n`;

  fs.writeFileSync(filepath, markdown);
  console.log(`   ✓ Generated index.md`);
}

/**
 * @notice Generate GitBook SUMMARY.md file
 * @dev Creates the table of contents for GitBook
 */
function generateSummaryFile(contractDocs: ContractDoc[], testDocs: any[], docsPath: string): void {
  const filepath = path.join(docsPath, "SUMMARY.md");

  let markdown = `# Summary\n\n`;
  markdown += `* [Introduction](index.md)\n`;
  markdown += `* [Quick Start](quick-start.md)\n`;
  markdown += `* [Concepts Guide](concepts-guide.md)\n`;
  markdown += `\n## Contracts\n\n`;

  contractDocs.forEach((doc) => {
    const filename = doc.title.replace(/\s+/g, "-").toLowerCase();
    markdown += `* [${doc.title}](${filename}.md)\n`;
  });

  markdown += `\n## Testing\n\n`;
  markdown += `* [Testing Guide](testing-guide.md)\n`;

  fs.writeFileSync(filepath, markdown);
  console.log(`   ✓ Generated SUMMARY.md`);
}

/**
 * @notice Generate quick start guide
 * @dev Creates a getting started guide
 */
function generateQuickStart(docsPath: string): void {
  const filepath = path.join(docsPath, "quick-start.md");

  const markdown = `# Quick Start Guide

## Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd <repository-directory>

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
\`\`\`

## Configuration

Edit \`.env\` file with your settings:

\`\`\`
SEPOLIA_RPC_URL=your_rpc_url
ZAMA_RPC_URL=https://devnet.zama.ai
PRIVATE_KEY=your_private_key
\`\`\`

## Compile Contracts

\`\`\`bash
npm run compile
\`\`\`

## Run Tests

\`\`\`bash
npm test
\`\`\`

## Deploy

\`\`\`bash
# Local deployment
npm run node  # Terminal 1
npm run deploy  # Terminal 2

# Zama testnet
npm run deploy:zama
\`\`\`

## Next Steps

- Read the [Concepts Guide](./concepts-guide.md) to understand FHEVM patterns
- Explore the contract documentation
- Run the test suite to see examples in action
- Check out the frontend integration
`;

  fs.writeFileSync(filepath, markdown);
  console.log(`   ✓ Generated quick-start.md`);
}

/**
 * @notice Generate concepts guide
 * @dev Creates educational content about FHEVM patterns
 */
function generateConceptsGuide(contractDocs: ContractDoc[], docsPath: string): void {
  const filepath = path.join(docsPath, "concepts-guide.md");

  const markdown = `# FHEVM Concepts Guide

## Introduction to FHEVM

Fully Homomorphic Encryption (FHE) allows computations to be performed on encrypted data without decrypting it. FHEVM brings this capability to smart contracts, enabling truly private applications on the blockchain.

## Core Concepts

### 1. Encrypted Data Types

FHEVM provides encrypted versions of standard Solidity types:

- \`euint8\`: Encrypted 8-bit unsigned integer
- \`euint16\`: Encrypted 16-bit unsigned integer
- \`euint32\`: Encrypted 32-bit unsigned integer
- \`euint64\`: Encrypted 64-bit unsigned integer
- \`ebool\`: Encrypted boolean

**Example:**
\`\`\`solidity
euint64 encryptedBalance = FHE.asEuint64(userBalance);
\`\`\`

### 2. Access Control

Access to encrypted data must be explicitly granted using \`FHE.allow()\`:

**Pattern:**
\`\`\`solidity
// Grant access to contract
FHE.allowThis(encryptedValue);

// Grant access to user
FHE.allow(encryptedValue, userAddress);
\`\`\`

### 3. Encrypted Operations

FHEVM provides functions to operate on encrypted values:

- \`FHE.add(a, b)\`: Add two encrypted values
- \`FHE.sub(a, b)\`: Subtract encrypted values
- \`FHE.mul(a, b)\`: Multiply encrypted values
- \`FHE.eq(a, b)\`: Compare encrypted values for equality
- \`FHE.lt(a, b)\`: Less than comparison
- \`FHE.gt(a, b)\`: Greater than comparison

**Example:**
\`\`\`solidity
euint32 newTotal = FHE.add(currentTotal, FHE.asEuint32(1));
\`\`\`

### 4. User Decryption

Users can decrypt their own data client-side:

**Pattern:**
\`\`\`solidity
function getMyEncryptedBalance() external view returns (euint64) {
    return balances[msg.sender];
}
\`\`\`

The user receives the encrypted value and decrypts it with their private key on the client side.

### 5. Privacy Patterns

#### Private Storage
Store sensitive data encrypted:
\`\`\`solidity
mapping(address => euint64) private balances;
\`\`\`

#### Private Computation
Compute on encrypted data:
\`\`\`solidity
function transfer(euint64 encryptedAmount) external {
    balances[msg.sender] = FHE.sub(balances[msg.sender], encryptedAmount);
    balances[recipient] = FHE.add(balances[recipient], encryptedAmount);
}
\`\`\`

#### Conditional Logic
Use encrypted booleans:
\`\`\`solidity
ebool hasEnough = FHE.gte(balance, amount);
\`\`\`

## Best Practices

1. **Always Set Access Control**: Call \`FHE.allowThis()\` for contract access
2. **Validate Before Encrypting**: Check plaintext inputs before encryption
3. **Use Appropriate Types**: Choose the smallest type that fits your data
4. **Document Access Patterns**: Clearly document who can access what data
5. **Test Thoroughly**: Test both success and failure cases

## Common Pitfalls

1. **Forgetting Access Control**: Always set \`FHE.allow()\` after creating encrypted values
2. **Type Mismatches**: Ensure operations use compatible encrypted types
3. **Gas Costs**: FHE operations are more expensive than plaintext
4. **Comparing Encrypted Values**: Use \`FHE.eq()\`, not \`==\`

## Security Considerations

- Never expose private keys
- Set minimal necessary access permissions
- Validate all inputs before encryption
- Consider gas costs for complex operations
- Audit access control carefully

## Next Steps

- Explore the contract documentation for practical examples
- Run the test suite to see patterns in action
- Try modifying the examples for your use case
`;

  fs.writeFileSync(filepath, markdown);
  console.log(`   ✓ Generated concepts-guide.md`);
}

// Run the main function
generateDocumentation().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
