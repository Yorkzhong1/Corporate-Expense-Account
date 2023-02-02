require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks:{
    goerli:{
      url:process.env.URL_GOERLI,
      accounts:[process.env.PRIVATE_KEY2],
    },
    local:{
      url:process.env.URL_LOCAL,
      accounts:[process.env.PTIVATE_KEY_LOCAL],
    },
  }
};
