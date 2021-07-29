import Web3 from 'web3'

export default async function handler(req, res) {
  let web3 = new Web3('https://bsc-dataseed1.binance.org:443');

  let walletAddress = req.body.walletAddress;
  let balance = await web3.eth.getBalance(walletAddress);

  res.status(200).json(web3.utils.fromWei(balance))
}