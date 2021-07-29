import Web3 from 'web3'
const ethers = require('ethers')

export default async function handler(req, res) {
  const web3 = new Web3()
  let wallet
  const { privateKey, walletPassword } = req.body

  // Wallet Import
  if(privateKey.startsWith('0x'))
    wallet = new ethers.Wallet(privateKey)
  else 
    wallet = new ethers.Wallet.fromMnemonic(privateKey)

  let wallet_information = {
    privateKey: wallet._signingKey().privateKey,
    address: wallet.address
  }

  console.log('add method', web3.eth.accounts.wallet.add(wallet_information))
  const encrypted_wallet = web3.eth.accounts.wallet.encrypt(walletPassword)
  // console.log('decrypt method', web3.eth.accounts.wallet.decrypt(encrypted_wallet, 'password'))

  // console.log(wallet)
  // console.log(wallet_information)

  res.status(200).json(encrypted_wallet)
}