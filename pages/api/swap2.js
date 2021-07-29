import Web3 from 'web3'

export default async function handler(req, res) {
  const provider_url = 'http://127.0.0.1:8545'
  const web3 = new Web3(provider_url)

  let parameter = "0x92c2a0fd9f5070523c51cb67b796c6f47b93721dc0746ca014f2ce008154f9f9"

  web3.eth.getTransactionReceipt(parameter, function(err, transaction) {
    console.info(transaction, err);    
  }).then(console.log);

  res.status(200).json('0')
}

// {
//   messageHash: '0xa7cdd33cc4ad806981e84cc47e3c875072f075db1811ea8126fc10ece573ccc8',
//   v: '0x0a95',
//   r: '0x66b38fd2fae475427307a866369bbfb2877dcbd11d6ae0eb111c3955c170d42d',
//   s: '0x5f3b80d90148eac3f4b37dfc6e3a03aac84e3d3ab1fdb1442ac7409cec233013',
//   rawTransaction: '0xf8ae820b1285073d1bc08083061a8094eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee80b844095ea7b300000000000000000000000011111112542d85b3ef69ae05771c2dccff4faa260000000000000000000000000000000000000000000000000094ae5fcdaeb878820a95a066b38fd2fae475427307a866369bbfb2877dcbd11d6ae0eb111c3955c170d42da05f3b80d90148eac3f4b37dfc6e3a03aac84e3d3ab1fdb1442ac7409cec233013',
//   transactionHash: '0x7489dca28bd959eca693a9ba746a4f46a732c18f9200ebb737903e7fb45229e6'
// }