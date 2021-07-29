import axios from 'axios';
import Web3 from 'web3'

export default async function handler(req, res) {
  let signPromise
  const networkId = 56
  const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
  const from = req.body.fromToken;
  const to = req.body.toToken;
  const decimals = req.body.decimals;
  const referrerAddress = '0x70099fd7Cb1ec19f5D4e7E85850b60485ec717aC'
  const fee = 1
  const privateKey = req.body.privateKey
  const wallet = web3.eth.accounts.privateKeyToAccount(privateKey)
  const fromAddress = wallet.address

  const slippage = req.body.slippage
  let amount =  req.body.amountToSell
  amount = parseInt(await convertToNativeWei())
  
  const response = await fetch(
  `https://api.1inch.exchange/v3.0/56/swap?fromTokenAddress=${from}&toTokenAddress=${to}&amount=${amount}&fromAddress=${fromAddress}&slippage=${slippage}&referrerAddress=${referrerAddress}&fee=${fee}`
  );
  const quote = await response.json();
  console.log('quote', quote)

  console.log('sign object', {
    fromToken: from,
    toToken: to,
    decimals: decimals,
    fromAddress: fromAddress,
    privateKey: privateKey,
    slippage: slippage,
    amountToSell: amount
  })

  signPromise = web3.eth.accounts.signTransaction(quote.tx, privateKey);
  
  signPromise.then((signedTx) => {
    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
    sentTx.on("receipt", receipt => {
      console.log(receipt)
    });
    sentTx.on("error", err => {
      console.log(err)
    });
  }).catch((err) => {
    console.log(err)
  });

  async function convertToNativeWei() {
    if(from === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      return web3.utils.toWei(parseFloat(amount).toFixed(15).toString(), 'ether')
    }
      
    let url = `https://api.1inch.exchange/v3.0/${networkId}/quote?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&` +
    `toTokenAddress=${from}&` +
    `amount=1000000000000000000&` +
    `slippage=${slippage}`;

    let res = await axios.get(url)
    let amount_to_return = amount / web3.utils.fromWei(res.data.toTokenAmount.toString())
    
    return web3.utils.toWei(amount_to_return.toFixed(15).toString(), 'ether')
  }

  res.status(200).json({quote: quote, gasPrice: web3.utils.fromWei(quote.tx.gas.toString(), 'gwei')})
}