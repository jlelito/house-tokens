import React, { Component } from 'react';
import Card from './Card.js';
import filter from './src_images/filter.png';
import magnify from './src_images/magnify.png';


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

  sortHouses = (e) => {
    console.log(e.target.value)
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
                            let bedrooms, bathrooms, price, sqFeetFilter, searchInput
                            
                            bedrooms = this.bedroomsInputAmount.value.toString()
                            bathrooms = this.bathroomsInputAmount.value.toString()
                            sqFeetFilter = this.sqFeetInputAmount.value.toString()
                            
                            price = window.web3.utils.toWei(this.priceInputAmount.value.toString(), 'Ether')
                            searchInput = this.searchInput.value.toString()
                            
                            
                            let newFilteredHouses = this.props.houseItems.filter(house => house.bedrooms >= parseInt(bedrooms)
                            && house.bathrooms >= parseInt(bathrooms)
                            && house.sqFeet >= parseInt(sqFeetFilter)
                            && house.price >= parseInt(price)
                            && house.homeAddress.toLowerCase().includes(searchInput.toLowerCase())
                            )
                          
                    
                            console.log(newFilteredHouses)
                            this.setState({filteredHouseList: newFilteredHouses})
                            
                            
        }}>
        <div className="container">
          <div className="form-row justify-content-center mb-1">
            <div className="col-auto">
            
              <label>Search</label> 
              <div className="input-group">
                <img src={magnify} className="float-right mt-1" width='35' height='35'/>
                <input class="form-control form-control" type="text" placeholder="Search..." ref={(searchInput) => { this.searchInput = searchInput }}
                  aria-label="Search">
                  
                </input>
              </div>
              
            </div>
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

          <form className="float-right" onChange>
          <div className="row form-group">
          
            <div className="col-lg-6 mr-2">
            <label className="mr-1">Sort by:</label>
              <select className="form-control-sm float-right mb-2" id="houseSort" 
              onChange={(e) => {this.sortHouses(e)}}
              >
                <option value="squareFt">
                    Square Feet
                </option>
                <option value="bedrooms">
                    Bathrooms
                </option> 
                <option value="bedrooms">
                    Bedrooms
                </option> 
                <option value="price">
                    Price
                </option>                            
              </select>
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