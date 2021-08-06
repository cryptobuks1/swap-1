import axios from 'axios'
import { useEffect, useState } from 'react'

const Coin = ({wallet, coin, networkId, coin1Input, setCoin1Input, coin2Input, setCoin2Input, setSwapMenu, calculateInputs, styles}) => {
  const [balance, setBalance] = useState(0)

  const getCoinBalance = async() => {
    let res = await axios.post('/api/get-balance', {
      tokenAddress: coin.address,
      walletAddress: `0x${wallet}`,
      networkId: networkId,
      symbol: coin.symbol
    })
    
    setBalance(res.data)
  }

  useEffect(() => {
    if(wallet !== null)
      getCoinBalance()
  }, [])

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.coin} onClick={() => setSwapMenu(true)}>
          <img src={coin.logoURI} alt='' />
          <p>{coin.symbol}</p>
          <i className='far fa-chevron-down'></i>
        </div>
        
        {coin1Input !== false ?
          <input 
            placeholder={0.0} 
            value={coin1Input} 
            onChange={e => setCoin1Input(e.target.value)} />
        :
          coin2Input === 'loading' ? <i className={`fa fa-spinner-third ${styles.inputSpinner}`}></i> :
          <input 
            placeholder={0.0} 
            value={coin2Input} 
            onChange={e => setCoin2Input(e.target.value)} />
        }
      </div>

      <div className={styles.bottom}>
        <p>Balance: {balance.toFixed(4)} {coin.symbol}</p>
        {/* <p>~ 0.0</p> */}
        {coin1Input === false &&
          <div className={styles.calculate} onClick={calculateInputs}>
            <i className='fad fa-calculator-alt'></i>
          </div>
        }
      </div>
    </div>
  )
}

export default Coin
