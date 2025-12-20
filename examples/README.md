# FHEVM Examples

This directory contains generated examples demonstrating various FHEVM concepts and patterns.

## Overview

Each subdirectory is a complete, standalone Hardhat project that can be cloned and used immediately. These examples are generated using the automation tools in `tools/`.

## Available Examples

### Basic Examples

#### 1. FHE Counter
**Location**: Use base template `fhevm-hardhat-template/`
**Demonstrates**: Basic encrypted counter, access control, encrypted arithmetic
**Key Concepts**:
- Encrypted state storage (`euint32`)
- `FHE.add()` for encrypted arithmetic
- `FHE.allowThis()` and `FHE.allow()` patterns
- User decryption workflow

**Generate standalone**:
```bash
npm run example:create -- --name "FHECounter" --category "encryption"
```

#### 2. Encrypt Single Value
**File**: `contracts/EncryptSingleValue.sol`
**Demonstrates**: Encrypting and storing a single value
**Key Concepts**:
- Basic encryption workflow
- Proper access control setup
- Common pitfalls to avoid
- User decryption pattern

**Generate standalone**:
```bash
npm run example:create -- --name "EncryptSingleValue" --category "encryption"
```

#### 3. Encrypt Multiple Values
**File**: `contracts/EncryptMultipleValues.sol`
**Demonstrates**: Managing multiple encrypted fields
**Key Concepts**:
- Different encrypted types (euint8, euint32, euint64)
- Type selection guide
- Struct usage with encrypted data
- Individual field access control

**Generate standalone**:
```bash
npm run example:create -- --name "EncryptMultipleValues" --category "encryption"
```

#### 4. User Decryption
**File**: `contracts/UserDecryption.sol`
**Demonstrates**: User decryption patterns
**Key Concepts**:
- Client-side decryption
- Privacy guarantees
- Shared value patterns
- Permission management

**Generate standalone**:
```bash
npm run example:create -- --name "UserDecryption" --category "user-decryption"
```

### Advanced Examples

#### 5. Private Forex Trading
**File**: `contracts/PrivateForexTrading.sol`
**Demonstrates**: Complex multi-session trading platform
**Key Concepts**:
- Multi-field encryption
- Session management
- Encrypted order placement
- Encrypted arithmetic in production
- Complex access control

**Generate standalone**:
```bash
npm run example:create -- --name "PrivateForexTrading" --category "advanced"
```

## Generating Examples

### Generate Single Example

Create a standalone repository for any example:

```bash
npm run example:create -- --name "ExampleName" --category "category"
```

**Categories**:
- `encryption` - Basic encryption examples
- `access-control` - Access control patterns
- `user-decryption` - User decryption examples
- `arithmetic` - FHE arithmetic operations
- `advanced` - Complex use cases

### Generate Category Project

Create a project with multiple related examples:

```bash
npm run category:create -- trading ./output/fhevm-trading-examples
```

**Available Categories**:
- `trading` - Private trading examples
- `advanced` - Advanced FHEVM patterns

## Using Generated Examples

Each generated example includes:

- ✅ Complete Hardhat setup
- ✅ Smart contracts with documentation
- ✅ Comprehensive test suite
- ✅ Deployment scripts
- ✅ README with instructions
- ✅ Configuration files
- ✅ Git repository initialization

### Quick Start with Generated Example

```bash
# 1. Generate example
npm run example:create -- --name "FHECounter" --category "encryption"

# 2. Navigate to generated project
cd ../fhevm-fhecounter

# 3. Install dependencies
npm install

# 4. Compile
npm run compile

# 5. Test
npm test

# 6. Deploy locally
npm run node  # Terminal 1
npm run deploy  # Terminal 2
```

## Example Structure

Each generated example follows this structure:

```
fhevm-example-name/
├── contracts/          # Smart contracts
├── test/              # Test suites
├── scripts/           # Deployment scripts
├── tools/             # Automation tools (copied)
├── docs/              # Documentation
├── hardhat.config.ts  # Hardhat configuration
├── package.json       # Dependencies
└── README.md          # Example-specific guide
```

## Concepts Demonstrated

### 1. Encryption Patterns

**Basic Encryption**:
```solidity
euint32 value = FHE.asEuint32(encryptedInput);
```

