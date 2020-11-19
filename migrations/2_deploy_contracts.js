var House = artifacts.require("./House.sol");

module.exports = function(deployer) {
  deployer.deploy(House);
};
