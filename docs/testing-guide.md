# Testing Guide

This guide covers the test suite and testing patterns used in this FHEVM example.

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Test Structure

The test suite is organized into logical sections:

- **Deployment Tests**: Verify initial contract state
- **Registration Tests**: Test user registration with encrypted data
- **Session Management Tests**: Verify trading session lifecycle
- **Order Placement Tests**: Test private order creation
- **Execution Tests**: Verify order processing
- **Edge Cases**: Test error handling and boundary conditions

## Key Testing Patterns

### Testing Encrypted Data

```typescript
// Encrypted values are created but not directly readable in tests
await contract.registerTrader(initialBalance);
// We verify state changes and events, not encrypted values
```

### Testing Access Control

```typescript
// Verify that unauthorized access is prevented
await expect(
  contract.connect(unauthorizedUser).privilegedFunction()
).to.be.revertedWith("Not authorized");
```

### Testing Time-Dependent Logic

```typescript
// Use Hardhat network helpers to manipulate time
await time.increase(SESSION_DURATION + 1);
await contract.executeOrders();
```

