import React, { Component } from 'react';

class MintHouse extends Component {
  
    render() {
  
      return (
        <div>
        {this.props.account === this.props.admin ? (
            <>
            
            <h3 className='my-4'>Mint House Token</h3>
            
            <form className='mb-3' 
                      onSubmit={(event) => {
                      event.preventDefault()
                      let homeAddress, homeSquarefeet, homePrice, homeBedrooms, homeBathrooms
                      homeAddress = this.address.value
                      homeSquarefeet = this.squareFeet.value.toString()
                      homePrice = this.price.value.toString()
                      homeBedrooms = this.bedrooms.value.toString()
                      homeBathrooms = this.bathrooms.value.toString()
                      this.props.mintHouse(homeAddress, homeSquarefeet, homePrice, homeBedrooms, homeBathrooms)
                      this.address.value = null
                      this.squareFeet.value = null
                      this.price.value = null
                      this.bedrooms.value = null
                      this.bathrooms.value = null        
              }}>
                      
                      <div className='input-group row justify-content-center'>
                          <div className='form-group col-md-6'>
                            <label>Address of House</label>
                              <input
                              type='text'
                              ref={(address) => { this.address = address }}
                              className='form-control form-control-lg'
                              placeholder='221 First Street...'
                              required />
                          </div>
                      </div>
                      
                      <div className='row justify-content-center'>
                        <div className='form-group col-sm-3'>
                          <label className='text-center'>Square Feet</label>
                            <input
                            type='number'
                            ref={(squareFeet) => { this.squareFeet = squareFeet }}
                            className='form-control form-control-lg'
                            placeholder='0'
                            required /> 
                        </div>
                        
                        <div className='form-group col-sm-3'>
                          <label className='text-center'>Price</label>
                            <input
                            type='number'
                            step='.01'
                            ref={(price) => { this.price = price }}
                            className='form-control form-control-lg'
                            placeholder='0 ETH'
                            required /> 
                        </div>
                      </div>
                        

                      <div className='mb-4 row justify-content-center'>
                        <div className='col-sm-3'>
                          <label className='text-center'>Number of Bedrooms</label>
                            <input
                            type='number'
                            ref={(bedrooms) => { this.bedrooms = bedrooms }}
                            className='form-control form-control-lg'
                            placeholder='0'
                            required /> 
                        </div>
                        
                        <div className='col-sm-3'>
                          <label className='text-center'>Number of Bathrooms</label>
                            <input
                            type='number'
                            ref={(bathrooms) => { this.bathrooms = bathrooms }}
                            className='form-control form-control-lg'
                            placeholder='0'
                            required /> 
                        </div>
                      </div>
                      <button type='submit' className='btn btn-primary  btn-lg'>Mint House!</button>
            </form>
            
            </>
            
            ) : null}
        </div>
      );
    }
  }
  
  export default MintHouse;