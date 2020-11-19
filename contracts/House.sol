pragma solidity ^0.5.2;

import "./ERC721Full.sol";

contract House is ERC721Full {

  struct House {
    uint houseID;
    address payable owner;
    string homeAddress;
    uint sqFeet;
    uint price;
    uint bedrooms;
    uint bathrooms;
  }

  event boughtHouse (
    uint houseID,
    address owner,
    string homeAddress,
    uint sqFeet,
    uint price,
    uint bedrooms,
    uint bathrooms
  );




  mapping(uint => House) public houses;
  mapping(uint256 => bool) _houseExists;
  uint public nextId = 1;
  address public admin;

  constructor() ERC721Full("House", "HOUSE") public {
      admin = msg.sender;
      mint("Medici Court", 400, 5000000000000000000, 4, 3);
      mint("Hatchet Creek Ct", 700, 10000000000000, 2, 1);
      mint("Bikini Bottom", 2100, 8000000000000000000, 1, 1);
      mint("ECU", 1500, 9000000000000000000, 1, 1);
      mint("A Small House", 100, 9000000000000000000, 1, 1);
      mint("Mansion", 50000, 9000000000000000000, 1, 1);
      
  }

  function mint(string memory _homeAddress, uint _sqFeet, uint _price, uint _bedrooms, uint _bathrooms) public {
    require(!_houseExists[nextId]);
    require(msg.sender == admin, 'Must be Admin to mint House Tokens');
    houses[nextId] = House(nextId, msg.sender, _homeAddress, _sqFeet, _price, _bedrooms, _bathrooms);
    _mint(msg.sender, nextId);
    _houseExists[nextId] = true;
    nextId+=1;
  }

  function transferHouse(address payable to, uint houseID) public {
    require(ownerOf(houseID) == msg.sender, 'you must own the house to transfer!');
    require(_houseExists[houseID], 'house does not exist!!');
    _transferFrom(msg.sender, to, houseID);
    houses[houseID].owner = to;
  }

  function buyHouse(uint _id) public payable {
    //Make sure id is valid
    require(_houseExists[_id], 'house does not exist!!');
    //Fetch the House
    House memory _house = houses[_id];
    require(_house.owner != msg.sender, 'cannot buy your own house!');
    //Make sure send right amount 
    require(msg.value == _house.price, 'not enough ether!');
    //Fetch the Owner
    address payable _owner = _house.owner;
    //Pay the author by sending them Ether
    address(_owner).transfer(msg.value);
    //Send the house token to new owner
    _transferFrom(_owner, msg.sender, _id);
    //Change ownership of house
    houses[_id].owner = msg.sender;
    
    //Emit the image tipped event
    emit boughtHouse(_id, _house.owner, _house.homeAddress, _house.sqFeet, _house.price, _house.bedrooms, _house.bathrooms);

  }

}