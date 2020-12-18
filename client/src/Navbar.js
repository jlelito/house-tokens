import React, { Component } from 'react';
import Identicon from 'identicon.js';
import smile from './src_images/smiley.jpg'
import coloreth from './src_images/eth-diamond-rainbow.png';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={coloreth} width="20" height="30" className="d-inline-block align-top mr-2" alt="rainbow eth logo" />
          House Tokens!
        </a>
        <div className="justify-content-center text-white">
          Transaction :  
          <a className="text-green ml-2" href={`https://etherscan.io/tx/${this.props.hash}`} target="_blank">
            {this.props.hash}
          </a> 
        </div>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account" className="text-white">{this.props.account}</small>
            </small>
            { this.props.account
              ? <img
                className='ml-2'
                width='30'
                height='30'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
              />
              : <span></span>
            }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;