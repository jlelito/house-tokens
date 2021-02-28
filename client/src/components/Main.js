import React, { Component } from 'react';
import filter from '../src_images/filter.png';
import magnify from '../src_images/magnify.png';
import CurrentHouses from './CurrentHouses.js';
import Web3 from 'web3';

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

  componentDidMount() {
    this.sortHouses('squareFt')
    this.paginate.current.paginate(1)
  }

  constructor(props) {
    super(props)
    this.paginate = React.createRef()
  }

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

  sortHouses = e => {
    //Sort SquareFeet Descending 
    if(e === 'squareFt'){
      let sortedList = this.props.filteredHouseList.sort(function(a,b){
        return b.sqFeet - a.sqFeet
      })
      this.props.filterHouses(sortedList)
    }
    //Sort Bathrooms Descending
    else if(e === 'bathrooms'){
      let sortedList = this.props.filteredHouseList.sort(function(a,b){
        return b.bathrooms - a.bathrooms
      })
      this.props.filterHouses(sortedList)
    }
    //Sort Bedrooms Descending
    else if(e === 'bedrooms'){
      let sortedList = this.props.filteredHouseList.sort(function(a,b){
        return b.bedrooms - a.bedrooms
      })
      this.props.filterHouses(sortedList)
    }
    //Sort Price Descending
    else if(e === 'price'){
      let sortedList = this.props.filteredHouseList.sort(function(a,b){
        return b.price - a.price
      })
      this.props.filterHouses(sortedList)
    }
    //Nothing selected
    else{
      console.log('Nothing Chosen!')
    }
  }

  render() {
    const web3 = new Web3(window.ethereum)
    return (
      <div className='resume-section mt-3'>
        <form className='mb-3 form-inline' onSubmit={async (event) => {
            event.preventDefault()
            let bedrooms, bathrooms, price, sqFeetFilter, searchInput
            
            bedrooms = this.bedroomsInputAmount.value.toString()
            bathrooms = this.bathroomsInputAmount.value.toString()
            sqFeetFilter = this.sqFeetInputAmount.value.toString()
            price = web3.utils.toWei(this.priceInputAmount.value.toString(), 'Ether')
            searchInput = this.searchInput.value.toString()
            
            let filteredHouses = this.props.houseItems.filter(house => house.bedrooms >= parseInt(bedrooms)
              && house.bathrooms >= parseInt(bathrooms)
              && house.sqFeet >= parseInt(sqFeetFilter)
              && house.price >= parseInt(price)
              && house.homeAddress.toLowerCase().includes(searchInput.toLowerCase())
            )
            this.props.filterHouses(filteredHouses)
            await this.paginate.current.paginate(1)                   
        }}>
        <div className='container'>
          <div className='form-row justify-content-center'>
            <div className='col-auto'>
              <label>Search</label> 
              <div className='input-group'>
                <img src={magnify} className='float-right mt-1' width='35' height='35' alt='magnify'/>
                <input className='form-control form-control' type='text' placeholder='Search...' ref={(searchInput) => { this.searchInput = searchInput }}
                  aria-label='Search'>
                </input>
              </div>
            </div>
            <div className='col-auto'>
              <label>Bedrooms</label>
              <select className='form-control' id='houseFilterBedrooms' ref={(bedroomsInputAmount) => { this.bedroomsInputAmount = bedroomsInputAmount }}>               
                <option value='0'>
                  Any
                </option>
                <option value='1'>
                  1+
                </option>
                <option value='2'>
                  2+
                </option>
                <option value='3'>
                  3+
                </option>
                <option value='4'>
                  4+
                </option>
                <option value='5'>
                  5+
                </option>                  
              </select>
            </div>
            <div className='col-auto mr-2'>
              <label>Bathrooms</label>
              <select className='form-control' id='houseFilterBathrooms' ref={(bathroomsInputAmount) => { this.bathroomsInputAmount = bathroomsInputAmount }}>                 
                <option value='0'>
                  Any
                </option>
                <option value='1'>
                  1+
                </option>
                <option value='2'>
                  2+
                </option>
                <option value='3'>
                  3+
                </option>
                <option value='4'>
                  4+
                </option>
                <option value='5'>
                  5+
                </option>              
              </select>
            </div>
            <div className='col-auto mr-2'>
              <label>Square Feet</label>
              <select className='form-control' id='houseFilterSqFeet' ref={(sqFeetInputAmount) => { this.sqFeetInputAmount = sqFeetInputAmount }}>              
                <option value='0'>
                  Any
                </option>                 
                <option value='500'>
                  500+ sq/feet
                </option>
                <option value='1000'>
                  1000+ sq/feet
                </option>
                <option value='1500'>
                  1500+ sq/feet
                </option>
                <option value='3000'>
                  3000+ sq/feet
                </option>
                <option value='5000'>
                  5000+ sq/feet
                </option>                 
              </select>
            </div>
            <div className='col-auto'>
              <label>Price</label>
              <select className='form-control' id='houseFilterPrice' ref={(priceInputAmount) => { this.priceInputAmount = priceInputAmount }}>                  
                <option value='0'>
                  Any
                </option>
                <option value='1'>
                  1+ ETH
                </option>
                <option value='2'>
                  2+ ETH 
                </option>
                <option value='3'>
                  3+ ETH
                </option>
                <option value='4'>
                  4+ ETH
                </option>
                <option value='5'>
                  5+ ETH
                </option>
                <option value='10'>
                  10+ ETH
                </option>                   
              </select>
            </div>
            <div className='col-auto'>
              <button type='submit' className='btn btn-primary mt-4' >
                Filter
                <img
                    className='ml-2 mt-1 float-right rounded'
                    width='15'
                    height='15'
                    src={filter}
                    alt='filter'
                />
              </button>
              
            </div>
            <button type='button' className='btn btn-primary mt-4' onClick={() =>
              {
                this.sqFeetInputAmount.value = 0
                this.bathroomsInputAmount.value = 0
                this.bedroomsInputAmount.value = 0
                this.priceInputAmount.value = 0
                this.searchInput.value = null
              }
            }>
                Reset
            </button>
            </div>
          </div>
        </form>
          
          
            <div className='form-group row float-right'>
              <div className='col-12 mr-5'>
                <label className='mr-2'>Sort by:</label>
                <select className='form-control-sm mb-2 mr-1' id='houseSort' 
                  ref={(sortInputAmount) => { this.sortInputAmount = sortInputAmount }}
                  onChange={() => {
                    this.sortHouses(this.sortInputAmount.value.toString())
                    this.paginate.current.paginate(1)
                    }
                  }
                >
                  <option value='squareFt'>
                      Square Feet
                  </option>
                  <option value='bathrooms'>
                      Bathrooms
                  </option> 
                  <option value='bedrooms'>
                      Bedrooms
                  </option> 
                  <option value='price'>
                      Price
                  </option>                            
                </select>
                
              </div>
            </div>
          
          <CurrentHouses
            houseList = {this.props.filteredHouseList}
            changePrice = {this.props.changePrice}
            buyHouse = {this.props.buyHouse}
            account = {this.props.account}
            ref = {this.paginate}
            isConnected = {this.props.isConnected}
          /> 
      </div>
    );
  }
}

export default Main;