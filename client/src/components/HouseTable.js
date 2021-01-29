import React, { Component } from 'react';
import Identicon from 'identicon.js';
import ethlogo from '../src_images/ETH.png';
import Web3 from 'web3';


class HouseTable extends Component {


render() {
    const web3 = new Web3(window.ethereum)
        return (
            <table className='table table-striped table-hover mt-1'>
            <caption>Owned Houses</caption>
              <thead className='thead-light'>
                          <tr>
                              <th>House ID</th>
                              <th>Address</th>
                              <th>Square Feet</th>
                              <th>Price</th>
                              <th>Bedrooms</th>
                              <th>Bathrooms</th>
                          </tr>
              </thead>
              <tbody>
              {this.props.houseTokenList.map(house => (
                <tr className='justify-content-center' key={house.houseID}>
                {this.props.account === house.owner ? (
                        <>
                            <td>{house.houseID}
                              <img
                                className='float-left rounded'
                                width='30'
                                height='30'
                                src={`data:house/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                                alt='identicon'
                              />
                            </td>
                            <td>{house.homeAddress}</td>
                            <td>{house.sqFeet} sq/ft</td>
                            <td>{web3.utils.fromWei(house.price, 'Ether')} ETH <img src={ethlogo} className='float-right' width='20' height='20' alt='eth-logo'/> </td>
                            <td>{house.bedrooms}</td>
                            <td>{house.bathrooms}</td>
                        </>
                        
                ) : null}
                </tr>
                  ))}
                  </tbody>
            </table>
        );
}

}
export default HouseTable;