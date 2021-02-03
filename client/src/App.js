import React, { Component } from 'react';
import HouseToken from './contracts/House.json';
import Main from './components/Main.js';
import Navbar from './components/Navbar.js';
import './App.css';
import MintHouse from './components/MintHouse.js';
import HouseTable from './components/HouseTable';
import SendHouse from './components/SendHouse.js';
import houselogo from './src_images/houselogo.jpg';
import Notification from './components/Notification.js';
import Web3 from 'web3';
import WrongNetwork from './components/WrongNetwork.js';
import Loading from './components/Loading.js';

class App extends Component {
  
  async componentDidMount() {
    await this.loadBlockchainData()
  }

  //Loads all the blockchain data
  async loadBlockchainData() {
    this.setState({loading: true})
    if(typeof window.ethereum !== 'undefined') {
      let web3 = new Web3(window.ethereum)
      this.setState({web3})
      await this.loadAccountData()
      await this.loadContractData()
      await this.updateHouses()
    }
    this.setState({loading: false})
  }

  async loadAccountData() {
    let web3 = new Web3(window.ethereum)
    const accounts = await web3.eth.getAccounts()
    console.log('Accounts loadAccountData: ', accounts[0])
    if(typeof accounts[0] !== 'undefined' && accounts[0] !== null) {
      let currentEthBalance = await web3.eth.getBalance(accounts[0])
      currentEthBalance = web3.utils.fromWei(currentEthBalance, 'Ether')
      await this.setState({account: accounts[0], currentEthBalance, isConnected: true})
    } else {
      await this.setState({account: null, isConnected: false})
    }

    const networkId = await web3.eth.net.getId()
    this.setState({network: networkId})

    if(this.state.network !== 3) {
      this.setState({wrongNetwork: true})
    }
  }

// Load HouseToken Contract Data
  async loadContractData() {
    let currentHouseTokenBalance, contractAdmin
    const houseTokenData = HouseToken.networks[3]
    if(houseTokenData) {
      const abi = HouseToken.abi
      const address = houseTokenData.address
      //Load contract and set state
      const tokenContract = new this.state.web3.eth.Contract(abi, address)
      this.setState({ houseToken : tokenContract })
      
      //Get House Token Balance and Admin and set to state.
      if(this.state.account ===  null) {
        currentHouseTokenBalance = 0
      } else {
        currentHouseTokenBalance = await tokenContract.methods.balanceOf(this.state.account).call()
      }
      contractAdmin = await tokenContract.methods.admin().call()
      this.setState({ houseTokenBalance: currentHouseTokenBalance, admin: contractAdmin })
    }
  }
  
  //Update the House Ids and Owner List
  async updateHouses() {
    if(!this.state.wrongNetwork) {
            let currentEthBalance
            let length = await this.state.houseToken.methods.nextId().call()
            
            const houses = []
            for(let i=1; i<length; i++){
              let currentHouse = await this.state.houseToken.methods.houses(i).call()
              houses.push(currentHouse)
            }
            
            if(this.state.account ===  null) {
              currentEthBalance = 0
            } else {
              currentEthBalance = await this.state.web3.eth.getBalance(this.state.account)
              currentEthBalance = this.state.web3.utils.fromWei(currentEthBalance, 'Ether')
            }
            await this.setState({houseTokenList: houses, filteredHouseList: houses, currentEthBalance: currentEthBalance})
          }
      }
    



  //Sends tokens to a specified address
    sendTokens = (tokenId, address) => {
      try{
          
          this.state.houseToken.methods.transferHouse(address, tokenId).send({ from: this.state.account }).on('transactionHash', async (hash) => {
           
            this.setState({hash:hash, action: 'Sent House', trxStatus: 'Pending'})
            this.showNotification()
            this.state.houseToken.events.sentHouse({}, async (error, event) => {
              await this.updateHouses()
              let currentHouseTokenBalance = await this.state.houseToken.methods.balanceOf(this.state.account).call()
              this.setState({ houseTokenBalance: currentHouseTokenBalance })
          })
          
          })
            .on('receipt', (receipt) => {
              if(receipt.status === true){
                this.setState({trxStatus: 'Success'})
              }
              else if(receipt.status === false){
                this.setState({trxStatus: 'Failed'})
              }
            }).on('error', (error) => {
              window.alert('Error')
            }).on('confirmation', (confirmNum) => {
              if(confirmNum > 10) {
                this.setState({confirmNum : '10+'})
              } else {
              this.setState({confirmNum})
              }
          })

        } catch (e){
          window.alert(e)
        }
    }

    //Mints House Tokens
    mintHouse = (houseAddress, squareFeet, price, bedrooms, bathrooms) => {
      let ethPrice = this.state.web3.utils.toWei(price, 'Ether')
      try{
      this.state.houseToken.methods.mint(houseAddress, squareFeet, ethPrice, bedrooms, bathrooms).send({ from: this.state.account }).on('transactionHash', async (hash) => {
        this.setState({hash: hash, action: 'Minted House', trxStatus: 'Pending'})
        this.showNotification()
        await this.updateHouses()
        
      }).on('receipt', (receipt) => {
          if(receipt.status === true){
            this.setState({trxStatus: 'Success'})
          }
          else if(receipt.status === false){
            this.setState({trxStatus: 'Failed'})
          }
      }).on('error', (error) => {
          window.alert('Error! Could not create house!')
      }).on('confirmation', (confirmNum) => {
          if(confirmNum > 10) {
            this.setState({confirmNum : '10+'})
          } else{
          this.setState({confirmNum})
          }
      })
      } catch(e) {
        window.alert(e)
      }

    }


