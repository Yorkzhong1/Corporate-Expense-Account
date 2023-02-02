//Mapping:0xb3e5f768601F1CD9561Ec55A0ab17CB71AbDc391
//Corporate Account: 0xf080756540aF479E786B9Ea01EFE3ed8FC96Adc4
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
// constructor(address[] memory _mgrs ,address _mappingContract) 

  const mgrs=['0x2e5e78063F7490952C1b093D7492B645ea1De696','0x1ad7fa3Fbc4CE0778A1F6545ccB53Ed5C8CD0244']
  const mapping = '0xb3e5f768601F1CD9561Ec55A0ab17CB71AbDc391'

  const Contract = await hre.ethers.getContractFactory("CorporateAccount");
  const contract = await Contract.deploy(mgrs,mapping);

  await contract.deployed();

  // const Mapping = await hre.ethers.getContractFactory("Mapping");
  // const mapping = await Mapping.deploy();

  // await mapping.deployed();

  console.log(
    `Contract deployed to ${contract.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
