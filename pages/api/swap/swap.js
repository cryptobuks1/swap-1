import axios from 'axios';
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import Router from 'next/router'

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
  const amount =  req.body.amountToSell
  const number_of_tokens_in_wei = new BigNumber(parseInt(await web3.utils.toWei(parseFloat(amount).toFixed(15).toString(), 'ether')))

  const referrerAddress = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'
  const referrerFee = 1

  console.log({
    from_token_address,
    to_token_address,
    privateKey,
    slippage,
    amount,
    number_of_tokens_in_wei
  })

  // grab Wallet information
  const wallet = web3.eth.accounts.privateKeyToAccount(privateKey)

  const callURL = `https://api.1inch.exchange/v3.0/${networkId}/swap?`+ 
    `fromTokenAddress=${from_token_address}&` +
    `toTokenAddress=${to_token_address}&` +
    `amount=${number_of_tokens_in_wei.toFixed()}&` +
    `fromAddress=${wallet.address}&` +
    `slippage=${slippage}&` +
    `referrerAddress=${referrerAddress}&` +
    `fee=${referrerFee}&` +
    `disableEstimate=true`

  // main method
  async function mainDriver() {
    const data = await swap(callURL)
    const signPromise = await web3.eth.accounts.signTransaction(data['tx'], privateKey)
    console.log('signPromise', signPromise)
    const sentTx = await web3.eth.sendSignedTransaction(signPromise.raw || signPromise.rawTransaction)
    console.log('sentTx', sentTx)
    return await waitTransaction(sentTx.transactionHash)
  }

  // get the swap data
  async function swap(url) {
    console.log(url)
    let temp = await axios.get(url)
    temp = temp.data

    let value = parseInt(temp.tx['value'])
    value = '0x' + value.toString(16)
    temp.tx['value'] = value

    // let temp_gas
    // try {
    //   temp_gas = await web3.eth.estimateGas(temp)
    // } catch(e) {console.log(e)}
    
    temp.tx['gas'] = 1000000

    console.log(temp)
    return temp
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