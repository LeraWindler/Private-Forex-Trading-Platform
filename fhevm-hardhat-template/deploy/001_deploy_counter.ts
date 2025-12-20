import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedCounter = await deploy("FHECounter", {
    from: deployer,
    log: true,
  });

  console.log(`FHECounter contract deployed at: ${deployedCounter.address}`);
};

export default func;
func.id = "deploy_fhe_counter";
func.tags = ["FHECounter"];
