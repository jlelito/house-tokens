import React, { Component } from 'react';
import Identicon from 'identicon.js';
import ethlogo from '../src_images/ETH.png';
import coloreth from '../src_images/eth-diamond-rainbow.png';


class Navbar extends Component {

  componentDidMount() {
    console.log('Navbar account state: ', this.props.account)
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
              <div id='account' className='text-white'>{this.props.account}</div>
            
            {this.props.account !== null
              ? <img
                className='ml-2 float-right rounded'
                width='30'
                height='30'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                alt='identicon'
              />
              : <span></span>
            }
            
            </div>
            <div id='account' className='row'>
              <div className='mr-2'>
              {this.props.network === 3 ?
                <span className='badge badge-pill badge-warning'>Ropsten</span> : 
                this.props.network === 1 ? <span className='badge badge-pill badge-warning'>Mainnet</span> :
                this.props.network === 4 ? <span className='badge badge-pill badge-warning'>Rinkeby</span> :
                this.props.network === 5 ? <span className='badge badge-pill badge-warning'>Goerli</span> :
                this.props.network === 42 ? <span className='badge badge-pill badge-warning'>Kovan</span> :
                <span className='badge badge-pill badge-warning'>Unknown Network : {this.props.network}</span>
              }
              
              </div>
              <div id='balance' className='text-white'>ETH Balance: {Number(this.props.balance).toFixed(3)} </div>
              <img className='mb-1' src={ethlogo} width='25' height='25' alt='ethlogo'/>
              <div className='text-white mx-2'>Ropsten Faucet: <a href='https://faucet.ropsten.be/' target='_blank' rel='noopener noreferrer'>Faucet</a></div>
            </div>

          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;