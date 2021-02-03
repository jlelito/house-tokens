import React, { Component } from 'react';
import Identicon from 'identicon.js';
import ethlogo from '../src_images/ETH.png';
import coloreth from '../src_images/eth-diamond-rainbow.png';
import 'react-bootstrap';
import  { MetaMaskButton, Pill }  from '../../node_modules/rimble-ui';
import AccountModal from '../components/AccountModal.js';


class Navbar extends Component {

  componentDidMount() {
    console.log('Navbar account: ', this.props.account)
  }

  connectWallet () {
    window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  render() {
    return (
      
      <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
        <div
          className='navbar-brand col-sm-3 col-md-2 mr-0'
          target='_blank'
          rel='noopener noreferrer'
        >
          <img src={coloreth} width='20' height='30' className='d-inline-block align-top mr-2' alt='rainbow eth logo' />
          House Tokens
        </div>
        <ul className='navbar-nav px-3'>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
            <div className='text-secondary row'>
              
            
            {this.props.account !== null
              ? 
              <>
                <div id='account' className='text-white float-right mt-1'>
                  <AccountModal account={this.props.account}/> 
                </div>
                <img
                  className='mr-2 ml-1 float-right rounded mt-1'
                  width='30'
                  height='30'
                  src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                  alt='identicon'
                />
              </>
              : <span></span>
            }
            
            <>
            {!this.props.isConnected ? 
              <>
                <Pill className='mr-2 my-2' color="red">Connect to a Wallet</Pill>
                <MetaMaskButton.Outline className='my-2' size='small' onClick={() => this.connectWallet()}>Connect with Metamask</MetaMaskButton.Outline>
              </>
              : 
              <>
                <Pill className='mr-2 my-1' color="green">Connected</Pill>
                <div id='balance' className='text-white my-1'>{Number(this.props.balance).toFixed(3)} ETH</div>
                <img className='my-1' src={ethlogo} width='25' height='25' alt='ethlogo'/>  
              </>
            }
            </>
              <div className='text-white mx-2 my-1'>Ropsten Faucet: <a href='https://faucet.ropsten.be/' target='_blank' rel='noopener noreferrer'>Faucet</a></div>
            </div>

          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;