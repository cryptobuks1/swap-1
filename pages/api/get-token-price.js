import Web3 from 'web3'

export default async function handler(req, res) {
  const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
  const token = req.body.tokenAddress;
  const busd = '0xe9e7cea3dedca5984780bafc599bd69add087d56';

  const minABI = [
    // decimals
    {
      "constant":true,
      "inputs":[],
      "name":"decimals",
      "outputs":[{"name":"","type":"uint8"}],
      "type":"function"
    }
  ];
  const contract = new web3.eth.Contract(minABI, token);
  async function getBalance() {
    let decimals = await contract.methods.decimals().call()
    return decimals;
  }
  const token_decimals = await getBalance()

  const response = await fetch(
  `https://api.1inch.exchange/v3.0/56/quote?fromTokenAddress=${token}&toTokenAddress=${busd}&amount=${10 ** token_decimals}`
  );
  const quote = await response.json();
  quote['toTokenAmountFromWei'] = web3.utils.fromWei(quote.toTokenAmount)
  console.log(quote)
  res.status(200).json(quote)
}