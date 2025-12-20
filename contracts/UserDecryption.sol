// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, inEuint32 } from "@fhevm/solidity/lib/FHE.sol";

/**
 * @title UserDecryption
 * @notice Demonstrates user decryption patterns in FHEVM
 * @dev Shows:
 *      - How users decrypt their own data
 *      - Access control requirements for decryption
 *      - Multiple decryption patterns
 *      - Privacy guarantees
 *
 * @custom:category user-decryption
 * @custom:concept Client-side decryption, privacy preservation
 */
contract UserDecryption {
    /// @notice User's private encrypted value
    mapping(address => euint32) private userSecrets;

    /// @notice Shared encrypted value (all users can decrypt)
    euint32 private sharedValue;

    /// @notice Owner address
    address public owner;

    event SecretStored(address indexed user);
    event SharedValueSet(uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Store a secret value
     * @dev Only the user can decrypt this value
     * @param encryptedSecret The secret to store
     *
     * Privacy guarantee:
     * - Value is encrypted on-chain
     * - Only user with proper permissions can decrypt
     * - Even contract owner cannot see plaintext
     */
    function storeSecret(inEuint32 calldata encryptedSecret) external {
        euint32 secret = FHE.asEuint32(encryptedSecret);

        userSecrets[msg.sender] = secret;

        // ✅ Grant permissions
        FHE.allowThis(secret);
        FHE.allow(secret, msg.sender);  // Only this user can decrypt

        emit SecretStored(msg.sender);
    }

    /**
     * @notice Get your own secret for decryption
     * @dev User decryption pattern:
     *      1. Call this function
     *      2. Receive encrypted handle
     *      3. Use fhevmjs client-side to decrypt
     *      4. Plaintext only revealed to user
     *
     * @return The encrypted secret (decrypt client-side)
     *
     * Example client-side code:
     * ```javascript
     * // Get encrypted value
     * const encryptedSecret = await contract.getMySecret();
     *
     * // Decrypt using fhevmjs
     * const { publicKey, privateKey } = instance.generateKeypair();
     * const eip712 = instance.createEIP712(publicKey, contractAddress);
     * const signature = await signer._signTypedData(...eip712);
     * const plaintext = await instance.decrypt(contractAddress, encryptedSecret);
     * ```
     */
    function getMySecret() external view returns (euint32) {
        return userSecrets[msg.sender];
    }

    /**
     * @notice Set a shared value (owner only)
     * @dev Demonstrates value that multiple users can decrypt
     * @param encryptedValue The value to share
     */
    function setSharedValue(inEuint32 calldata encryptedValue) external {
        require(msg.sender == owner, "Only owner");

        euint32 value = FHE.asEuint32(encryptedValue);
        sharedValue = value;

        FHE.allowThis(value);
        // Grant access to specific users as needed
        // FHE.allow(value, user1);
        // FHE.allow(value, user2);

        emit SharedValueSet(block.timestamp);
    }

    /**
     * @notice Get the shared value
     * @dev Users with permission can decrypt this
     * @return The encrypted shared value
     *
     * Note: User needs FHE.allow() permission to decrypt
     */
    function getSharedValue() external view returns (euint32) {
        return sharedValue;
    }

    /**
     * @notice Grant a user permission to decrypt shared value
     * @dev Owner can grant decryption permissions
     * @param user Address to grant permission to
     */
    function grantSharedAccess(address user) external {
        require(msg.sender == owner, "Only owner");
        FHE.allow(sharedValue, user);
    }

    /**
     * @notice Check if user has stored a secret
     * @dev Can check without decrypting
     * @return True if user has a secret
     */
    function hasSecret() external view returns (bool) {
        return FHE.isInitialized(userSecrets[msg.sender]);
    }
}
