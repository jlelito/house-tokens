import React, { Component } from 'react';
import Identicon from 'identicon.js';
import ethlogo from './src_images/ETH.png';
import Card from './Card.js';




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
                  <Card
                    house={house}
                    changePrice={this.props.changePrice}
                    buyHouse={this.props.buyHouse}
                    account={this.props.account}
                  />
                
                  
                )
              })}
              
            </div>
          </main>
        
      </div>
    );
  }
}

export default Main;