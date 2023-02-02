const hre = require("hardhat");
const ADD = '0x6fB690c1dcA1BFf893166b842Cf669C1EE6B0ceD'

async function main() {
    const contract = await hre.ethers.getContractAt("CorporateAccount",ADD);
    //function addRole(string memory _role, uint _budget) public onlyOwner{
    const tx2=await contract.addRole("Sales",500)
    console.log('tx submited...')
    tx2.wait()
    console.log('tx confirmed')

    const tx = await contract.roleProfile(0);
    console.log('roles',tx)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
