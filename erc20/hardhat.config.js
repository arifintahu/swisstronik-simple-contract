require("@nomicfoundation/hardhat-toolbox");
const dotenv = require('dotenv'); 
dotenv.config();

module.exports = {
  defaultNetwork: "swisstronik",
  solidity: "0.8.19",
  networks: {
    swisstronik: {
      url: "https://json-rpc.testnet.swisstronik.com/",
      accounts: [process.env.ACCOUNT_KEY],
    },
  },
};