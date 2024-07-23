// Import Hardhat and SwisstronikJS functions
import * as hre from "hardhat";
import { encryptDataField } from "@swisstronik/utils";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { HttpNetworkConfig } from "hardhat/types";

/**
 * Send a shielded transaction to the Swisstronik blockchain.
 *
 * @param {object} signer - The signer object for sending the transaction.
 * @param {string} destination - The address of the contract to interact with.
 * @param {string} data - Encoded data for the transaction.
 * @param {number} value - Amount of value to send with the transaction.
 *
 * @returns {Promise} - The transaction object.
 */
const sendShieldedTransaction = async (signer: HardhatEthersSigner, destination: string, data: string, value: number): Promise<any> => {
  // Get the RPC link from the network configuration
  const rpclink = (hre.network.config as HttpNetworkConfig).url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpclink, data);

  // Construct and sign transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  // Address of the deployed contract
  const contractAddress = "0x3e8aEeC1e08Cdca8080f21932e62b370A72C7702";

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Construct a contract instance
  const contractFactory = await hre.ethers.getContractFactory("Swisstronik");
  const contract = contractFactory.attach(contractAddress);

  // Send a shielded transaction to set a message in the contract
  const functionName = "setMessage";
  const messageToSet = "Hello Swisstronik!!";
  const setMessageTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName, [messageToSet]),
    0
  );
  await setMessageTx.wait();

  //It should return a TransactionResponse object
  console.log("Transaction Receipt: ", setMessageTx);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});