import axios from 'axios'
import { ethers } from 'ethers';
import Web3 from 'web3'

export default async function handler(req, res) {
  const networkId = 1
  // let provider_url = 'https://bsc-dataseed1.binance.org:443'
  let provider_url = 'http://127.0.0.1:8545'
  const provider = new ethers.providers.JsonRpcProvider(provider_url)
  const web3 = new Web3(provider_url);
  const INFURA_KEY = process.env.INFURA_KEY
  console.log(req.body)

  const from_token_address = req.body.fromToken
  const to_token_address = req.body.toToken
  // const decimals = req.body.decimals
  const privateKey = req.body.privateKey
  const slippage = req.body.slippage
  const amount =  req.body.amountToSell
  const number_of_tokens_in_wei = parseInt(await convertToBNBWei())

  const wallet = new ethers.Wallet(privateKey, provider)

  let callURL = `https://api.1inch.exchange/v3.0/${networkId}/swap?fromTokenAddress=${from_token_address}&` +
    `toTokenAddress=${to_token_address}&` +
    `amount=${number_of_tokens_in_wei}&fromAddress=` +
    wallet.address +
    `&slippage=${slippage}&disableEstimate=true`;
  
  async function driver() {
    let globalData
    if (!(callURL.substring(callURL.indexOf("fromTokenAddress=") + 17, callURL.indexOf("fromTokenAddress=") + 59) === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'))
    {
      globalData = await approveApiCaller(number_of_tokens_in_wei, to_token_address)
      console.log(globalData['tx'])

      try {
        await wallet.sendTransaction(globalData["tx"]).then(
          (data) => {
            console.log('approval', data);
          }
        );
        console.log("Approval success");
      } catch (e) {
        console.log("Approval failure");
      }
    }

    globalData = await apiCaller(callURL);
    console.log(globalData)
    
    try {
      await wallet.sendTransaction(globalData["tx"]).then(
        (data) => {
            console.log(data);
        }
      );
      console.log("Transaction success");
    } catch (e) {
      console.log("Transaction failure", e);
    }
    
  }

  async function approveApiCaller(number_of_tokens, tokenAddress) {
    console.log('approveApiCaller')
    let url = `https://api.1inch.exchange/v3.0/${networkId}/approve/calldata` +
        (number_of_tokens > -1 && number_of_tokens != null ? "?amount=" + number_of_tokens + "&" : "") //tack on the value if it's greater than -1
        + "tokenAddress=" + tokenAddress            //complete the called URL
    let temp = await axios.get(url);                //get the api call
    temp = temp.data;                               //we only want the data object from the api call
    console.log(temp)

    //we need to convert the gasPrice to hex
    delete temp.gasPrice;
    delete temp.gas;                             //ethersjs will find the gasLimit for users

    //we also need value in the form of hex
    let val = parseInt(temp["value"]);			//get the value from the transaction
    val = '0x' + val.toString(16);				    //add a leading 0x after converting from decimal to hexadecimal
    let tx = {}
    tx['value'] = val
    temp['tx'] = tx;						    //set the value of value in the transaction object

    return temp; 
  }

  async function apiCaller(url) {
    console.log('apiCaller')
    console.log(url)
    let temp = await axios.get(url);
    temp = temp.data;

    delete temp.tx.gasPrice;
    delete temp.tx.gas;

    let value = parseInt(temp.tx["value"]);
    value = '0x' + value.toString(16);
    temp.tx["value"] = value;
    temp.tx["gasLimit"] = 500000;
    console.log('temp', temp)

    //temp.tx["nonce"] = nonce;                     //ethersjs will find the nonce for the user
    //temp.tx.chainId = 56                         //this allows the transaction to NOT be replayed on other chains, ethersjs will find it for the user
    return temp;
  }

  async function convertToBNBWei() {
    if(from_token_address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      return web3.utils.toWei(parseFloat(amount).toFixed(15).toString(), 'ether')
    }
      
    let url = `https://api.1inch.exchange/v3.0/${networkId}/quote?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&` +
    `toTokenAddress=${from_token_address}&` +
    `amount=1000000000000000000&` +
    `slippage=${slippage}`;

    let res = await axios.get(url)
    let amount_to_return = amount / web3.utils.fromWei(res.data.toTokenAmount.toString())
    
    return web3.utils.toWei(amount_to_return.toFixed(15).toString(), 'ether')
  }

  driver()
  // convertToBNBWei()

  res.status(200).json('h')
}