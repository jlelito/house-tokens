import React, { Component } from 'react';
import Identicon from 'identicon.js';
import ethlogo from './src_images/ETH.png';


class HouseTable extends Component {

render() {

        return (
            <table className="table table-striped table-hover mt-1">
            <caption>Owned Houses</caption>
              <thead className="thead-light">
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
                <tr className="justify-content-center" key={house.houseID}>
                {this.props.account == house.owner ? (
                        <>
                            <td>{house.houseID}
                              <img
                                className='float-left'
                                width='30'
                                height='30'
                                src={`data:house/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                              />
                            </td>
                            <td>{house.homeAddress}</td>
                            <td>{house.sqFeet}</td>
                            <td>{window.web3.utils.fromWei(house.price, 'Ether')} ETH <img src={ethlogo} width='25' height='25'/> </td>
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