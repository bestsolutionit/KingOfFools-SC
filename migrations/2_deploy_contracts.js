"use strict"
const KingOfTheFools = artifacts.require("KingOfTheFools");
const USDC = artifacts.require("USDC");
// ChainLink Price Feed (goerli testnet): 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
module.exports = function(deployer) {
  deployer.deploy(USDC).then(function() {
    console.log('USDC deployed at ', USDC.address);
    return deployer.deploy(KingOfTheFools, USDC.address, "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e");
  });
};
