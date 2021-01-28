import Web3 from 'web3'

const loadWeb3 = async function() {
    
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.web3.eth_requestAccounts
        }
        else if (window.web3) {
          window.web3 = new Web3(window.ethereum)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      
      
  }
  
  export default loadWeb3;