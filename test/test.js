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
    assert.equal(bal, 0)
    
    await HouseInstance.mint("First House", 1000, 2, 1, 10000000000000, 250, {from: accounts[0]})
    bal = await HouseInstance.balanceOf('0xfC93aDfc3daB905fE5697D48Bf4B396801f49bD4')
    bal = bal.toNumber()
    assert.equal(bal, 1)

  });

  it("Transfers House Tokens", async () => {
    bal1 = await HouseInstance.balanceOf(accounts[0])
    bal1 = bal1.toNumber()
    
    await HouseInstance.transferHouse(accounts[1], 1, {from: accounts[0]})
    bal1 = await HouseInstance.balanceOf(accounts[0])
    bal2 = await HouseInstance.balanceOf(accounts[1])
    bal1 = bal1.toNumber()
    bal2 = bal2.toNumber()
    
    assert.equal(bal1, 0)
    assert.equal(bal2, 1)

  });

  it("Changes Price of House", async () => {
    let currentHouse = await HouseInstance.houses(1)
    let currentPrice = currentHouse.price
    console.log('Current House Owner:', currentHouse.owner)
    console.log('Current Price of House:', currentPrice.toNumber())
    await HouseInstance.changePrice(1, 51000, {from: accounts[1]})
    let newHouse = await HouseInstance.houses(1)
    let newPrice = newHouse.price
    console.log('New Price of House:', newPrice.toNumber())
    assert.equal(newPrice, 51000)
  });

  it("Buy a House Token", async () => {
    let houseBalSeller, houseBalBuyer, ethBalSellerBefore, ethBalRoyaltyCollectorBefore, ethBalSellerAfter, ethBalRoyaltyCollectorAfter
    //Get house and ETH balances before buy
    houseBalSeller = await HouseInstance.balanceOf(accounts[1])
    houseBalBuyer = await HouseInstance.balanceOf(accounts[2])
    ethBalSellerBefore = await web3.eth.getBalance(accounts[1])
    ethBalRoyaltyCollectorBefore = await web3.eth.getBalance(accounts[0])
    houseBalSeller = houseBalSeller.toNumber()
    houseBalBuyer = houseBalBuyer.toNumber()
    console.log('Eth balance seller before buy:', ethBalSellerBefore)
    console.log('Eth balance Royalty Collector before buy:', ethBalRoyaltyCollectorBefore)

    // Make sure cannot buy your own house
    await HouseInstance.buyHouse(1, {from: accounts[1], value: 51000}).should.be.rejected
    await HouseInstance.buyHouse(1, {from: accounts[2], value: 51000})

    //Check house and ETH balances after buy
    ethBalSellerAfter = await web3.eth.getBalance(accounts[1])
    ethBalRoyaltyCollectorAfter = await web3.eth.getBalance(accounts[0])
    console.log('Eth balance seller after buy:', ethBalSellerAfter)
    console.log('Eth balance Royalty Collector after buy:', ethBalRoyaltyCollectorAfter)
    
    houseBalBuyer = await HouseInstance.balanceOf(accounts[2])
    houseBalBuyer = houseBalBuyer.toNumber()
    assert.equal(houseBalBuyer, 1)
    // Make sure enough ether sent for house
    await HouseInstance.buyHouse(1, {from: accounts[3], value: 10000}).should.be.rejected
    await HouseInstance.buyHouse(1, {from: accounts[3], value: 51000})
    houseBalBuyer = await HouseInstance.balanceOf(accounts[3])
    houseBalBuyer = houseBalBuyer.toNumber()
    assert.equal(houseBalBuyer, 1)


  });
});
