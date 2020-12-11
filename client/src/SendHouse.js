
import React, { Component } from 'react';

class SendHouse extends Component {

    
  
    render() {
  
      return (
        <div className="col-sm-5">
            
            {this.props.houseTokenBalance == 0 ? <h2>No House Tokens Owned!</h2> : (
              <>
            <h2 className="mb-4">Send House Token</h2>
            <form className="mb-3" onSubmit={(event) => {
                            event.preventDefault()
                            let amount, targetAddress
                            amount = this.inputAmount.value.toString()
                            targetAddress = this.targetAddress.value
                            this.props.sendTokens(amount, targetAddress)

                            
              }}>
                           
                        <div className="container">
                          <div className="row justify-content-center">
                            <div className="form-group mb-4 col-9">
                              <label className="mx-2">Address</label>
                                <input
                                type="text"
                                ref={(targetAddress) => { this.targetAddress = targetAddress }}
                                className="form-control form-control-lg"
                                placeholder="0x0...."
                                required />
                            </div>
                            
                            <div className="form-group mb-4 col-sm-3">
                              <label className="mx-2">House ID</label>
                              <select className="form-control form-control-lg" id="houseIDSelect" ref={(inputAmount) => { this.inputAmount = inputAmount }}>
                                {this.props.houseTokenList.map(house => (
                                  <>
                                    {this.props.account == house.owner ? (
                                      
                                    <option>
                                      {house.houseID}
                                    </option>
                                    
                                    ) : null}
                                  </>


                                ))}
                              </select>
                            </div>
                            

                          </div>

                          <button type="submit" className="btn btn-primary btn-lg col-md-2" >
                              Send!
                          </button>
                        </div>   
              </form>
              </>
            )}
          </div>
      );
    }
  }
  
  export default SendHouse;