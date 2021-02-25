pragma solidity ^0.5.2;

import "./ERC721Full.sol";

contract House is ERC721Full {

  struct House {
    uint houseID;
    address payable owner;
    address payable royaltyCollector;
    string homeAddress;
    uint sqFeet;
    uint bedrooms;
    uint bathrooms;
    uint price;
    uint royalty;
  }

  event boughtHouse(uint houseID, address seller, address buyer, string homeAddress, uint sqFeet, uint price, uint bedrooms, uint bathrooms, uint royaltyPayment);
  event sentHouse(uint id, address from, address to);
  event changedPrice(uint id, uint oldPrice, uint newPrice);

  mapping(uint => House) public houses;
  mapping(uint => bool) _houseExists;
  uint public nextId = 1;
  address public admin;

  constructor() ERC721Full("House", "HOUSE") public {
      admin = msg.sender;
  }

  function mint(string memory _homeAddress, uint _sqFeet, uint _bedrooms, uint _bathrooms, uint _price, uint _royalty) public {
    require(!_houseExists[nextId], "this house id already exists");
    require(msg.sender == admin, "Must be Admin to mint House Tokens");
    require(_royalty <= 1000, "Cannot have royalty more than 100%!");
    houses[nextId] = House(nextId, msg.sender, msg.sender, _homeAddress, _sqFeet, _bedrooms, _bathrooms, _price, _royalty);
    _mint(msg.sender, nextId);
    _houseExists[nextId] = true;
    nextId+=1;
  }

  function transferHouse(address payable to, uint _id) houseMustExist(_id) mustOwnHouse(_id) public {
    _transferFrom(msg.sender, to, _id);
    houses[_id].owner = to;
    emit sentHouse(_id, msg.sender, to);
  }

  function changePrice(uint _id, uint newPrice) houseMustExist(_id) mustOwnHouse(_id) public {
    //Store old house price
    uint oldPrice = houses[_id].price;
    //Change the price of the house with associated id
    houses[_id].price = newPrice;
    emit changedPrice(_id, oldPrice, newPrice);
  }

  function buyHouse(uint _id) houseMustExist(_id) public payable {
    //Fetch the House
    House memory _house = houses[_id];
    require(ownerOf(_id) != msg.sender, "cannot buy your own house!");
    //Make sure send right amount 
    require(msg.value == _house.price, "not enough ether!");
    //Fetch the House Owner
    address payable _seller = _house.owner;
    //Fetch the Royalty Collector
    address payable _collector = _house.royaltyCollector;
    //Calculate Royalty and Seller payment
    uint royaltyPayment = _house.royalty * (_house.price / 1000);
    uint sellerPayment = _house.price - royaltyPayment;
    //Pay the seller
    address(_seller).transfer(sellerPayment);
    //Pay the royalty collector
    address(_collector).transfer(royaltyPayment);
    //Send the house token to new owner
    _transferFrom(_seller, msg.sender, _id);
    //Change ownership of house
    houses[_id].owner = msg.sender;
    //Emit the image tipped event
    emit boughtHouse(_id, _seller, msg.sender, _house.homeAddress, _house.sqFeet, _house.price, _house.bedrooms, _house.bathrooms, royaltyPayment);

  }


  modifier mustOwnHouse(uint houseID) {
    require(houses[houseID].owner == msg.sender, "you must own the house");
    _;
  }

  modifier houseMustExist(uint houseID) {
    require(_houseExists[houseID], "house does not exist!!");
    _;
  }

}