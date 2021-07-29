import axios from 'axios'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'

export default async function handler(req, res) {
  const web3 = new Web3()
  const networkId = req.body.networkId
  const from_token_address = req.body.from_token_address
  const to_token_address = req.body.to_token_address
  const amount = req.body.amount
  const number_of_tokens_in_wei = new BigNumber(parseInt(await web3.utils.toWei(parseFloat(amount).toFixed(15).toString(), 'ether')))

  const url = `https://api.1inch.exchange/v3.0/${networkId}/quote?` +
    `fromTokenAddress=${from_token_address}&` +
    `toTokenAddress=${to_token_address}&` +
    `amount=${number_of_tokens_in_wei.toFixed()}`

  const response = await axios.get(url)

  response.data['toTokenAmountFromWei'] = await web3.utils.fromWei(response.data.toTokenAmount)

  res.status(200).json(response.data)
}