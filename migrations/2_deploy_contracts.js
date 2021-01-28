var House = artifacts.require("./House.sol");

module.exports = async function(deployer) {
    await deployer.deploy(House);
};
