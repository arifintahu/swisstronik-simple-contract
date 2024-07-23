// Import Hardhat and SwisstronikJS functions
import * as hre from "hardhat";
import { encryptDataField, decryptNodeResponse } from "@swisstronik/utils";
import { HardhatEthersProvider } from "@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider";
import { JsonRpcProvider } from "ethers";
import { HttpNetworkConfig } from "hardhat/types";

/**
 * Send a shielded query/call to the Swisstronik blockchain.
 *
 * @param {object} provider - The provider object for making the call.
 * @param {string} destination - The address of the contract to call.
 * @param {string} data - Encoded data for the function call.
 *
 * @returns {Uint8Array} - Encrypted response from the blockchain.
 */
const sendShieldedQuery = async (provider: JsonRpcProvider | HardhatEthersProvider, destination: string, data: string): Promise<Uint8Array> => {
  // Get the RPC link from the network configuration
  const rpclink = (hre.network.config as HttpNetworkConfig).url;

  // Encrypt the call data using the SwisstronikJS function
  const [encryptedData, usedEncryptedKey] = await encryptDataField(
    rpclink,
    data
  );

  // Execute the call/query using the provider
  const response = await provider.call({
    to: destination,
    data: encryptedData,
  });

  // Decrypt the call result using SwisstronikJS function
  return await decryptNodeResponse(rpclink, response, usedEncryptedKey);
};

async function main() {
  // Address of the deployed contract
  const contractAddress = "0x3e8aEeC1e08Cdca8080f21932e62b370A72C7702";

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Construct a contract instance
  const contractFactory = await hre.ethers.getContractFactory("Swisstronik");
  const contract = contractFactory.attach(contractAddress);

  // Send a shielded query to retrieve data from the contract
  const functionName = "getMessage";
  const responseMessage = await sendShieldedQuery(
    signer.provider,
    contractAddress,
    contract.interface.encodeFunctionData(functionName)
  );

  // Decode the Uint8Array response into a readable string
  console.log(
    "Decoded response:",
    contract.interface.decodeFunctionResult(functionName, responseMessage)[0]
  );
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});