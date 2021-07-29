import Web3 from 'web3'

export default async function handler(req, res) {
  const web3 = new Web3()
  const { walletPassword, wallet } = req.body

  const decrypted_wallet = web3.eth.accounts.wallet.decrypt(wallet, walletPassword)
  console.log(decrypted_wallet[0].privateKey)

  res.status(200).json(decrypted_wallet[0].privateKey)
}