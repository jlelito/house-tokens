import React, { Component } from 'react';
import HouseToken from './contracts/House.json';
import Main from './Main'
import Navbar from './Navbar'
import "./App.css";
import smile from './src_images/smiley.jpg'
import loadWeb3 from './utils.js';
import MintHouse from './MintHouse.js';
import HouseTable from './HouseTable';
import SendHouse from './SendHouse';


class App extends Component {
  
  async componentWillMount() {
    await loadWeb3()
    await this.loadBlockchainData()
    await this.updateHouses()
  }


  //Loads all the blockchain data
  async loadBlockchainData() {
    const web3 = window.web3
  
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})

    const networkId = await web3.eth.net.getId()
    
    // Load HouseToken
    const houseTokenData = HouseToken.networks[networkId]
    if(houseTokenData) {
      const abi = HouseToken.abi
      const address = houseTokenData.address
      //Load contract and set state
      const tokenContract = new web3.eth.Contract(abi, address)
      this.setState({ houseToken : tokenContract })
      
      //Get House Token Balance and set to state. 
      //Make sure to reset Metamask account and Network to refresh the contract (if balance is null)
      let currentHouseTokenBalance = await tokenContract.methods.balanceOf(this.state.account).call()
      
      this.setState({ houseTokenBalance: currentHouseTokenBalance })
      
      let contractAdmin = await tokenContract.methods.admin().call()
      this.setState({admin: contractAdmin})
    } else {
          window.alert('HouseToken contract not deployed to detected network. Please connect to network 7545') 
    }
      
  }
  

    

    //Update the House Ids and Owner List
  async updateHouses() {
    
    try{
        let length = await this.state.houseToken.methods.nextId().call()
        
        const houses = []
        for(let i=1; i<length; i++){
          let currentHouse = await this.state.houseToken.methods.houses(i).call()
          houses.push(currentHouse)
        }
        
        this.setState({houseTokenList: houses})
        this.setState({loading: false})

        } catch(e){
          this.setState({loading: true})
          window.alert('Cannot update houses! Error:', e.message)
        }
    
}

    
  //Sends tokens to a specified address
    sendTokens = (tokenId, address) => {
      try{
          
          this.state.houseToken.methods.transferHouse(address, tokenId).send({ from: this.state.account }).on('transactionHash', (hash) => {
          
            this.state.houseToken.events.sentHouse({}, async (error, event) => {
              let houseID = event.returnValues.id
              let sentTo = event.returnValues.to
              window.alert('Sent House! \n\n' + 'House ID: ' + houseID + '\nReceiptiant: ' + sentTo)
              window.location.reload() 
          })
          
            }).on('error', (error) => {
              window.alert('Error')
          })

        } catch (e){
          window.alert(e)
        }
    }

    //Mints House Tokens
    mintHouse = (houseAddress, squareFeet, price, bedrooms, bathrooms) => {
      
      let ethPrice = window.web3.utils.toWei(price, 'Ether')
      try{
      this.state.houseToken.methods.mint(houseAddress, squareFeet, ethPrice, bedrooms, bathrooms).send({ from: this.state.account }).on('transactionHash', (hash) => {
        window.location.reload();
        
      })
      } catch(e) {
        window.alert(e)
      }

    }


    //Buys house tokens from the card
     buyHouse = (tokenId, housePrice) => {
      try{
      this.state.houseToken.methods.buyHouse(tokenId).send({ from: this.state.account, value: housePrice }).on('transactionHash', (hash) => {
        
        this.state.houseToken.events.boughtHouse({}, async (error, event) => {
            let result = event.returnValues.homeAddress
            let price = event.returnValues.price
            let oldOwner = event.returnValues.owner
            price = window.web3.utils.fromWei(price, 'Ether')
            window.alert('Bought House! \n\n' + 'Address: ' + result + '\nPrice: ' + price + ' ETH' + '\nBought From: ' + oldOwner)
            window.location.reload()  
        })

          }).on('error', (error) => {
            window.alert('Error! Could not buy house!')
          })
        }
      catch(e) {
        window.alert(e)
      }
      
    }
    
  
    //Changes the price of a house
    changePrice = (tokenId, newPrice) => {
      try{
      let ethPrice = window.web3.utils.toWei(newPrice, 'Ether')
      this.state.houseToken.methods.changePrice(tokenId, ethPrice).send({ from: this.state.account }).on('transactionHash', (hash) => {
        
        this.state.houseToken.events.changedPrice({}, async (error, event) => {
          let targetID = event.returnValues.id
          let oldPrice = event.returnValues.oldPrice
          let newPrice = event.returnValues.newPrice
          oldPrice = window.web3.utils.fromWei(oldPrice, 'Ether')
          newPrice = window.web3.utils.fromWei(newPrice, 'Ether')
          window.alert('Changed Price! \n\n' + 'House ID: ' + targetID + '\nOld Price: ' + oldPrice + ' ETH' + '\nNew Price: ' + newPrice + ' ETH')
          window.location.reload()  
      })
      
        }).on('error', (error) => {
          window.alert('Error! Could not change price!\n')
        })
      }
      catch(e) {
        window.alert(e)
      }

    }

    constructor(props) {
      super(props)
      this.state = {
        account: '0x0',
        admin:'0x0',
        houseToken: {},
        houseTokenBalance: '0',
        houseTokenList: [],
        loading: true
      }
    }
    

  render() {
    if(this.state.loading) {
      return (
        <div className="text-center">
          <h1 className="text-center mt-5">Loading the Blockchain! Please Wait!</h1> 
          <img className="center-block" src={smile}></img>
        </div>
      )
    }

    window.ethereum.on('accountsChanged', accounts => {
      this.setState({loading : true})
      window.location.reload();
      this.setState({account: accounts[0]})
      
    });

    return (
      <div className="App">
        <Navbar 
          account={this.state.account}
          currentBalance={this.state.houseTokenBalance}
        />
      
        <h1 className="my-5">House Tokens!</h1>
        <MintHouse
          account={this.state.account}
          admin={this.state.admin}
          houseToken={this.state.houseToken}
        />

        <hr/>
         
        <div className="row justify-content-center">
          <SendHouse
            account={this.state.account}
            houseTokenBalance = {this.state.houseTokenBalance}
            houseTokenList = {this.state.houseTokenList}
            sendTokens = {this.sendTokens}
          />

          <div className="col-lg-6 mr-4">
            <h2 className="mb-4">Your Houses</h2>
            <HouseTable
              account={this.state.account}
              houseTokenList={this.state.houseTokenList}
            />
          </div>
        </div>
        
        &nbsp;
        &nbsp;   
        &nbsp;
        &nbsp;
        <hr/>
              
        <Main 
          houseItems = {this.state.houseTokenList}
          buyHouse = {this.buyHouse}
          account={this.state.account}
          changePrice={this.changePrice}
        />
      </div>
    );
  }
}

export default App;
