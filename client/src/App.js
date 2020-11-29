import React, { Component } from "react";
import HouseToken from "./contracts/House.json";
import Main from './Main'
import Navbar from './Navbar'
import "./App.css";
import Identicon from 'identicon.js';
import smile from './src_images/smiley.jpg'
import loadWeb3 from './utils.js';
import HouseTable from "./HouseTable";




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
          window.location.reload();
          
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
      
      this.state.houseToken.methods.buyHouse(tokenId).send({ from: this.state.account, value: housePrice }).on('transactionHash', (hash) => {
        
        window.location.reload();
      })
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
      console.log(accounts)
      this.setState({account: accounts[0]})
      window.location.reload();
    });

    return (
      <div className="App">
        <Navbar 
        account={this.state.account}
        currentBalance={this.state.houseTokenBalance}/>
      
        <h1 className="my-5">House Tokens!</h1>
        
        <p>Current Account: 
          <img
              className='ml-2'
              width='30'
              height='30'
              src={`data:image/png;base64,${new Identicon(this.state.account, 30).toString()}`}
          /> 
          {this.state.account}              
        </p>

        {this.state.account == this.state.admin ? (
              <>
              
              <h3 className="my-4">Mint House Token</h3>
              
              <form className="mb-3" 
              
                            onSubmit={(event) => {
                            event.preventDefault()
                            let homeAddress, homeSquarefeet, homePrice, homeBedrooms, homeBathrooms
                            homeAddress = this.address.value
                            homeSquarefeet = this.squareFeet.value.toString()
                            homePrice = this.price.value.toString()
                            homeBedrooms = this.bedrooms.value.toString()
                            homeBathrooms = this.bathrooms.value.toString()
                            this.mintHouse(homeAddress, homeSquarefeet, homePrice, homeBedrooms, homeBathrooms)

                            
                        }}>
                        
                        <div className="input-group row justify-content-center">
                            <div className="form-group col-md-6">
                              <label>Address of House</label>
                                <input
                                type="text"
                                ref={(address) => { this.address = address }}
                                className="form-control form-control-lg"
                                placeholder="221 First Street..."
                                required />
                            </div>
                        </div>
                        
                        <div className="row justify-content-center">
                          <div className="form-group col-sm-3">
                            <label className="text-center">Square Feet</label>
                              <input
                              type="number"
                              ref={(squareFeet) => { this.squareFeet = squareFeet }}
                              className="form-control form-control-lg"
                              placeholder="0"
                              required /> 
                          </div>
                          

                          
                            <div className="form-group col-sm-3">
                              <label className="text-center">Price</label>
                                <input
                                type="number"
                                step=".01"
                                ref={(price) => { this.price = price }}
                                className="form-control form-control-lg"
                                placeholder="0 ETH"
                                required /> 
                            </div>
                          
                        </div>
                          

                          <div className="mb-4 row justify-content-center">
                            <div className="col-sm-3">
                              <label className="text-center">Number of Bedrooms</label>
                                <input
                                type="number"
                                ref={(bedrooms) => { this.bedrooms = bedrooms }}
                                className="form-control form-control-lg"
                                placeholder="0"
                                required /> 
                            </div>
                            

                            
                              <div className="col-sm-3">
                                <label className="text-center">Number of Bathrooms</label>
                                  <input
                                  type="number"
                                  ref={(bathrooms) => { this.bathrooms = bathrooms }}
                                  className="form-control form-control-lg"
                                  placeholder="0"
                                  required /> 
                              </div>
                            
                          </div>
                        
                        
                            
                        
                        <button type="submit" 
                        className="btn btn-primary  btn-lg">Mint House!</button>
              </form>
              
              </>
              
              ) : null}
        
        
          <div className="col">
            <form className="mb-3" onSubmit={(event) => {
                            event.preventDefault()
                            let amount, targetAddress
                            amount = this.inputAmount.value.toString()
                            targetAddress = this.targetAddress.value
                            this.sendTokens(amount, targetAddress)

                            
                        }}>
                        &nbsp;
                        &nbsp;
                        <h2 className="my-4">Send House Token</h2>
                        <div className="container">
                        <div className="form-row justify-content-center">
                          
                        <div className="form-group mb-4 col-md-5">
                          <label className="mx-2">Address</label>
                            <input
                            type="text"
                            ref={(targetAddress) => { this.targetAddress = targetAddress }}
                            className="form-control form-control-lg"
                            placeholder="0x0...."
                            required />
                            
                        </div>
                        
                        <div className="form-group mb-4 col-md-2">
                          <label className="mx-2">House Token ID</label>
                            <input
                            type="number"
                            ref={(inputAmount) => { this.inputAmount = inputAmount }}
                            className="form-control form-control-lg"
                            placeholder="0"
                            required />
                            
                        </div>
                        </div>
                        </div>
                        
                        <button type="submit" 
                        className="btn btn-primary  btn-lg"
                        
                        >Send!</button>
              </form>
              &nbsp;
              &nbsp;
              &nbsp;
              &nbsp;

              <Main 
                houseItems = {this.state.houseTokenList}
                buyHouse = {this.buyHouse}
                account={this.state.account}
              />
              
              <HouseTable
                houseTokenList={this.state.houseTokenList}
                account={this.state.account}
              />
              

            </div>
          
      </div>
    );
  }
}

export default App;
