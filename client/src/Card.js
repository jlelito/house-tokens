import React, { Component } from 'react';
import ethlogo from './src_images/ETH.png';
import Identicon from 'identicon.js';
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

class Card extends Component {

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
      const web3 = new Web3(window.ethereum)
  
      return (
        <div> 
            <main role='main' className='container-fluid d-flex justify-content-center' >
              <div className='card-group justify-content-center' style={{ maxWidth: '375px' }}>
                <div className='row'>
                  <div className='card mb-4 mx-4' >
                    <div className='card-header'>
                      <img
                        className='mr-2 float-left rounded'
                        width='20'
                        height='20'
                        src={`data:house/png;base64,${new Identicon(this.props.house.owner, 30).toString()}`}
                        alt='identicon'
                      />
                      <small className='text-muted'>{this.props.house.owner}</small>
                    </div>
                    <ul id='houseList' className='list-group list-group-flush'>
                      <li className='list-group-item'>
                        <p className='text-center'><img src={this.chooseImage(this.props.house.sqFeet)} style={{ maxWidth: '350px', maxHeight: '150px'}} alt='house'/></p>
                        <p>{this.props.house.homeAddress}</p>
                        <p>Square Feet: {this.props.house.sqFeet} sq/feet</p>
                        <p>Bedrooms: {this.props.house.bedrooms}</p>
                        <p>Bathrooms: {this.props.house.bathrooms}</p>
                      </li>
                      <li  className='list-group-item py-2'>
                          
                        <small className='float-left mt-1 text-muted'>
                          <b>Price: {web3.utils.fromWei(this.props.house.price, 'Ether')} Ether<img src={ethlogo} width='25' height='25' alt='eth-logo'/></b>
                        </small>
                        {this.props.house.owner === this.props.account ? 

                        <>
                        <form 
                          className='float-right'
                          onSubmit={(event) => {
                          event.preventDefault()
                          let newPrice
                          newPrice = this.inputAmount.value.toString()                         
                          this.props.changePrice(this.props.house.houseID, newPrice)
                          this.inputAmount.value = null
                          
                        }}>
                          <div className='input-group'>
                              
                                  <input
                                      type='number'
                                      ref={(inputAmount) => { this.inputAmount = inputAmount }}
                                      className='form-control form-control-sm mr-1'
                                      placeholder='0.0'
                                      step='.01'
                                      min='0'
                                      style={{ width: '55px' }}
                                      required 
                                  />
                              
                              <span className='input-group-btn'>
                                  <button type='submit' className='btn btn-primary btn-sm' >
                                      Change Price
                                  </button>
                              </span>
                          </div>
                        </form> 
                        </>
                        
                        : (
                          <button
                            className='btn btn-primary btn-sm float-right pt-0 mt-1'
                            name={this.props.house.houseID}
                            onClick={(event) => {
                              event.preventDefault()
                              let priceOfHouse = this.props.house.price
                              let houseID = this.props.house.houseID
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
              </div>
            </main>
          
        </div>
      );
    }
  }
  
  export default Card;