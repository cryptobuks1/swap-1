import Default from './Default'

const Wallet = ({networkId}) => {
  const wallet_address = window.ethereum.selectedAddress

  return (
    <div className='wallet'>
      <Default
        networkId={networkId}
        wallet_address={wallet_address}
      />

      <div className='go-to-wallet'>
        <a href='/wallet'>
          <i className='fad fa-wallet'></i>
          View Wallet
        </a>
      </div>
    </div>
  )
}

export default Wallet
