// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, inEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FHECounter
 * @notice A simple encrypted counter demonstrating basic FHEVM operations
 * @dev This contract demonstrates:
 *      - Encrypted state storage (euint32)
 *      - Access control with FHE.allow() and FHE.allowThis()
 *      - Encrypted arithmetic with FHE.add()
 *      - User decryption patterns
 *
 * @custom:category encryption
 * @custom:concept Basic FHE operations, access control, encrypted arithmetic
 */
contract FHECounter is Ownable {
    /// @notice The encrypted counter value
    euint32 private counter;

    /// @notice Emitted when the counter is incremented
    /// @param user Address that incremented the counter
    event CounterIncremented(address indexed user);

    /// @notice Emitted when the counter is decremented
    /// @param user Address that decremented the counter
    event CounterDecremented(address indexed user);

    constructor() Ownable(msg.sender) {
        // Initialize counter to 0
        counter = FHE.asEuint32(0);
        FHE.allowThis(counter);
    }

    /**
     * @notice Increment the counter by an encrypted value
     * @dev Demonstrates encrypted arithmetic and proper access control
     * @param encryptedValue The encrypted value to add to the counter
     *
     * Key concepts demonstrated:
     * - FHE.asEuint32() to convert input to encrypted type
     * - FHE.add() for encrypted addition
     * - FHE.allowThis() to grant contract access
     * - FHE.allow() to grant user access
     */
    function increment(inEuint32 calldata encryptedValue) external {
        euint32 value = FHE.asEuint32(encryptedValue);

        // Perform encrypted addition
        counter = FHE.add(counter, value);

        // Set access control
        FHE.allowThis(counter);
        FHE.allow(counter, msg.sender);

        emit CounterIncremented(msg.sender);
    }

    /**
     * @notice Increment the counter by 1
     * @dev Simplified increment function using a constant value
     *
     * Demonstrates:
     * - Encrypted arithmetic with constant values
     * - Efficient single-value increments
     */
    function incrementBy1() external {
        counter = FHE.add(counter, FHE.asEuint32(1));
        FHE.allowThis(counter);
        FHE.allow(counter, msg.sender);

        emit CounterIncremented(msg.sender);
    }

    /**
     * @notice Decrement the counter by an encrypted value
     * @dev Demonstrates encrypted subtraction
     * @param encryptedValue The encrypted value to subtract from the counter
     *
     * Note: This example omits underflow checks for simplicity.
     * In production, implement proper range validation.
     */
    function decrement(inEuint32 calldata encryptedValue) external {
        euint32 value = FHE.asEuint32(encryptedValue);

        // Perform encrypted subtraction
        counter = FHE.sub(counter, value);

        // Set access control
        FHE.allowThis(counter);
        FHE.allow(counter, msg.sender);

        emit CounterDecremented(msg.sender);
    }

    /**
     * @notice Get the encrypted counter value for decryption
     * @dev User can request their encrypted counter to decrypt client-side
     * @return The encrypted counter value
     *
     * Demonstrates user decryption pattern:
     * 1. User calls this function
     * 2. Receives encrypted value (handle)
     * 3. Decrypts client-side using their private key
     */
    function getCounter() external view returns (euint32) {
        return counter;
    }

    /**
     * @notice Reset the counter to zero (owner only)
     * @dev Demonstrates owner-only operations with encrypted values
     */
    function reset() external onlyOwner {
        counter = FHE.asEuint32(0);
        FHE.allowThis(counter);
    }
}
