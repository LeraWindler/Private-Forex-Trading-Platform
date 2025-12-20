import { ethers } from "hardhat";

export interface Signers {
  alice: any;
  bob: any;
  carol: any;
  dave: any;
}

let signers: Signers;

export const getSigners = async (): Promise<Signers> => {
  if (!signers) {
    const eSigners = await ethers.getSigners();
    signers = {
      alice: eSigners[0],
      bob: eSigners[1],
      carol: eSigners[2],
      dave: eSigners[3],
    };
  }
  return signers;
};
