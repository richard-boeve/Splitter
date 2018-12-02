var Migrations = artifacts.require("./Splitter.sol");

module.exports = function(deployer, network, accounts) {
  console.log("network:", network);
  console.log("accounts:", accounts);
  deployer.deploy(Splitter);
};
