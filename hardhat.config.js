require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path: '.env'});
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require("solidity-coverage");
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

// Prints the Celo accounts associated with the mnemonic in .env
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
        url: "http://127.0.0.1:8545"
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.MNEMONIC],
      chainId: 44787,
   },
    celo: {
      url: "https://forno.celo.org",
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/52752'/0'/0"
      },
      chainId: 42220
    },     
  },
  solidity: "0.8.4",
};