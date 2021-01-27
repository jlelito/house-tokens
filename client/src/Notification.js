import React, { Component } from 'react';
import { Toast } from 'react-bootstrap';
import Loader from 'react-loader-spinner'



class Notification extends Component {

    updateShowNotify = () => this.setState({showA: true});
    updateCloseNotify = () => this.setState({showA: false})

    constructor(props) {
        super(props)
        this.state= {
            showA: true
        }
    }

    render() {
        return (
        <div className='row fixed-top mt-5'>
            <Toast className='mt-4 ml-4' show={this.state.showA} onClose={this.updateCloseNotify}>
                <Toast.Header>
                    <strong className="mr-auto">{this.props.action}</strong>
                    <small>1 second ago</small>
                </Toast.Header>
                
                <Toast.Body>
                <div className='row'>
                    <div className='col-12 float-left'>
                        <div><b>{this.props.action}</b></div>

                        <div className='row justify-content-center'>
                            Status of Transaction:
                            {this.props.trxStatus === 'Pending' ? 
                                <>
                                <b>Pending</b>
                                
                                <Loader 
                                    className='ml-2'
                                    type="Oval"
                                    color="#00BFFF"
                                    height={15}
                                    width={15}
                                /> 
                                </>
                                :   
                                <>
                                {this.props.trxStatus === 'Success' ? <b className='text-success'>Success</b> : 
                                <b className='text-danger'>Failed</b>}
                                </>
                            
                            
                            }
                        </div>
                        Transaction:
                        <a className="ml-2" href={`https://ropsten.etherscan.io/tx/${this.props.hash}`} target="_blank" rel="noreferrer">
                            Link
                        </a>
                        
                    </div>
                </div>
                </Toast.Body>
            </Toast>  
        </div>
        );
    }
  }

  export default Notification;