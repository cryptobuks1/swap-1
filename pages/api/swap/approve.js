import axios from 'axios';
import Web3 from 'web3'

export default async function handler(req, res) {
  // POST info
  const INFURA_KEY = process.env.INFURA_KEY
  const eth_provider = `https://mainnet.infura.io/v3/${INFURA_KEY}`
  const eth_testnet_provider = 'http://127.0.0.1:8545'
  const bsc_provider = 'https://bsc-dataseed1.binance.org:443'
  const networkId = req.body.networkId
  let web3 = new Web3(networkId === 1 ? eth_provider : bsc_provider)

  const from_token_address = req.body.fromToken
  const to_token_address = req.body.toToken
  const privateKey = req.body.privateKey
  const slippage = req.body.slippage
  const gasPrice = req.body.gasPrice
  const amount =  req.body.amountToSell
  const number_of_tokens_in_wei = parseInt(await web3.utils.toWei(parseFloat(amount).toFixed(15).toString(), 'ether'))

  console.log({
    from_token_address,
    to_token_address,
    privateKey,
    slippage,
    amount,
    number_of_tokens_in_wei
  })

  // main method
  async function mainDriver() {
    const data = await approve()
    const approvePromise = await web3.eth.accounts.signTransaction(data, privateKey)
    console.log('approvePromise', approvePromise)
    const sentTx = await web3.eth.sendSignedTransaction(approvePromise.raw || approvePromise.rawTransaction)
    console.log('sentTx', sentTx)
    return await waitTransaction(sentTx.transactionHash)
  }

  async function approve() {
    let url = `https://api.1inch.exchange/v3.0/${networkId}/approve/calldata?infinity=true&tokenAddress=` + from_token_address;
    console.log(url)

    let temp = await axios.get(url);
    temp = temp.data;
    temp['gas'] = gasPrice * 10 ** 9


    let val = parseInt(temp["value"])
    val = '0x' + val.toString(16)
    temp["value"] = val

    console.log('approve', temp)

    return temp; 
  }

  // sleep and waitTransaction for approval purposes
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function waitTransaction(txHash) {
    let tx = null;
    while (tx == null) {
      tx = await web3.eth.getTransactionReceipt(txHash);
      console.log('again',tx)
      await sleep(2000);
    }
    console.log("Transaction " + txHash + " was mined.");
    return {approved: tx.status, hash: txHash};
  }

  res.status(200).json(await mainDriver())
}