**Multi-Field Encryption**:
```solidity
struct Profile {
    euint64 balance;
    euint32 score;
    euint8 level;
}
```

### 2. Access Control

**Contract Access**:
```solidity
FHE.allowThis(encryptedValue);
```

**User Access**:
```solidity
FHE.allow(encryptedValue, userAddress);
```

**Temporary Access**:
```solidity
FHE.allowTransient(encryptedValue, userAddress);
```

### 3. Encrypted Arithmetic

**Addition**:
```solidity
result = FHE.add(a, b);
```

**Subtraction**:
```solidity
result = FHE.sub(a, b);
```

**Multiplication**:
```solidity
result = FHE.mul(a, b);
```

### 4. User Decryption

**On-Chain (Contract)**:
```solidity
function getValue() external view returns (euint32) {
    return userValues[msg.sender];
}
```

**Off-Chain (Client)**:
```javascript
const encrypted = await contract.getValue();
const plaintext = await instance.decrypt(contractAddress, encrypted);
```

## Best Practices

### ✅ DO

1. **Always set access control**:
   ```solidity
   FHE.allowThis(value);
   FHE.allow(value, user);
   ```

2. **Choose appropriate types**:
   - `euint8` for 0-255
   - `euint32` for medium values
   - `euint64` for large values

3. **Validate inputs**:
   ```solidity
   require(amount > 0, "Amount must be positive");
   ```

4. **Document your code**:
   Use NatSpec comments for all functions

### ❌ DON'T

1. **Don't forget access control**:
   ```solidity
   // ❌ Missing FHE.allow() - user can't decrypt
   value = FHE.asEuint32(input);
   ```

2. **Don't use wrong operators**:
   ```solidity
   // ❌ Can't use == on encrypted values
   if (encryptedA == encryptedB) { }

   // ✅ Use FHE.eq()
   ebool isEqual = FHE.eq(encryptedA, encryptedB);
   ```

3. **Don't mix types incorrectly**:
   ```solidity
   // ❌ Type mismatch
   euint32 a = ...;
   euint64 b = ...;
   result = FHE.add(a, b); // Error
   ```

## Documentation

Each example includes:

- **Contract Documentation**: NatSpec comments in Solidity
- **Test Documentation**: TSDoc comments in TypeScript
- **Generated Docs**: Auto-generated from code (run `npm run docs:generate`)
- **README**: Example-specific guide

## Learning Path

Recommended order for learning:

1. **FHE Counter** - Basic concepts
2. **Encrypt Single Value** - Encryption fundamentals
3. **Encrypt Multiple Values** - Type selection and structs
4. **User Decryption** - Decryption patterns
5. **Private Forex Trading** - Complex real-world application

## Testing Examples

### Run Tests

```bash
# All tests
npm test

# Specific example
npx hardhat test test/ExampleName.test.ts

# With coverage
npm run test:coverage

# With gas reporting
REPORT_GAS=true npm test
```

### Test Patterns

Examples include tests for:
- ✅ Deployment and initialization
- ✅ Basic functionality
- ✅ Access control
- ✅ Edge cases
- ✅ Error handling
- ✅ Integration scenarios

## Deploying Examples

### Local Deployment

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy
npm run deploy
```

### Testnet Deployment

```bash
# Configure .env
ZAMA_RPC_URL=https://devnet.zama.ai
PRIVATE_KEY=your_private_key

# Deploy
npm run deploy:zama
```

## Contributing Examples

To add a new example:

1. **Create Contract**: Add to `contracts/`
2. **Create Tests**: Add to `test/`
3. **Document**: Add NatSpec and TSDoc comments
4. **Update Tools**: Add to automation tools configuration
5. **Generate Docs**: Run `npm run docs:generate`
6. **Test**: Verify standalone generation works

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Discord](https://discord.gg/zama)
- [Base Template Guide](../BASE_TEMPLATE_GUIDE.md)
- [Developer Guide](../DEVELOPER_GUIDE.md)
- [Tools Documentation](../tools/README.md)

## Support

For questions or issues:
- Check the main [README.md](../README.md)
- Review [QUICKSTART.md](../QUICKSTART.md)
- See [DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md)
- Join [Zama Discord](https://discord.gg/zama)

---

**Ready to start learning? Pick an example and generate it!** 🚀
