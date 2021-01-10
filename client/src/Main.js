import React, { Component } from 'react';
import Card from './Card.js';
import filter from './src_images/filter.png';


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

  filterHouses = (sqFeet) => {
    return sqFeet > 300
  }

  constructor(props) {
    super(props)
    this.state = {
      filteredHouseList : this.props.houseItems
    }
  }
  render() {

    return (
      <div className="resume-section">
        
          
        <form className="mb-3 form-inline" onSubmit={(event) => {
                            event.preventDefault()
                            let bedrooms, bathrooms, price, sqFeetFilter
                            
                            bedrooms = this.bedroomsInputAmount.value.toString()
                            bathrooms = this.bathroomsInputAmount.value.toString()
                            sqFeetFilter = this.sqFeetInputAmount.value.toString()
                            price = this.priceInputAmount.value.toString()
                            price = window.web3.utils.toWei(price, 'Ether')
                           
                            
                            let newFilteredHouses = this.props.houseItems.filter(house => house.bedrooms >= parseInt(bedrooms)
                            && house.bathrooms >= parseInt(bathrooms)
                            && house.sqFeet >= parseInt(sqFeetFilter)
                            && house.price >= parseInt(price)
                            )
                          
                    
                            console.log(newFilteredHouses)
                            this.setState({filteredHouseList: newFilteredHouses})
                            
                            
        }}>
        <div className="container">
          <div className="form-row float-right mb-3">
            <div className="col-auto">
              <label>Bedrooms</label>
              <select className="form-control" id="houseFilterBedrooms" ref={(bedroomsInputAmount) => { this.bedroomsInputAmount = bedroomsInputAmount }}>
                                    
                <option value="0">
                  Any
                </option>
                <option value="1">
                  1+
                </option>
                <option value="2">
                  2+
                </option>
                <option value="3">
                  3+
                </option>
                <option value="4">
                  4+
                </option>
                <option value="5">
                  5+
                </option>
                                    
              </select>
            </div>
            <div className="col-auto mr-2">
              <label>Bathrooms</label>
              <select className="form-control" id="houseFilterBathrooms" ref={(bathroomsInputAmount) => { this.bathroomsInputAmount = bathroomsInputAmount }}>
                                      
                <option value="0">
                  Any
                </option>
                <option value="1">
                  1+
                </option>
                <option value="2">
                  2+
                </option>
                <option value="3">
                  3+
                </option>
                <option value="4">
                  4+
                </option>
                <option value="5">
                  5+
                </option>
                                      
              </select>
            </div>
            <div className="col-auto mr-2">
              <label>Square Feet</label>
              <select className="form-control" id="houseFilterSqFeet" ref={(sqFeetInputAmount) => { this.sqFeetInputAmount = sqFeetInputAmount }}>
                                    
                <option value="0">
                  Any
                </option>                 
                <option value="500">
                  500+ sq/feet
                </option>
                <option value="1000">
                  1000+ sq/feet
                </option>
                <option value="1500">
                  1500+ sq/feet
                </option>
                <option value="3000">
                  3000+ sq/feet
                </option>
                <option value="5000">
                  5000+ sq/feet
                </option>
                                    
              </select>
            </div>
            <div className="col-auto">
              <label>Price</label>
              <select className="form-control" id="houseFilterBathrooms" ref={(priceInputAmount) => { this.priceInputAmount = priceInputAmount }}>
                                    
                <option value="0">
                  Any
                </option>
                <option value="1">
                  1+ ETH
                </option>
                <option value="2">
                  2+ ETH 
                </option>
                <option value="3">
                  3+ ETH
                </option>
                <option value="4">
                  4+ ETH
                </option>
                <option value="5">
                  5+ ETH
                </option>
                <option value="10">
                  10+ ETH
                </option>
                                    
                  </select>
            </div>
                  <div className="col-auto">
                    <button type="submit" className="btn btn-primary mt-4" >
                      Filter
                      <img
                          className='ml-2 mt-1 float-right rounded'
                          width='15'
                          height='15'
                          src={filter}
                      />
                    </button>
                  </div>
                </div>
              </div>
          </form>
          
          
          <main role="main" className="container-fluid d-flex justify-content-center">
          
            <div className="card-group justify-content-center">
            
              { 
              
              this.state.filteredHouseList.length == 0 ? <h2>No Houses Found!</h2> : 
              
              this.state.filteredHouseList.map((house, key) => {
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