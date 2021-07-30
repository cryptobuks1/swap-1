import axios from 'axios'
import { useEffect, useState } from 'react'
import SwapList from '../components/Swap/SwapList'
import Coin from '../components/Swap/Coin'
import SwapHeader from '../components/Swap/SwapHeader'
import styles from '../styles/swap.module.scss'

const swap = () => {
  // Legacy
  const [tokens, setTokens] = useState(null)
  const [swapMenu1, setSwapMenu1] = useState(false)
  const [swapMenu2, setSwapMenu2] = useState(false)
  const [coin1, setCoin1] = useState(null)
  const [coin2, setCoin2] = useState(null)
  const [coin1Input, setCoin1Input] = useState('')
  const [coin2Input, setCoin2Input] = useState('')
  const [network, setNetwork] = useState(null)
  const [menu, setMenu] = useState(false)
  const [slippage, setSlippage] = useState(1)
  const [privateKey, setPrivateKey] = useState('')
  let temp_coin

  // New
  const [address, setAddress] = useState(null)
  const [approved, setApproved] = useState(false)
  const [approvedHash, setApprovedHash] = useState(null)

  const getAddresses = () => {
    if(!localStorage.getItem('wallet'))
      localStorage.setItem('wallet', '{}')
    let wallet = JSON.parse(localStorage.getItem('wallet'))
    setPrivateKey(sessionStorage.getItem('privateKey'))
    setAddress(Object.keys(wallet).length !== 0 ? wallet.wallet[0].address : null)
  }

  const getNetwork = async() => {
    if(!localStorage.getItem('swapNetwork'))
      localStorage.setItem('swapNetwork', '1')
    
    let net = JSON.parse(localStorage.getItem('swapNetwork'))
    setNetwork(net)

    let res = await axios.get(`https://api.1inch.exchange/v3.0/${net}/tokens`)
    let tokens_temp = await res.data.tokens
    setTokens(tokens_temp)
    
    setCoin1(tokens_temp['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'])
    if(net == 1) 
      setCoin2(tokens_temp['0x6b175474e89094c44da98b954eedeac495271d0f']) 
    else if(net == 56)
      setCoin2(tokens_temp['0x55d398326f99059ff775485246999027b3197955']) 
    else
      setCoin2(tokens_temp['0xc2132d05d31c914a87c6611c10748aeb04b58e8f'])
  }


  const swapSymbolButton = () => {
    temp_coin = coin1
    setCoin1(coin2)
    setCoin2(temp_coin)
  }

  const swapTokens = async() => {
    let res = await axios.post('/api/swap/swap', {
      fromToken: coin1.address,
      toToken: coin2.address,
      decimals: coin1.decimals,
      privateKey: privateKey,
      slippage: slippage,
      amountToSell: coin1Input,
      networkId: network
    })

    console.log(res.data)
    setApprovedHash(res.data.hash)
  }

  const approveTokens = async() => {
    let res = await axios.post('/api/swap/approve', {
      fromToken: coin1.address,
      toToken: coin2.address,
      decimals: coin1.decimals,
      privateKey: privateKey,
      slippage: slippage,
      amountToSell: coin1Input,
      networkId: network
    })

    console.log(res.data)
    setApproved(res.data.approved)
    setApprovedHash(res.data.hash)
  }

  const calculateInputs = async() => {
    setCoin2Input('loading')

    const res = await axios.post('/api/swap/get-price', {
      networkId: network,
      from_token_address: coin1.address,
      to_token_address: coin2.address,
      amount: coin1Input
    })

    setCoin2Input(parseFloat(res.data.toTokenAmountFromWei).toFixed(10))
  }

  useEffect(() => {
    getAddresses()
    getNetwork()
  }, [])

  return (
    <div className={styles.swapWrapper}>
      {tokens != null && 
      <>
      {swapMenu1 && <SwapList tokens={tokens} setSwapMenu={setSwapMenu1} setCoin={setCoin1} styles={styles} />}
      {swapMenu2 && <SwapList tokens={tokens} setSwapMenu={setSwapMenu2} setCoin={setCoin2} styles={styles} />}
      <div className={styles.filters} style={{filter: (swapMenu1 || swapMenu2) ? 'blur(2px) brightness(0.9)' : 'blur(0) brightness(1)'}}>
        <SwapHeader />
        <div className={styles.swap}>
          <div className={styles.menu}>
            <div className={styles.top}>
              <div className={styles.cog} onClick={() => setMenu(!menu)}>
                <i className='fal fa-cog'></i>
              </div>
            </div>

            {menu && 
              <div className={styles.slippage}>
                <p className={styles.infoHeader}>Slippage tolerance</p>
                <div className={styles.top}>
                  <div className={slippage == 0.1 ? `${styles.active} ${styles.slipBtn}` : styles.slipBtn} onClick={() => setSlippage(0.1)}>0.1%</div>
                  <div className={slippage == 0.5 ? `${styles.active} ${styles.slipBtn}` : styles.slipBtn} onClick={() => setSlippage(0.5)}>0.5%</div>
                  <div className={slippage == 1 ? `${styles.active} ${styles.slipBtn}` : styles.slipBtn} onClick={() => setSlippage(1)}>1%</div>
                  <input value={slippage} onChange={e => setSlippage(e.target.value)} />
                  <span>%</span>
                </div>

                {slippage == 0.1 && <p className={styles.error}>Your transaction may fail</p>}
                {slippage == 0 && <p className={styles.error}>Enter a valid slippage percentage</p>}
                {(slippage >= 6 && slippage <= 50) && <p className={styles.error}>Your transaction may be frontrun</p>}
                {slippage > 50 && <p className={styles.error}>Enter a valid slippage percentage</p>}
              </div>}
          </div>

          {(coin1 && network) && <Coin 
            wallet={address} 
            coin={coin1}
            networkId={network}
            coin1Input={coin1Input} 
            setCoin1Input={setCoin1Input} 
            coin2Input={coin2Input} 
            setCoin2Input={setCoin2Input} 
            setSwapMenu={setSwapMenu1} 
            calculateInputs={calculateInputs}
            styles={styles}
            key={[coin1.address, approvedHash]} />}

          <div className={styles.swapSymbol} onClick={swapSymbolButton}>
            <div className={styles.symbol}>
              <i className='far fa-arrow-down'></i>
            </div>
          </div>
  
          {(coin2 && network) && <Coin 
            wallet={address} 
            coin={coin2} 
            networkId={network}
            coin1Input={false}
            setCoin1Input={false}
            coin2Input={coin2Input} 
            setCoin2Input={setCoin2Input} 
            setSwapMenu={setSwapMenu2}
            calculateInputs={calculateInputs}
            styles={styles}
            key={[coin2.address, approvedHash]} />}

          <div className={styles.slippageTolerance}>
            <p>Slippage Tolerance</p>
            <p>{slippage}%</p>
          </div>

          <div className={coin1 && coin1.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ? `${styles.transactionButtons} ${styles.transactionButtonsGrid}` : styles.transactionButtons}>
            {coin1 && coin1.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' && <div className={styles.button} onClick={approveTokens}>
              <i className='fad fa-wand-magic'></i>
              <p>Approve</p>
            </div>}
            <div className={
              (coin1 && coin1.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') ? 
              (approved ? styles.button : `${styles.button} ${styles.disabled}`) : styles.button} 
              onClick={swapTokens}>
              <i className='fad fa-route'></i>
              <p>Swap</p>
            </div>
          </div>

          {approvedHash !== null && <div className={styles.approvedHashMessage}>
            <div className={styles.top}>
              <p><i className='fad fa-lightbulb-exclamation'></i> Approve Message</p>
              <i className='far fa-times' onClick={() => setApprovedHash(null)}></i>
            </div>
            <p>Transaction <a href={`https://etherscan.io/search?q=${approvedHash}`}>{approvedHash}</a> was mined.</p>
          </div>}
        </div>
      </div>
      </>}
    </div>
  )
}

export default swap