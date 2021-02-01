import React, { Component } from 'react';

class WrongNetwork extends Component {

render() {
    return(
        <>
        <div className='row justify-content-center mt-5'><h1 className='mt-5'>Please connect to Ropsten!</h1></div> 
          <h2 className='row justify-content-center mt-4'>Current Network: 
            {
              this.props.network === 1 ? ' Mainnet' :
              this.props.network === 4 ? ' Rinkeby' :
              this.props.network === 5 ? ' Goerli' :
              this.props.network === 42 ? ' Kovan':
              <>{this.props.network}</>
            }
          </h2>
          </>
    )
}


}

export default WrongNetwork