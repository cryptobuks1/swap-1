import Web3 from 'web3'
require('dotenv').config()

export default async function handler(req, res) {
  let symbol = req.body.symbol
  let tokenAddress = req.body.tokenAddress;
  let walletAddress = req.body.walletAddress;
  
  const INFURA_KEY = process.env.INFURA_KEY
  const eth_provider = `https://mainnet.infura.io/v3/${INFURA_KEY}`
  const eth_testnet_provider = 'http://127.0.0.1:8545'
  const bsc_provider = 'https://bsc-dataseed1.binance.org:443'
  const networkId = req.body.networkId
  let web3 = new Web3(networkId === 1 ? eth_testnet_provider : bsc_provider)

  if(symbol === 'BNB' || symbol === 'ETH' || symbol === 'MATIC') {
    let balance = await web3.eth.getBalance(walletAddress)
    res.status(200).json(web3.utils.fromWei(balance))
  } else {
    // The minimum ABI to get ERC20 Token balance
    let minABI = [
      // balanceOf
      {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
      },
      // decimals
      {
        "constant":true,
        "inputs":[],
        "name":"decimals",
        "outputs":[{"name":"","type":"uint8"}],
        "type":"function"
      }
    ];
  
    let contract = new web3.eth.Contract(minABI, tokenAddress);
    async function getBalance() {
      let balance = await contract.methods.balanceOf(walletAddress).call();
      let decimals = await contract.methods.decimals().call()
      return balance / (10 ** decimals);
    }

    res.status(200).json(await getBalance())
  }
}