const { ethers } = require('ethers');

// Replace with your RPC URL
const rpcURL = 'https://json-rpc.testnet.swisstronik.com';
const provider = new ethers.JsonRpcProvider(rpcURL);

// Replace with your transaction hash
const txHash = '0x9a92e0f4ac588d8011692250761c58b31609f5fb764cbf1ff16f52a46d8204a3';

async function getTransactionDetails() {
  try {
    // Query transaction details
    const transaction = await provider.getTransaction(txHash);

    if (transaction) {
      console.log('Transaction Details:', transaction);
    } else {
      console.log('Transaction not found');
    }
  } catch (error) {
    console.error('Error fetching transaction details:', error);
  }
}

getTransactionDetails();