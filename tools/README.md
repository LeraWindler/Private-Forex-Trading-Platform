# Automation Tools Documentation

This directory contains automation tools for generating FHEVM examples and documentation, fulfilling the Zama bounty requirements for automated scaffolding and documentation generation.

## Table of Contents

1. [Overview](#overview)
2. [create-fhevm-example.ts](#create-fhevm-examplets)
3. [create-fhevm-category.ts](#create-fhevm-categoryts)
4. [generate-docs.ts](#generate-docsts)
5. [Usage Examples](#usage-examples)
6. [Extending the Tools](#extending-the-tools)

---

## Overview

These tools demonstrate the **automated scaffolding** and **documentation generation** requirements from the Zama FHEVM Bounty Program December 2025.

### Tool Capabilities

| Tool | Purpose | Bounty Requirement |
|------|---------|-------------------|
| `create-fhevm-example.ts` | Generate standalone example repositories | Automated scaffolding (#2) |
| `create-fhevm-category.ts` | Generate category-based multi-example projects | Category organization |
| `generate-docs.ts` | Auto-generate GitBook documentation | Documentation generator (#4) |

---

## create-fhevm-example.ts

### Purpose

Generates complete, standalone FHEVM example repositories from the current project. Creates a ready-to-use Hardhat project with:
- Smart contracts with NatSpec documentation
- Comprehensive test suites
- Deployment scripts
- Configuration files
- README and documentation
- Git repository initialization

### Usage

```bash
# Using npm script (recommended)
npm run example:create -- --name "YourExampleName" --category "encryption"

# Direct execution
npx ts-node tools/create-fhevm-example.ts --name "PrivateForexTrading" --category "advanced"
```

### Parameters

- `--name` (required): Name of the example (e.g., "PrivateForexTrading")
- `--category` (optional): Category classification
  - `encryption` - Basic encryption examples
  - `access-control` - Access control patterns
  - `user-decryption` - User decryption examples
  - `arithmetic` - FHE arithmetic operations
  - `advanced` - Complex use cases (default)

### Output Structure

The tool creates a complete Hardhat project:

```
fhevm-yourexamplename/
├── contracts/              # Copied Solidity contracts
├── test/                   # Copied test files
├── scripts/                # Deployment and interaction scripts
├── tools/                  # Automation tools (copied)
├── docs/                   # Documentation directory
├── frontend/               # Frontend files (if present)
├── hardhat.config.ts       # Hardhat configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Generated with dependencies
├── .gitignore              # Git ignore file
├── .env.example            # Environment template
├── README.md               # Generated README
└── .git/                   # Initialized git repository
```

### What It Does

1. **Creates Directory Structure**
   - Sets up all necessary folders
   - Follows Hardhat conventions

2. **Copies Configuration Files**
   - `hardhat.config.ts`
   - `tsconfig.json`
   - `.gitignore`
   - `.env.example`

3. **Copies Contract Files**
   - All contracts from `contracts/`
   - Preserves NatSpec documentation

4. **Copies Test Files**
   - All tests from `test/`
   - Preserves TSDoc annotations

5. **Copies Deployment Scripts**
   - Deployment scripts
   - Interaction examples

6. **Generates package.json**
   - Customized project name
   - All required dependencies
   - Standard npm scripts

7. **Generates README.md**
   - Project overview
   - Installation instructions
   - Usage examples
   - Key concepts demonstrated

8. **Initializes Git Repository**
   - Creates `.git` directory
   - Initial commit with all files

### Example Output

```bash
🚀 FHEVM Example Repository Generator

📦 Creating example: PrivateForexTrading
📂 Output path: D:\projects\fhevm-privateforextrading

📁 Creating directory structure...
   ✓ Created fhevm-privateforextrading
   ✓ Created fhevm-privateforextrading\contracts
   ✓ Created fhevm-privateforextrading\test
   ✓ Created fhevm-privateforextrading\scripts
   ✓ Created fhevm-privateforextrading\tools
   ✓ Created fhevm-privateforextrading\docs
   ✓ Created fhevm-privateforextrading\frontend

⚙️  Copying configuration files...
   ✓ Copied hardhat.config.ts
   ✓ Copied tsconfig.json
   ✓ Copied .gitignore
   ✓ Copied .env.example

📄 Copying contract files...
   ✓ Copied PrivateForexTrading.sol

🧪 Copying test files...
   ✓ Copied PrivateForexTrading.test.ts

🚀 Copying deployment scripts...
   ✓ Copied deploy.ts
   ✓ Copied interact.ts

📦 Generating package.json...
   ✓ Generated package.json

📝 Generating README.md...
   ✓ Generated README.md

🔧 Initializing git repository...
   ✓ Git repository initialized

✅ Example repository created successfully!

📖 Next steps:
   cd D:\projects\fhevm-privateforextrading
   npm install
   npm run compile
   npm test
```

---

## create-fhevm-category.ts

### Purpose

Generates FHEVM projects containing multiple related examples from a category. Perfect for creating learning repositories with several examples grouped by concept.

### Usage

```bash
# Using npm script (recommended)
npm run category:create -- trading ./output/fhevm-trading-examples

# Direct execution
npx ts-node tools/create-fhevm-category.ts trading ./output/fhevm-trading-examples

# Show available categories
npx ts-node tools/create-fhevm-category.ts
```

### Available Categories

| Category | Description | Examples Included |
|----------|-------------|-------------------|
| `trading` | Private trading examples | PrivateForexTrading |
| `advanced` | Advanced FHEVM patterns | Complex multi-session applications |

### Parameters

- `<category>` (required): Category name
- `[output-dir]` (optional): Output directory (default: `../fhevm-<category>-examples`)

### Output Structure

```
fhevm-category-examples/
├── contracts/              # All contracts from category
│   ├── Contract1.sol
│   ├── Contract2.sol
│   └── Contract3.sol
├── test/                   # All tests from category
│   ├── Contract1.test.ts
│   ├── Contract2.test.ts
│   └── Contract3.test.ts
├── scripts/
│   └── deploy.ts          # Generated deployment for all contracts
├── tools/                 # Automation tools
├── docs/                  # Documentation
├── hardhat.config.ts
├── package.json          # With all dependencies
└── README.md             # Category overview
```

### What It Does

1. **Validates Category**
   - Checks if category exists
   - Displays available categories if invalid

2. **Creates Directory Structure**
   - Sets up project folders
   - Mirrors source structure

3. **Copies All Contracts**
   - All contracts in the category
   - Preserves directory structure

4. **Copies All Tests**
   - Matching test files
   - Includes test fixtures

5. **Generates Unified Deployment Script**
   - Deploys all contracts
   - Logs all contract addresses

6. **Generates Category README**
   - Lists all included examples
   - Provides setup instructions
   - Documents each contract

7. **Copies Automation Tools**
   - All tools from `tools/`
   - Ready for further generation

### Example: Trading Category

```bash
npm run category:create -- trading ./output/fhevm-trading

# Output:
🚀 FHEVM Category Project Generator

ℹ️  Creating category: Private Trading Examples
ℹ️  Output directory: D:\output\fhevm-trading

Creating directory structure...
✅ Directory structure created

Copying configuration files...
✅ Configuration files copied

Copying contracts and tests...
  ✓ Copied PrivateForexTrading.sol
  ✓ Copied PrivateForexTrading.test.ts
✅ Contracts and tests copied

Copying scripts...
✅ Scripts copied

Generating package.json...
✅ package.json generated

Generating README...
✅ README generated

Generating deployment script...
✅ Deployment script generated

Copying automation tools...
✅ Automation tools copied

Initializing git repository...
✅ Git repository initialized

✨ Category project created successfully!

✅ Next steps:
   cd output\fhevm-trading
   npm install
   npm run compile
   npm test
```

---

## generate-docs.ts

### Purpose

Automatically generates GitBook-compatible documentation from code comments and annotations. Extracts NatSpec from Solidity contracts and TSDoc from TypeScript tests.

### Usage

```bash
# Using npm script (recommended)
npm run docs:generate

# Direct execution
npx ts-node tools/generate-docs.ts
```

### What It Generates

1. **index.md** - Landing page with project overview
2. **SUMMARY.md** - GitBook table of contents
3. **quick-start.md** - Getting started guide
4. **concepts-guide.md** - FHEVM concepts explanation
5. **testing-guide.md** - Testing patterns and examples
6. **<contract-name>.md** - Contract documentation for each contract

### Documentation Sources

#### From Solidity Contracts (NatSpec)

```solidity
/**
 * @title Contract Title
 * @notice User-facing description
 * @dev Developer implementation notes
 * @param _parameter Parameter description
 * @return Description of return value
 * @custom:category encryption
 */
function yourFunction(uint32 _parameter) external returns (euint32) {
    // Implementation
}
```

Extracted:
- Contract title and description
- Function signatures and parameters
- Custom tags for categorization

#### From TypeScript Tests (TSDoc)

```typescript
/**
 * @chapter access-control
 * @description Test access control enforcement
 */
describe("Access Control", function () {
  it("Should enforce permissions", async function () {
    // Test implementation
  });
});
```

Extracted:
- Test chapter organization
- Test descriptions
- Code examples

### Output Format

#### Generated Documentation Structure

```
docs/
├── index.md                    # Landing page
│   ├── What is FHEVM?
│   ├── Quick Links
│   └── Key Features
│
├── SUMMARY.md                  # GitBook navigation
│   ├── Introduction
│   ├── Quick Start
│   ├── Concepts Guide
│   ├── Contracts
│   └── Testing
│
├── quick-start.md              # Getting started
│   ├── Installation
│   ├── Configuration
│   ├── Compile
│   ├── Test
│   └── Deploy
│
├── concepts-guide.md           # FHEVM concepts
│   ├── Encrypted Data Types
│   ├── Access Control
│   ├── Encrypted Operations
│   ├── User Decryption
│   ├── Best Practices
│   └── Common Pitfalls
│
├── testing-guide.md            # Testing guide
│   ├── Running Tests
│   ├── Test Structure
│   ├── Key Patterns
│   └── Examples
│
└── privateforextrading.md      # Contract docs
    ├── Overview
    ├── Key Concepts
    └── Functions (auto-extracted)
```

### Example Output

```bash
📚 FHEVM Documentation Generator

📄 Parsing Solidity contracts...
   ✓ Parsed PrivateForexTrading.sol
🧪 Parsing test files...
   ✓ Parsed PrivateForexTrading.test.ts
📝 Generating documentation...
   ✓ Generated privateforextrading.md
   ✓ Generated testing-guide.md
   ✓ Generated index.md
   ✓ Generated SUMMARY.md
   ✓ Generated quick-start.md
   ✓ Generated concepts-guide.md

✅ Documentation generated successfully!
📂 Output directory: D:\PrivateForexTrading\docs
```

### GitBook Integration

The generated documentation is ready for GitBook:

```bash
# Install GitBook CLI
npm install -g gitbook-cli

# Navigate to docs directory
cd docs

# Initialize GitBook
gitbook init

# Serve documentation locally
gitbook serve

# Build static site
gitbook build
```

Access at: `http://localhost:4000`

---

## Usage Examples

### Complete Workflow Example

```bash
# 1. Develop your FHEVM contract
nano contracts/PrivateForexTrading.sol

# 2. Write comprehensive tests
nano test/PrivateForexTrading.test.ts

# 3. Generate documentation
npm run docs:generate

# 4. Create standalone example repository
npm run example:create -- --name "PrivateForexTrading" --category "advanced"

# 5. Test the standalone repository
cd ../fhevm-privateforextrading
npm install
npm run compile
npm test

# 6. Create category project with multiple examples
cd ../PrivateForexTrading
npm run category:create -- trading ./output/trading-examples

# 7. Review generated projects
ls ../fhevm-privateforextrading
ls ./output/trading-examples
```

### Batch Generation Example

Create multiple standalone examples:

```bash
#!/bin/bash
# generate-all-examples.sh

EXAMPLES=("PrivateForexTrading")
CATEGORIES=("advanced")

for i in "${!EXAMPLES[@]}"; do
  echo "Generating ${EXAMPLES[$i]}..."
  npm run example:create -- \
    --name "${EXAMPLES[$i]}" \
    --category "${CATEGORIES[$i]}"
done

echo "All examples generated!"
```

---

## Extending the Tools

### Adding New Categories

Edit `tools/create-fhevm-category.ts`:

```typescript
const CATEGORIES: Record<string, CategoryConfig> = {
  // Existing categories...

  // Add new category
  "your-category": {
    name: "Your Category Name",
    description: "Description of category",
    contracts: [
      {
        path: "contracts/YourContract.sol",
        test: "test/YourContract.test.ts",
        description: "Contract description",
      },
    ],
    keywords: ["keyword1", "keyword2"],
  },
};
```

### Customizing Documentation Generation

Edit `tools/generate-docs.ts`:

1. **Add New Documentation Sections**

```typescript
function generateCustomGuide(docsPath: string): void {
  const filepath = path.join(docsPath, "custom-guide.md");

  const markdown = `# Custom Guide

Your custom content here...
`;

  fs.writeFileSync(filepath, markdown);
  console.log("   ✓ Generated custom-guide.md");
}

// Call in main function
async function generateDocumentation() {
  // ... existing code
  generateCustomGuide(docsPath);
}
```

2. **Extract Custom Tags**

```typescript
// Extract @custom:your-tag from contracts
const customMatches = content.matchAll(/@custom:your-tag\s+(.+)/g);
for (const match of customMatches) {
  // Process custom tags
}
```

### Adding Template Customization

Edit `tools/create-fhevm-example.ts`:

```typescript
function generateReadme(config: ExampleConfig): void {
  // Customize README template
  const readme = `# ${config.name}

## Your Custom Section

${config.description}

## Custom Content

Add your custom sections here...
`;

  // Write file
  fs.writeFileSync(
    path.join(config.outputPath, "README.md"),
    readme
  );
}
```

---

## Tool Architecture

### Design Principles

1. **Modularity**: Each tool has a single, well-defined purpose
2. **Reusability**: Tools can be used independently or together
3. **Extensibility**: Easy to add new features and customize
4. **Reliability**: Comprehensive error handling
5. **User-Friendly**: Clear output and helpful error messages

### Code Organization

```typescript
// Common pattern in all tools

// 1. Imports and interfaces
import * as fs from "fs";
import * as path from "path";

interface Config {
  // Configuration structure
}

// 2. Helper functions
function createDirectory(path: string): void {
  // Implementation
}

// 3. Main generation logic
async function main() {
  try {
    // Step 1
    // Step 2
    // ...
    console.log("✅ Success!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// 4. Execute
main();
```

---

## Troubleshooting

### Common Issues

#### Tool execution fails

```bash
# Issue: TypeScript errors
# Solution: Ensure dependencies are installed
npm install

# Issue: ts-node not found
# Solution: Use npx
npx ts-node tools/generate-docs.ts
```

#### Generated project won't compile

```bash
# Issue: Missing dependencies
# Solution: Install dependencies in generated project
cd ../generated-project
npm install

# Issue: TypeScript errors
# Solution: Regenerate types
npm run clean
npm run compile
```

#### Documentation generation fails

```bash
# Issue: Cannot parse contracts
# Solution: Ensure contracts have valid NatSpec
# Check for proper /** */ comment blocks

# Issue: Missing output directory
# Solution: Tool creates it automatically
# Check file system permissions
```

---

## Performance Considerations

### Large Projects

For projects with many contracts:

```bash
# Generate docs for specific contracts only
# Modify generate-docs.ts to accept contract names

# Example implementation:
const args = process.argv.slice(2);
const specificContract = args[0];

if (specificContract) {
  // Generate docs only for specified contract
} else {
  // Generate all docs
}
```

### Optimization Tips

1. **Caching**: Cache generated templates
2. **Parallel Processing**: Use Promise.all for independent operations
3. **Incremental Updates**: Only regenerate changed files

---

## Best Practices

### When Using These Tools

1. **Version Control**: Commit before generating to track changes
2. **Test First**: Ensure tests pass before generation
3. **Review Output**: Check generated files for accuracy
4. **Customize**: Adapt templates to your specific needs
5. **Document**: Add comments explaining customizations

### Maintenance

1. **Keep Updated**: Update tool logic when adding new features
2. **Test Tools**: Create test cases for tool functionality
3. **Document Changes**: Update this README when modifying tools
4. **Share Improvements**: Contribute back to the community

---

## Additional Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [GitBook Documentation](https://docs.gitbook.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## Support

For issues or questions about these tools:
- Open a GitHub issue
- Join [Zama Discord](https://discord.gg/zama)
- Check the [DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md)

---

**Happy automating! 🤖**
