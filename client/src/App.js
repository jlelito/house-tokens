import React, { Component } from 'react';
import HouseToken from './contracts/House.json';
import Main from './components/Main'
import Navbar from './components/Navbar'
import './App.css';
import smile from './src_images/smiley.jpg'
import MintHouse from './components/MintHouse.js';
import HouseTable from './components/HouseTable';
import SendHouse from './components/SendHouse';
import houselogo from './src_images/houselogo.jpg';
import Notification from './components/Notification.js';
import Web3 from 'web3'


class App extends Component {
  
  async componentDidMount() {
    await this.loadBlockchainData()
    await this.updateHouses()
  }

  //Loads all the blockchain data
  async loadBlockchainData() {
    const web3 = new Web3(window.ethereum)
    this.setState({web3})
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    console.log('Network: ', networkId)
    
    // Load HouseToken
    const houseTokenData = HouseToken.networks[networkId]
    if(houseTokenData) {
      const abi = HouseToken.abi
      const address = houseTokenData.address
      //Load contract and set state
      const tokenContract = new web3.eth.Contract(abi, address)
      this.setState({ houseToken : tokenContract })
      
      //Get House Token Balance and set to state. 
      let currentHouseTokenBalance = await tokenContract.methods.balanceOf(this.state.account).call()
      
      this.setState({ houseTokenBalance: currentHouseTokenBalance })
      
      let contractAdmin = await tokenContract.methods.admin().call()
      this.setState({admin: contractAdmin})

      let currentEthBalance = await web3.eth.getBalance(accounts[0])
      currentEthBalance = web3.utils.fromWei(currentEthBalance, 'Ether')
      this.setState({currentEthBalance: currentEthBalance})

    } else {
          window.alert('HouseToken contract not deployed to detected network. Please connect to Ropsten Network') 
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
        
        await this.setState({houseTokenList: houses})
        await this.setState({filteredHouseList: houses})
        let currentEthBalance = await this.state.web3.eth.getBalance(this.state.account)
        currentEthBalance = this.state.web3.utils.fromWei(currentEthBalance, 'Ether')
        this.setState({currentEthBalance: currentEthBalance})
        this.setState({loading:false})

        } catch(e){
          this.setState({loading: true})
          window.alert('Cannot update houses! Error:', e.message)
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
        window.alert('Error! Could not buy house!')
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
      try{
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
          console.log('Updating Houses for ChangePrice')

          
          console.log('Houses updated')

        }).on('error', (error) => {
          window.alert('Error! Could not buy house!')
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
        account: '0x0',
        admin:'0x0',
        houseToken: {},
        houseTokenBalance: '0',
        currentEthBalance: '0',
        houseTokenList: [],
        filteredHouseList: [],
        loading: true,
        hash: '0x0',
        action: null,
        wrongNetwork: false,
        trxStatus: null,
        confirmNum: 0
      }
    }
    

  render() {
    if(this.state.loading) {
      window.ethereum.on('chainChanged', async => {
        window.location.reload()
      })
      return (
        <div className='text-center'>
          <h1 className='text-center mt-5'>Loading the Blockchain! Please connect to Ropsten Test Network!</h1> 
          <img className='center-block' src={smile} alt='smiley'></img>
        </div>
      )
    }

    window.ethereum.on('accountsChanged', accounts => {
      this.setState({account: accounts[0]})
      window.location.reload()
    })

    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    return (
      <div className='App'>
        <Navbar 
          account={this.state.account}
          currentBalance={this.state.houseTokenBalance}
          hash={this.state.hash}
          action={this.state.action}
          balance={this.state.currentEthBalance}
          trxStatus={this.state.trxStatus}
        />
        <Notification 
          showNotification={this.state.showNotification}
          action={this.state.action}
          hash={this.state.hash}
          ref={this.notificationOne}
          trxStatus={this.state.trxStatus}
          confirmNum={this.state.confirmNum}
        />
        &nbsp;
        <h1 className='mt-5' id='title'>House Tokens</h1>
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
        
        &nbsp;
        &nbsp;   
        &nbsp;
        &nbsp;
        <hr/>
              
        <Main 
          houseItems = {this.state.houseTokenList}
          filteredHouseList = {this.state.filteredHouseList}
          buyHouse = {this.buyHouse}
          account = {this.state.account}
          changePrice = {this.changePrice}
          filterHouses = {this.filterHouses}
        />
      </div>
    );
  }
}

export default App;
