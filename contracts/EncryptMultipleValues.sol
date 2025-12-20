// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint64, euint8, inEuint32, inEuint64, inEuint8 } from "@fhevm/solidity/lib/FHE.sol";

/**
 * @title EncryptMultipleValues
 * @notice Demonstrates encrypting and managing multiple encrypted values
 * @dev Shows how to:
 *      - Handle multiple encrypted fields
 *      - Use different encrypted types
 *      - Manage access control for multiple values
 *      - Organize encrypted data in structs
 *
 * @custom:category encryption
 * @custom:concept Multi-field encryption, struct usage, type selection
 */
contract EncryptMultipleValues {
    /**
     * @notice User profile with multiple encrypted fields
     * @dev Demonstrates organizing encrypted data in structs
     */
    struct UserProfile {
        euint64 balance;      // Large values (up to 2^64-1)
        euint32 score;        // Medium values (up to 2^32-1)
        euint8 level;         // Small values (0-255)
        bool isActive;        // Plaintext (not all data needs encryption)
    }

    /// @notice Mapping of user addresses to their encrypted profiles
    mapping(address => UserProfile) private profiles;

    /// @notice Emitted when a profile is created or updated
    event ProfileUpdated(address indexed user);

    /**
     * @notice Create or update user profile with encrypted values
     * @dev Demonstrates handling multiple encrypted inputs
     * @param encryptedBalance Large value (balance, amount, etc.)
     * @param encryptedScore Medium value (score, count, etc.)
     * @param encryptedLevel Small value (level, tier, category)
     *
     * Type selection guide:
     * - euint8: 0-255 (flags, levels, categories)
     * - euint32: 0-4,294,967,295 (scores, counts, prices)
     * - euint64: 0-2^64-1 (balances, large amounts)
     *
     * ✅ CORRECT: Choose smallest type that fits your range
     * ❌ INCORRECT: Always using euint64 wastes gas
     */
    function updateProfile(
        inEuint64 calldata encryptedBalance,
        inEuint32 calldata encryptedScore,
        inEuint8 calldata encryptedLevel
    ) external {
        // Convert all encrypted inputs
        euint64 balance = FHE.asEuint64(encryptedBalance);
        euint32 score = FHE.asEuint32(encryptedScore);
        euint8 level = FHE.asEuint8(encryptedLevel);

        // Store in struct
        profiles[msg.sender] = UserProfile({
            balance: balance,
            score: score,
            level: level,
            isActive: true  // Plaintext field
        });

        // ✅ Set access control for EACH encrypted field
        // This is critical - each encrypted value needs permissions
        FHE.allowThis(balance);
        FHE.allow(balance, msg.sender);

        FHE.allowThis(score);
        FHE.allow(score, msg.sender);

        FHE.allowThis(level);
        FHE.allow(level, msg.sender);

        emit ProfileUpdated(msg.sender);
    }

    /**
     * @notice Get encrypted balance
     * @dev Returns encrypted value for client-side decryption
     * @return The encrypted balance
     */
    function getBalance() external view returns (euint64) {
        return profiles[msg.sender].balance;
    }

    /**
     * @notice Get encrypted score
     * @return The encrypted score
     */
    function getScore() external view returns (euint32) {
        return profiles[msg.sender].score;
    }

    /**
     * @notice Get encrypted level
     * @return The encrypted level
     */
    function getLevel() external view returns (euint8) {
        return profiles[msg.sender].level;
    }

    /**
     * @notice Get plaintext active status
     * @dev Not all data needs to be encrypted
     * @return True if profile is active
     */
    function isActive() external view returns (bool) {
        return profiles[msg.sender].isActive;
    }

    /**
     * @notice Update just the balance
     * @dev Shows how to update individual encrypted fields
     * @param encryptedBalance New balance value
     */
    function updateBalance(inEuint64 calldata encryptedBalance) external {
        euint64 balance = FHE.asEuint64(encryptedBalance);

        profiles[msg.sender].balance = balance;

        FHE.allowThis(balance);
        FHE.allow(balance, msg.sender);

        emit ProfileUpdated(msg.sender);
    }

    /**
     * @notice Deactivate profile
     * @dev Shows mixing encrypted and plaintext operations
     */
    function deactivate() external {
        profiles[msg.sender].isActive = false;
        emit ProfileUpdated(msg.sender);
    }
}
