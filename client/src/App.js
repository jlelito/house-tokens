import React, { Component } from 'react';
import HouseToken from './contracts/House.json';
import Main from './components/Main';
import Navbar from './components/Navbar';
import './App.css';
import MintHouse from './components/MintHouse.js';
import HouseTable from './components/HouseTable';
import SendHouse from './components/SendHouse';
import houselogo from './src_images/houselogo.jpg';
import Notification from './components/Notification.js';
import Web3 from 'web3';

class App extends Component {
  
  async componentDidMount() {
    await this.loadBlockchainData()
    await this.updateHouses()
  }

  //Loads all the blockchain data
  async loadBlockchainData() {
    if(typeof window.ethereum!=='undefined' && !this.state.wrongNetwork) {
      window.ethereum.autoRefreshOnNetworkChange = false;
      let web3 = new Web3(window.ethereum)
      this.setState({web3})
      await this.loadAccountData()
      await this.loadContractData()
      
      window.ethereum.on('accountsChanged', async (accounts) => {
        if(typeof accounts[0] !== 'undefined' & accounts[0] !== null) {
          let newEthBalance = await web3.eth.getBalance(accounts[0])
          newEthBalance = web3.utils.fromWei(newEthBalance, 'Ether')
          this.setState({account: accounts[0], currentEthBalance: newEthBalance})
          console.log('New Account: ', this.state.account)
          await this.loadBlockchainData()
          await this.updateHouses()
        } else{
          this.setState({account: null, currentEthBalance: 0})
        }
      })

      window.ethereum.on('chainChanged', async (chainId) => {
        console.log('Chain Changed!')
        let newChainId = parseInt(chainId, 16)
        if(newChainId !== 3) {
          await this.loadAccountData()
          this.setState({wrongNetwork: true})
        } else {
          if(this.state.account) {
            await this.loadAccountData()
          }
          this.setState({network: newChainId, wrongNetwork: false})
          await this.updateHouses()
        }
      })
  }

  }

  async loadContractData() {

    // Load HouseToken
    const houseTokenData = HouseToken.networks[this.state.network]
    if(houseTokenData) {
      const abi = HouseToken.abi
      const address = houseTokenData.address
      //Load contract and set state
      const tokenContract = new this.state.web3.eth.Contract(abi, address)
      this.setState({ houseToken : tokenContract })
      
      //Get House Token Balance and set to state. 
      let currentHouseTokenBalance = await tokenContract.methods.balanceOf(this.state.account).call()
      
      this.setState({ houseTokenBalance: currentHouseTokenBalance })
      
      let contractAdmin = await tokenContract.methods.admin().call()
      this.setState({admin: contractAdmin})
}
  }

  async loadAccountData() {
    let web3 = new Web3(window.ethereum)
    const accounts = await web3.eth.getAccounts()

    if(typeof accounts[0] !== 'undefined' && accounts[0] !== null) {
      let currentEthBalance = await web3.eth.getBalance(accounts[0])
      currentEthBalance = web3.utils.fromWei(currentEthBalance, 'Ether')
      this.setState({account: accounts[0], currentEthBalance})
    }

    const networkId = await web3.eth.net.getId()
    this.setState({network: networkId})

    if(networkId !== 3) {
      this.setState({wrongNetwork: true})
      return null
    }
}

  
    //Update the House Ids and Owner List
  async updateHouses() {
    if(!this.state.wrongNetwork) {
      try{
            let length = await this.state.houseToken.methods.nextId().call()
            
            const houses = []
            for(let i=1; i<length; i++){
              let currentHouse = await this.state.houseToken.methods.houses(i).call()
              houses.push(currentHouse)
            }
          
            this.setState({houseTokenList: houses})
            this.setState({filteredHouseList: houses})
            let currentEthBalance = await this.state.web3.eth.getBalance(this.state.account)
            currentEthBalance = this.state.web3.utils.fromWei(currentEthBalance, 'Ether')
            this.setState({currentEthBalance: currentEthBalance})

          } catch(e){
            window.alert('Cannot update houses! Error:', e.message)
            
          }
      }
    
}


  //Sends tokens to a specified address
    sendTokens = (tokenId, address) => {
      try{
          
          this.state.houseToken.methods.transferHouse(address, tokenId).send({ from: this.state.account }).on('transactionHash', async (hash) => {
           
            this.setState({hash:hash})
            this.setState({action: 'Sent House'})
            this.setState({trxStatus: 'Pending'})
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
        this.setState({hash:hash})
        this.setState({action: 'Minted House'})
        this.setState({trxStatus: 'Pending'})
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
         this.setState({hash:hash})
         this.setState({action: 'Changed Price'})
         this.setState({trxStatus: 'Pending'})
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

    filterHouses = (filteredHouseList) => {
      this.setState({filteredHouseList})
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
        houseToken: {},
        houseTokenBalance: '0',
        currentEthBalance: '0',
        houseTokenList: [],
        filteredHouseList: [],
        loading: false,
        hash: '0x0',
        action: null,
        wrongNetwork: false,
        trxStatus: null,
        confirmNum: 0
      }
    }
    

  render() {

    return (
      <div className='App'>
        {this.state.account !== null ?
        <Navbar 
          account={this.state.account}
          currentBalance={this.state.houseTokenBalance}
          balance={this.state.currentEthBalance}
          network={this.state.network}
        /> : null}
        
        {this.state.wrongNetwork ?
        <>
          <div className='row justify-content-center mt-5'><h1 className='mt-5'>Please connect to Ropsten!</h1></div> 
          <h2 className='row justify-content-center mt-4'>Current Network: 
            {
              this.state.network === 1 ? ' Mainnet' :
              this.state.network === 4 ? ' Rinkeby' :
              this.state.network === 5 ? ' Goerli' :
              this.state.network === 42 ? ' Kovan':
              <>{this.state.network}</>
            }
          </h2>
        </>
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
