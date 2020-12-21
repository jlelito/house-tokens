const { assert } = require('chai')

const House = artifacts.require("./House.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract("House", accounts => {
  let HouseInstance
  
  before(async () => {
     HouseInstance = await House.deployed();
  
  })

  it("Should deploy the contract", async () => {
    address = HouseInstance.address
    assert.equal(address, HouseInstance.address)
  });

  //Test minting house tokens
  it("Mints House Tokens", async () => {
    bal = await HouseInstance.balanceOf('0xfC93aDfc3daB905fE5697D48Bf4B396801f49bD4')
    bal = bal.toNumber()
    assert.equal(bal, 3)
    
    await HouseInstance.mint("Medici Ct", 1000, 20, 2, 1)
    bal = await HouseInstance.balanceOf('0xfC93aDfc3daB905fE5697D48Bf4B396801f49bD4')
    bal = bal.toNumber()
    assert.equal(bal, 4)

  });

  it("Transfers House Tokens", async () => {
    bal1 = await HouseInstance.balanceOf('0xfC93aDfc3daB905fE5697D48Bf4B396801f49bD4')
    bal1 = bal1.toNumber()
    
    await HouseInstance.transferHouse('0xE8C4e9611B89ffDD1734cE759692518F765Cf465', 2, {from: accounts[0]})
    bal1 = await HouseInstance.balanceOf('0xfC93aDfc3daB905fE5697D48Bf4B396801f49bD4')
    bal1 = bal1.toNumber()
    bal2 = await HouseInstance.balanceOf('0xE8C4e9611B89ffDD1734cE759692518F765Cf465')
    bal2 = bal2.toNumber()
    
    assert.equal(bal1, 3)
    assert.equal(bal2, 1)

  });

  it("Changes Price of House", async () => {
    let currentHouse = await HouseInstance.houses(1)
    let currentPrice = currentHouse.price
    console.log('Current Price of House:', currentPrice.toNumber())
    await HouseInstance.changePrice(1, 200)
    let newHouse = await HouseInstance.houses(1)
    let newPrice = newHouse.price
    console.log('New Price of House:', newPrice.toNumber())
    assert.equal(newPrice, 200)
  });

  it("Buy a House Token", async () => {
    bal1 = await HouseInstance.balanceOf(accounts[0])
    bal1 = bal1.toNumber()
    bal2 = await HouseInstance.balanceOf(accounts[1])
    bal2 = bal2.toNumber()

    // Make sure cannot buy your own house
    await HouseInstance.buyHouse(3, {from: accounts[0], value: web3.utils.toWei('8', 'Ether')}).should.be.rejected
    await HouseInstance.buyHouse(3, {from: accounts[1], value: web3.utils.toWei('8', 'Ether')})
    bal2 = await HouseInstance.balanceOf(accounts[1])
    bal2 = bal2.toNumber()
    assert.equal(bal2, 2)
    // Make sure enough ether sent for house
    await HouseInstance.buyHouse(5, {from: accounts[1], value: web3.utils.toWei('2', 'Ether')}).should.be.rejected
    await HouseInstance.buyHouse(5, {from: accounts[1], value: web3.utils.toWei('9', 'Ether')})
    bal2 = await HouseInstance.balanceOf(accounts[1])
    bal2 = bal2.toNumber()
    assert.equal(bal2, 3)


  });
});
