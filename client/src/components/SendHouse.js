import React, { Component } from 'react';
import sendhouse from '../src_images/sendhouse.jpg'

/*Form Component for Send House */
class SendHouse extends Component {

    render() {
  
      return (
        <div className='col-auto'>
            {this.props.houseTokenBalance === 0 ? <h2>No House Tokens Owned!</h2> : (
            <>
              <h2 className='mb-3'>Send House Token
                <img src={sendhouse} className='ml-2' width='75' height='75' alt='send-house'/>
              </h2> 
              <form className='mb-3' onSubmit={(event) => {
                    event.preventDefault()
                    let amount, targetAddress
                    amount = this.inputAmount.value.toString()
                    targetAddress = this.targetAddress.value
                    this.props.sendTokens(amount, targetAddress)
                    this.inputAmount.value = null
                    this.targetAddress = null             
                }}>
                            
                    <div className='row justify-content-center'>
                      <div className='form-group mb-4 col-auto'>
                        <label className='mx-2'>Address</label>
                          <input
                          type='text'
                          ref={(targetAddress) => { this.targetAddress = targetAddress }}
                          className='form-control form-control-lg'
                          placeholder='0x0...'
                          required />
                      </div>
                      
                      <div className='form-group mb-4 col-auto'>
                        <label className='mx-2'>House ID</label>
                        <select className='form-control form-control-lg' id='houseIDSelect' ref={(inputAmount) => { this.inputAmount = inputAmount }}>
                          {this.props.houseTokenList.map(house => (
                            
                          <React.Fragment key={house.houseID}>
                              {this.props.account === house.owner ? (
                                <option key={house.houseID}>
                                  {house.houseID}
                                </option>
                              ) : null}
                          </React.Fragment>
                            
                          ))}
                        </select>
                      </div>
                    </div>
                    <button type='submit' className='btn btn-primary btn-lg col-auto' >
                        Send!
                    </button>
                </form>
              </>
            )}
        </div>
      );
    }
  }
  
  export default SendHouse;