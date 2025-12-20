# FHEVM Concepts Guide

## Introduction to FHEVM

Fully Homomorphic Encryption (FHE) allows computations to be performed on encrypted data without decrypting it. FHEVM brings this capability to smart contracts, enabling truly private applications on the blockchain.

## Core Concepts

### 1. Encrypted Data Types

FHEVM provides encrypted versions of standard Solidity types:

- `euint8`: Encrypted 8-bit unsigned integer
- `euint16`: Encrypted 16-bit unsigned integer
- `euint32`: Encrypted 32-bit unsigned integer
- `euint64`: Encrypted 64-bit unsigned integer
- `ebool`: Encrypted boolean

**Example:**
```solidity
euint64 encryptedBalance = FHE.asEuint64(userBalance);
```

### 2. Access Control

Access to encrypted data must be explicitly granted using `FHE.allow()`:

**Pattern:**
```solidity
// Grant access to contract
FHE.allowThis(encryptedValue);

// Grant access to user
FHE.allow(encryptedValue, userAddress);
```

### 3. Encrypted Operations

FHEVM provides functions to operate on encrypted values:

- `FHE.add(a, b)`: Add two encrypted values
- `FHE.sub(a, b)`: Subtract encrypted values
- `FHE.mul(a, b)`: Multiply encrypted values
- `FHE.eq(a, b)`: Compare encrypted values for equality
- `FHE.lt(a, b)`: Less than comparison
- `FHE.gt(a, b)`: Greater than comparison

**Example:**
```solidity
euint32 newTotal = FHE.add(currentTotal, FHE.asEuint32(1));
```

### 4. User Decryption

Users can decrypt their own data client-side:

**Pattern:**
```solidity
function getMyEncryptedBalance() external view returns (euint64) {
    return balances[msg.sender];
}
```

The user receives the encrypted value and decrypts it with their private key on the client side.

### 5. Privacy Patterns

#### Private Storage
Store sensitive data encrypted:
```solidity
mapping(address => euint64) private balances;
```

#### Private Computation
Compute on encrypted data:
```solidity
function transfer(euint64 encryptedAmount) external {
    balances[msg.sender] = FHE.sub(balances[msg.sender], encryptedAmount);
    balances[recipient] = FHE.add(balances[recipient], encryptedAmount);
}
```

#### Conditional Logic
Use encrypted booleans:
```solidity
ebool hasEnough = FHE.gte(balance, amount);
```

## Best Practices

1. **Always Set Access Control**: Call `FHE.allowThis()` for contract access
2. **Validate Before Encrypting**: Check plaintext inputs before encryption
3. **Use Appropriate Types**: Choose the smallest type that fits your data
4. **Document Access Patterns**: Clearly document who can access what data
5. **Test Thoroughly**: Test both success and failure cases

## Common Pitfalls

1. **Forgetting Access Control**: Always set `FHE.allow()` after creating encrypted values
2. **Type Mismatches**: Ensure operations use compatible encrypted types
3. **Gas Costs**: FHE operations are more expensive than plaintext
4. **Comparing Encrypted Values**: Use `FHE.eq()`, not `==`

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
