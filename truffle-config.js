const HDWalletProvider = require("@truffle/hdwallet-provider")
const dotenv = require('dotenv');
dotenv.config();
let apiKey = process.env.POLYGON_ETHERSCAN_API_KEY;
let apiKeyEtherScan = process.env.ETHERSCAN_API_KEY;
let apiKeyBSCSCANAPIKEY = process.env.BSC_ETHERSCAN_API_KEY;
module.exports = {
	api_keys: {
    etherscan: apiKeyEtherScan,
    polygonscan: apiKey,
    bscscan: apiKeyBSCSCANAPIKEY
  },
	plugins: [
    'truffle-plugin-verify'
  ],
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "*"
    // },    
    eth: {
      provider: function() { 
        return new HDWalletProvider(process.env.MNEMONIC, "https://mainnet.infura.io/v3/8da2357d709445f69b2f9df0a7329295");
       },
       network_id: 1,
       gas: 8000000,
       gasPrice: 63283078817                 
    },
    mumbai: {
        provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://matic-mumbai.chainstacklabs.com`),
        network_id: 80001,
        confirmations: 2,
        timeoutBlocks: 200,
        skipDryRun: true,
        gas: 7000000,
        gasPrice: 101477486290
    },
    rinkeby: {
      provider: function() { 
       return new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/8da2357d709445f69b2f9df0a7329295");
      },
      network_id: 4,
      gas: 6000000,
      gasPrice: 63283078817,
    },    
    ropsten: {
      provider: function() { 
       return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/8da2357d709445f69b2f9df0a7329295");
      },
      network_id: 3,
      gas: 6000000,
      gasPrice: 63283078817,
    },
    goerli: {
      provider: function() { 
       return new HDWalletProvider(process.env.MNEMONIC, "https://goerli.infura.io/v3/8da2357d709445f69b2f9df0a7329295");
      },
      network_id: 5,
      gas: 6000000,
      gasPrice: 63283078817,
    },
    bsctestnet: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled : true,
          runs: 200
        },
        evmVersion: "istanbul"
      }
    }
  }
}