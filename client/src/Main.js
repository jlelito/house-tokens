import React, { Component } from 'react';
import Identicon from 'identicon.js';
import ethlogo from './src_images/ETH.png';




const IMAGES_ARRAY = [
  {
    name: 'small house',
    img: './images/small_house.jpg'
  },
  {
    name: 'cool house',
    img: './images/cool_house.jpg'
  },
  
  {
    name: 'big house',
    img: './images/big_house.jpg'
  }
  
]


class Main extends Component {

  chooseImage = (sqFeet) => {
    if(sqFeet <= 500){
      return IMAGES_ARRAY[0].img
    }
    
    else if(sqFeet > 500 && sqFeet < 2000) {
      return IMAGES_ARRAY[1].img
    }
    else{
      return IMAGES_ARRAY[2].img
    }
    
  }

  render() {

    return (
      <div className="resume-section ">
        
          <main role="main" className="container-fluid d-flex justify-content-center">
            <div className="card-group justify-content-center">
              
              
              { this.props.houseItems.map((house, key) => {
                return(
                  <div className="row">
                  <div className="card mb-4 mx-4" key={key} >
                    <div className="card-header">
                      
                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:house/png;base64,${new Identicon(house.owner, 30).toString()}`}
                      />
                      <small className="text-muted">{house.owner}</small>
                    </div>
                    <ul id="houseList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center"><img src={this.chooseImage(house.sqFeet)} style={{ maxWidth: '350px', maxHeight: '150px'}}/></p>
                        <p>{house.homeAddress}</p>
                        <p>Square Feet: {house.sqFeet} sq/feet</p>
                        <p>Bedrooms: {house.bedrooms}</p>
                        <p>Bathrooms: {house.bathrooms}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          <b>Price: {window.web3.utils.fromWei(house.price, 'Ether')} Ether<img src={ethlogo} width='25' height='25'/></b>
                        </small>
                        {house.owner == this.props.account ? <small className="float-right text-muted pt-0 mt-1">You own this house!</small> : (
                        <button
                          className="btn btn-primary btn-sm float-right pt-0"
                          name={house.houseID}
                          onClick={(event) => {
                             let priceOfHouse = house.price
                             let houseID = house.houseID
                             console.log(priceOfHouse, houseID)
                            this.props.buyHouse(houseID, priceOfHouse)
                          }}
                        >
                          Buy this House!
                        </button>
                )}
                      </li>
                    </ul>
                 
                  </div>
                  </div>
                  
                  
                )
              })}
              
            </div>
          </main>
        
      </div>
    );
  }
}

export default Main;