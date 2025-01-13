// Import necessary dependencies if needed
// Uncomment if using HDWalletProvider for deployments to remote networks
// require('dotenv').config();
// const { MNEMONIC, PROJECT_ID } = process.env;
// const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  /**
   * Networks define how you connect to your Ethereum client and let you set the
   * defaults web3 uses to send transactions.
   * You can specify a specific network using the --network flag from the command line.
   * For example:
   * $ truffle test --network development
   */

  networks: {
    // Default local network for testing
    development: {
      host: '127.0.0.1',    // Localhost (default: none)
      port: 7545,           // Standard Ethereum port (default: none)
      network_id: '*',      // Match any network id (default: none)
      gas: 6721975,         // Gas limit for transactions (default: ~6700000)
      gasPrice: 20000000000 ,// Gas price (in Wei) (default: 100 gwei)
      from:'0x8b12636Be8EC3Cd0f2C54D860DB720868BF5FB91',
    },

    // Add more network configurations as needed. For example:
    // goerli: {
    //   provider: () => new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${PROJECT_ID}`),
    //   network_id: 5,   // Goerli's network id
    //   confirmations: 2,  // # of confirmations to wait between deployments
    //   timeoutBlocks: 200, // # of blocks before deployment times out
    //   skipDryRun: true  // Skip dry run before migrations
    // },
  },

  // Configure the Mocha testing framework
  mocha: {
    timeout: 100000 // Test timeout duration (increase if you have long-running tests)
  },

  // Configure Solidity compiler settings
  compilers: {
    solc: {
      version: "0.8.13", // Exact version of Solidity (make sure this matches your contract)
      optimizer: {
        enabled: true,   // Enable Solidity optimizer
        runs: 200        // Number of optimization runs (default is 200)
      }
    }
  },

  // Configure Truffle DB (currently disabled by default)
  db: {
    enabled: false // Set to 'true' to enable Truffle DB
  }
};
