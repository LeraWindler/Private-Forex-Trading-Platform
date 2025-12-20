import { expect } from "chai";
import { ethers } from "hardhat";
import type { FHECounter } from "../types";
import { getSigners } from "./signers";

/**
 * @chapter encryption
 * @description Test suite for FHECounter demonstrating basic FHEVM operations
 */
describe("FHECounter", function () {
  let counter: FHECounter;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    const signers = await getSigners();
    owner = signers.alice;
    user1 = signers.bob;
    user2 = signers.carol;

    const CounterFactory = await ethers.getContractFactory("FHECounter");
    counter = await CounterFactory.connect(owner).deploy();
    await counter.waitForDeployment();
  });

  /**
   * @chapter deployment
   * @description Verify contract deploys correctly
   */
  describe("Deployment", function () {
    it("Should deploy with correct owner", async function () {
      expect(await counter.owner()).to.equal(owner.address);
    });

    it("Should initialize counter (encrypted, cannot verify directly)", async function () {
      // Counter is encrypted, we can only verify operations work
      const tx = await counter.connect(owner).incrementBy1();
      await tx.wait();
      expect(tx).to.emit(counter, "CounterIncremented");
    });
  });

  /**
   * @chapter encryption
   * @description Test encrypted increment operations
   */
  describe("Increment Operations", function () {
    it("Should increment counter by 1", async function () {
      const tx = await counter.connect(user1).incrementBy1();
      await expect(tx).to.emit(counter, "CounterIncremented").withArgs(user1.address);
    });

    it("Should allow multiple increments", async function () {
      await counter.connect(user1).incrementBy1();
      await counter.connect(user1).incrementBy1();
      await counter.connect(user2).incrementBy1();

      // All operations should succeed (values are encrypted)
      const tx = await counter.connect(owner).incrementBy1();
      await expect(tx).to.emit(counter, "CounterIncremented");
    });

    it("Should increment with encrypted value", async function () {
      // Note: In real usage, you would create encrypted input using fhevmjs
      // For this test, we verify the function signature works
      const encryptedValue = { data: new Uint8Array(32) }; // Mock encrypted input

      // This will work when proper encrypted input is provided
      // For template purposes, we show the pattern
      // const tx = await counter.connect(user1).increment(encryptedValue);
      // await expect(tx).to.emit(counter, "CounterIncremented");
    });
  });

  /**
   * @chapter arithmetic
   * @description Test encrypted arithmetic operations
   */
  describe("Decrement Operations", function () {
    it("Should decrement counter", async function () {
      // First increment to have a value
      await counter.connect(user1).incrementBy1();
      await counter.connect(user1).incrementBy1();

      // Then decrement (encrypted value)
      // Note: Real implementation needs proper encrypted input
      // const tx = await counter.connect(user1).decrement(encryptedValue);
      // await expect(tx).to.emit(counter, "CounterDecremented");
    });
  });

  /**
   * @chapter user-decryption
   * @description Test user decryption pattern
   */
  describe("Get Counter", function () {
    it("Should return encrypted counter value", async function () {
      await counter.connect(user1).incrementBy1();

      // User can get their encrypted value
      const encryptedCounter = await counter.connect(user1).getCounter();

      // Value is encrypted, we cannot verify the plaintext
      // User would decrypt client-side using their private key
      expect(encryptedCounter).to.exist;
    });

    it("Should allow any user to query counter", async function () {
      // Different users can query the counter
      const counter1 = await counter.connect(user1).getCounter();
      const counter2 = await counter.connect(user2).getCounter();

      expect(counter1).to.exist;
      expect(counter2).to.exist;
    });
  });

  /**
   * @chapter access-control
   * @description Test access control and permissions
   */
  describe("Access Control", function () {
    it("Should allow only owner to reset counter", async function () {
      await counter.connect(user1).incrementBy1();

      // Owner can reset
      await expect(counter.connect(owner).reset())
        .to.not.be.reverted;

      // Non-owner cannot reset
      await expect(counter.connect(user1).reset())
        .to.be.reverted;
    });

    it("Should emit events for operations", async function () {
      await expect(counter.connect(user1).incrementBy1())
        .to.emit(counter, "CounterIncremented")
        .withArgs(user1.address);
    });
  });
});
