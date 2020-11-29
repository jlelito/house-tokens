import React, { Component } from 'react';
import Identicon from 'identicon.js';



class HouseTable extends Component {

render() {

        return (
        <div className="row justify-content-center">
                <div className="col-auto">
                    <table className="table table-striped table-hover mt-5">
                    <caption>House Token Info</caption>
                        <thead className="thead-light">
                        <tr>
                            <th>Token Id</th>
                            <th>Owner</th>
                            <th>Address</th>
                            <th>Square Feet</th>
                            <th>Price</th>
                            <th>Bedrooms</th>
                            <th>Bathrooms</th>
                            <th>Own House?</th>
                        </tr>
                        </thead>
                    <tbody>
                        

                        {this.props.houseTokenList.map(house => (
                        <tr key={house.houseID}>
                            <td>{house.houseID}</td>
                            <td>
                            <img
                                className='ml-2'
                                width='30'
                                height='30'
                                src={`data:image/png;base64,${new Identicon(house.owner, 30).toString()}`}
                            /> 
                                {house.owner}
                            </td>
                            <td>{house.homeAddress}</td>
                            <td>{house.sqFeet}</td>
                            <td>{window.web3.utils.fromWei(house.price, 'Ether')} Ether</td>
                            <td>{house.bedrooms}</td>
                            <td>{house.bathrooms}</td>
                            <td>{this.props.account != house.owner ? (
                            <p className="text-danger">No</p>
                            ) : <p className="text-success">Yes</p>}
                            </td>
                        </tr>

                        ))}

                    </tbody>
                    </table>
                </div>
                </div>
        );
}

}
export default HouseTable;