# Contributing to FHEVM Private Forex Trading

Thank you for your interest in contributing to this FHEVM example project! This guide will help you get started.

## 🎯 Project Goals

This project is part of the **Zama FHEVM Bounty Program December 2025** and serves as a comprehensive example of:

- Privacy-preserving smart contracts using FHE
- Best practices for FHEVM development
- Educational resource for developers learning FHEVM
- Template for building similar privacy-focused applications

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Basic understanding of Solidity and TypeScript
- Familiarity with Hardhat

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/fhevm-private-forex-trading
   cd fhevm-private-forex-trading
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Compile contracts**
   ```bash
   npm run compile
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 📝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

- **Title**: Clear, descriptive title
- **Description**: Detailed description of the bug
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Node version, OS, network used
- **Screenshots**: If applicable

**Bug Report Template:**
```markdown
## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Step one
2. Step two
3. ...

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Node version:
- OS:
- Network:

## Additional Context
[Any other relevant information]
```

### Suggesting Enhancements

Enhancement suggestions are welcome! Please create an issue with:

- **Clear title** describing the enhancement
- **Motivation**: Why is this enhancement needed?
- **Detailed description** of the proposed feature
- **Use cases**: How would this be used?
- **Alternatives**: Any alternative solutions you've considered

### Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Follow the coding style (see below)
   - Add tests for new features
   - Update documentation as needed
   - Ensure all tests pass

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with X"
   ```

   **Commit Message Convention:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `test:` Adding or updating tests
   - `refactor:` Code refactoring
   - `style:` Code style changes
   - `chore:` Maintenance tasks

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Link related issues

**Pull Request Template:**
```markdown
## Description
[Describe your changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Test improvement

## Related Issues
Fixes #[issue number]

## How Has This Been Tested?
[Describe how you tested your changes]

## Checklist
- [ ] My code follows the project's coding style
- [ ] I have added tests that prove my fix/feature works
- [ ] All new and existing tests pass
- [ ] I have updated the documentation
- [ ] My commits follow the commit message convention
```

## 💻 Coding Standards

### Solidity

**Style Guide:**
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use 4 spaces for indentation
- Maximum line length: 120 characters
- Add comprehensive NatSpec comments

**NatSpec Requirements:**
```solidity
/**
 * @notice User-friendly description
 * @dev Technical details for developers
 * @param paramName Parameter description
 * @return Description of return value
 * @custom:security Security considerations
 * @custom:example Usage example
 */
function myFunction(uint256 paramName) external returns (uint256) {
    // Implementation
}
```

**FHEVM Best Practices:**
- Always use `FHE.allowThis()` for contract access
- Always use `FHE.allow(data, user)` for user access
- Document which encrypted types are used and why
- Explain access control patterns clearly

### TypeScript

**Style Guide:**
- Follow [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- Use 2 spaces for indentation
- Maximum line length: 120 characters
- Add TSDoc comments for all test functions

**TSDoc Requirements:**
```typescript
/**
 * @notice Clear description of what the test does
 * @dev Technical details about the test
 * @custom:pattern FHEVM pattern being tested
 */
it("should perform expected behavior", async function () {
  // Test implementation
});
```

### Code Formatting

**Before committing:**
```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Testing

**All contributions must include tests:**

1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test feature workflows
3. **Edge Cases**: Test boundary conditions
4. **Error Cases**: Test error handling

**Test Requirements:**
- All tests must pass: `npm test`
- Maintain or improve coverage: `npm run test:coverage`
- Add descriptive test names
- Include TSDoc comments explaining what's tested

**Example Test Structure:**
```typescript
describe("Feature Name", function () {
  beforeEach(async function () {
    // Setup
  });

  it("should handle normal case", async function () {
    // Test normal operation
  });

  it("should handle edge case", async function () {
    // Test edge case
  });

  it("should reject invalid input", async function () {
    // Test error case
  });
});
```

## 📚 Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing functionality
- Fix bugs that affect usage
- Add new examples or patterns

### Documentation Files

- **README.md**: Main project documentation
- **Contract Files**: NatSpec comments
- **Test Files**: TSDoc comments
- **docs/**: Generated documentation

### Generating Documentation

```bash
npm run docs:generate
```

## 🔍 Review Process

### What We Look For

1. **Code Quality**
   - Follows coding standards
   - Well-structured and readable
   - Proper error handling

2. **Testing**
   - Adequate test coverage
   - Tests pass consistently
   - Edge cases covered

3. **Documentation**
   - Clear NatSpec/TSDoc comments
   - Updated README if needed
   - Examples where appropriate

4. **FHEVM Patterns**
   - Correct use of FHE operations
   - Proper access control
   - Security considerations addressed

### Timeline

- Initial review: Within 3-5 days
- Follow-up reviews: Within 1-2 days
- Merge: After approval from maintainers

## 🎓 Learning Resources

### FHEVM Documentation
- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [Zama Blog](https://www.zama.ai/blog)
- [FHEVM Examples](https://github.com/zama-ai/fhevm)

### Development Tools
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Chai Assertion Library](https://www.chaijs.com/)

### Community
- [Zama Discord](https://discord.gg/zama)
- [GitHub Discussions](https://github.com/zama-ai/fhevm/discussions)

## ❓ Questions?

- **General Questions**: Open a GitHub Discussion
- **Bug Reports**: Create an Issue
- **Security Issues**: Email security@example.com (do not create public issues)
- **Chat**: Join Zama Discord

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project documentation

Thank you for contributing to the FHEVM community! 🎉

---

**Questions about contributing?** Feel free to ask in GitHub Discussions or Discord!
