import { useEffect, useState } from 'react'
import axios from 'axios'

const MainHeader = ({wallet_address, networkId}) => {
  const [defaultBalance, setDefaultBalance] = useState(null)

  const getDefaultBalance = async() => {
    let res = await axios.post('/api/get-balance', {
      symbol: networkId === 1 ? 'BNB' : 'ETH',
      walletAddress: wallet_address,
      networkId: networkId
    })

    setDefaultBalance(res.data)
  }

  useEffect(() => {
    getDefaultBalance()
  }, [])

  return (
    <div className='wallet-header'>
      <div className='balance-tab'>
        <img src={`https://tokens.1inch.exchange/${networkId === 1 ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' : '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'}.png`} alt='' />
        {defaultBalance !== null && <p className='balance'>{defaultBalance.toFixed(4)} {networkId === 1 ? 'ETH' : 'BNB'}</p>}
      </div>

      <div className='options'>
        <div className='button'>
          <i className='fad fa-arrow-to-top'></i>
          <p>Send</p>
        </div>

        <div className='button'>
          <i className='fad fa-arrow-from-top'></i>
          <p>Recieve</p>
        </div>
      </div>
    </div>
  )
}

export default MainHeader