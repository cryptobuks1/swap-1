async function convertToNativeWei() {
  if(from_token_address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
    return web3.utils.toWei(parseFloat(amount).toFixed(15).toString(), 'ether')
  }
      
  let url = `https://api.1inch.exchange/v3.0/${networkId}/quote?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&` +
    `toTokenAddress=${from_token_address}&` +
    `amount=1000000000000000000&` +
    `slippage=${slippage}`;


  let res = await axios.get(url)
  let amount_to_return = amount / web3.utils.fromWei(res.data.toTokenAmount.toString())
  console.log(amount_to_return)
    
  return web3.utils.toWei(amount_to_return.toFixed(15).toString(), 'ether')
}