const hre = require("hardhat");
const dotenv = require('dotenv'); 
dotenv.config();

async function main() {
  const contract = await hre.ethers.deployContract("MyToken", [process.env.ACCOUNT_ADDRESS]);

  await contract.waitForDeployment();

  console.log(`deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});