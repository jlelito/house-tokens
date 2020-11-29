var House = artifacts.require("./House.sol");

module.exports = async function(deployer) {
    await deployer.deploy(House);
    const HouseInstance = await House.deployed();
    await HouseInstance.mint("Mansion", 1500, 900000000000000, 7, 6);
    await HouseInstance.mint("ECU", 300, 300000000000000, 1, 1);
    await HouseInstance.mint("Huge House!", 150000, 500000000000000, 9, 10);
};
