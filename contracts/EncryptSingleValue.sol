// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, inEuint32 } from "@fhevm/solidity/lib/FHE.sol";

/**
 * @title EncryptSingleValue
 * @notice Demonstrates encrypting and storing a single value using FHEVM
 * @dev This example shows:
 *      - Basic encryption of user input
 *      - Proper access control patterns
 *      - Storage of encrypted values
 *      - Common pitfalls to avoid
 *
 * @custom:category encryption
 * @custom:concept Single value encryption, access control basics
 */
contract EncryptSingleValue {
    /// @notice Mapping of user addresses to their encrypted values
    mapping(address => euint32) private userValues;

    /// @notice Emitted when a user stores an encrypted value
    event ValueStored(address indexed user);

    /**
     * @notice Store an encrypted value for the caller
     * @dev Demonstrates the complete encryption workflow
     * @param encryptedValue The encrypted input value from the user
     *
     * ✅ CORRECT PATTERN:
     * 1. Accept encrypted input
     * 2. Convert to euint32
     * 3. Store in mapping
     * 4. Set access control (CRITICAL!)
     *
     * Common pitfalls:
     * ❌ Forgetting FHE.allowThis() - contract won't be able to use the value
     * ❌ Forgetting FHE.allow(value, user) - user won't be able to decrypt
     * ❌ Using plaintext instead of encrypted input
     */
    function storeValue(inEuint32 calldata encryptedValue) external {
        // Convert encrypted input to euint32
        euint32 value = FHE.asEuint32(encryptedValue);

        // Store the encrypted value
        userValues[msg.sender] = value;

        // ✅ CRITICAL: Set access control
        // Without these, the value cannot be used or decrypted
        FHE.allowThis(value);              // Allow contract to use this value
        FHE.allow(value, msg.sender);      // Allow user to decrypt this value

        emit ValueStored(msg.sender);
    }

    /**
     * @notice Get the encrypted value for the caller
     * @dev User receives encrypted value and decrypts client-side
     * @return The encrypted value (user must decrypt with their private key)
     *
     * User decryption workflow:
     * 1. Call this function to get encrypted value
     * 2. Receive the encrypted handle
     * 3. Use fhevmjs to decrypt client-side
     * 4. Result is plaintext only known to user
     */
    function getValue() external view returns (euint32) {
        return userValues[msg.sender];
    }

    /**
     * @notice Check if the caller has stored a value
     * @dev Can check if value is initialized without decrypting
     * @return True if user has stored a value
     */
    function hasValue() external view returns (bool) {
        return FHE.isInitialized(userValues[msg.sender]);
    }
}