    //Buys house tokens from the card
     buyHouse = (tokenId, housePrice) => {
      try {
      this.state.houseToken.methods.buyHouse(tokenId).send({ from: this.state.account, value: housePrice }).on('transactionHash', (hash) => {
        this.setState({hash:hash})
        this.setState({action: 'Bought House'})
        this.setState({trxStatus: 'Pending'})
        this.showNotification()
        this.state.houseToken.events.boughtHouse({}, async (error, event) => {
            await this.updateHouses()
             
        })
          }).on('receipt', (receipt) => {
              if(receipt.status === true){
                this.setState({trxStatus: 'Success'})
              }
              else if(receipt.status === false){
                this.setState({trxStatus: 'Failed'})
              }
          }).on('error', (error) => {
              window.alert('Error! Could not buy house!')
          }).on('confirmation', (confirmNum) => {
              if(confirmNum > 10) {
                this.setState({confirmNum : '10+'})
              } else{
              this.setState({confirmNum})
              }
          })
        }
      catch(e) {
        window.alert(e)
      }
      
    }
    
  
    //Changes the price of a house
    changePrice = (tokenId, newPrice) => {
      try{
      let ethPrice = this.state.web3.utils.toWei(newPrice, 'Ether')
      this.state.houseToken.methods.changePrice(tokenId, ethPrice).send({ from: this.state.account }).on('transactionHash', async (hash) => {
         this.setState({hash: hash, action: 'Changed Price', trxStatus: 'Pending'})
         this.showNotification()

        this.state.houseToken.events.changedPrice({}, async (error, event) => {
          await this.updateHouses()
      })
        }).on('receipt', async (receipt) => {
            if(receipt.status === true){
              this.setState({trxStatus: 'Success'})
            }
            else if(receipt.status === false){
              this.setState({trxStatus: 'Failed'})
            }
          }).on('error', (error) => {
              window.alert('Error! Could not change house price!')
          })
          .on('confirmation', (confirmNum) => {
              if(confirmNum > 10) {
                this.setState({confirmNum : '10+'})
              } else{
              this.setState({confirmNum})
              }
          })
      }
      catch(e) {
        window.alert(e)
      }
    }

    showNotification = () => {
      this.notificationOne.current.updateShowNotify()
    }

    filterHouses = async (filteredHouseList) => {
      await this.setState({filteredHouseList})
    }

    constructor(props) {
      super(props)
      this.notificationOne = React.createRef()
      this.state = {
        web3: null,
        account: null,
        admin:'0x0',
        network: null,
        wrongNetwork: false,
        loading: false,
        isConnected: null,
        houseToken: {},
        houseTokenBalance: '0',
        currentEthBalance: '0',
        houseTokenList: [],
        filteredHouseList: [],
        hash: '0x0',
        action: null,
        trxStatus: null,
        confirmNum: 0
      }
    }
    
  render() {
if(window.ethereum != null) {

    window.ethereum.on('connect', async () => {
      console.log('Connected!!!')
    })

    window.ethereum.on('disconnect', async () => {
      console.log('DisConnected!!!')
    })

    window.ethereum.on('chainChanged', async (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async (accounts) => {
      console.log('Accounts changing!')
      if(typeof accounts[0] !== 'undefined' & accounts[0] !== null) {
        await this.loadAccountData()
        await this.updateHouses()
      } else {
        this.setState({account: null, currentEthBalance: 0})
      }
      
    })

  }

    return (
      <div className='App'>
        
        <Navbar 
          account={this.state.account}
          currentBalance={this.state.houseTokenBalance}
          balance={this.state.currentEthBalance}
          network={this.state.network}
          isConnected={this.state.isConnected}
        />
        <h1>Account: {this.state.account}</h1>
        {this.state.wrongNetwork ?
          <WrongNetwork network = {this.state.network} /> 
          :
         this.state.loading ?
          <Loading /> 
          :
          <>
          <Notification 
            showNotification={this.state.showNotification}
            action={this.state.action}
            hash={this.state.hash}
            ref={this.notificationOne}
            trxStatus={this.state.trxStatus}
            confirmNum={this.state.confirmNum}
          />
          <div className='row mt-5'></div>
          <h1 className='mt-4' id='title'>House Tokens</h1>
          <MintHouse
            account={this.state.account}
            admin={this.state.admin}
            mintHouse={this.mintHouse}
          />

          <hr/>
          
          <div className='row justify-content-center'>
            <SendHouse
              account={this.state.account}
              houseTokenBalance = {this.state.houseTokenBalance}
              houseTokenList = {this.state.houseTokenList}
              sendTokens = {this.sendTokens}
            />

            <div className='col-lg-6 mr-4'>
              <h2 className='mb-4'>Your Houses <img src={houselogo} width='60' height='60' alt='house logo' /></h2>
              <HouseTable
                account={this.state.account}
                houseTokenList={this.state.houseTokenList}
              />
            </div>
          </div>
          
          <hr/>
                
          <Main 
            houseItems = {this.state.houseTokenList}
            filteredHouseList = {this.state.filteredHouseList}
            buyHouse = {this.buyHouse}
            account = {this.state.account}
            changePrice = {this.changePrice}
            filterHouses = {this.filterHouses}
          />
          </>
    
  }
      </div>
    
    
    );
  }
}

export default App;
