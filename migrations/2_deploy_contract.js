var Owned = artifacts.require("./Owned.sol");
var Stoppable = artifacts.require("./Stoppable.sol");
var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
  deployer.deploy(Owned);
  deployer.deploy(Stoppable);
  deployer.deploy(Splitter);
};