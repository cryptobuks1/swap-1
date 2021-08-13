import axios from 'axios'
import { useEffect, useState } from 'react'
import SwapList from '../components/Swap/SwapList'
import Coin from '../components/Swap/Coin'
import OrderHistory from '../components/Swap/OrderHistory'
import styles from '../styles/swap.module.scss'
import ApprovedHashMessage from '../components/Swap/ApprovedHashMessage'
import GasSelection from '../components/Swap/GasSelection'
import SwapSymbol from '../components/Swap/SwapSymbol'
import SlippageSelection from '../components/Swap/SlippageSelection'
import TransactionHistory from '../components/Swap/TransactionHistory'

const swap = () => {
  const [tokens, setTokens] = useState(null)
  const [swapMenu1, setSwapMenu1] = useState(false)
  const [swapMenu2, setSwapMenu2] = useState(false)
  const [coin1, setCoin1] = useState(null)
  const [coin2, setCoin2] = useState(null)
  const [coin1Input, setCoin1Input] = useState('')
  const [coin2Input, setCoin2Input] = useState('')
  const [network, setNetwork] = useState(null)
  const [menu, setMenu] = useState(false)
  const [transactionHistory, setTransactionHistory] = useState(true)
  const [slippage, setSlippage] = useState(1)
  const [privateKey, setPrivateKey] = useState('')
  const [address, setAddress] = useState(null)
  const [approved, setApproved] = useState(false)
  const [approvedHash, setApprovedHash] = useState(null)
  const [gasPrice, setGasPrice] = useState(0)
  let temp_coin

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
      networkId: network,
      gasPrice: gasPrice
    })

    console.log(res.data)
    setApprovedHash(res.data.hash)
    saveToHistory('Swap', res.data.hash)
  }

  const approveTokens = async() => {
    let res = await axios.post('/api/swap/approve', {
      fromToken: coin1.address,
      toToken: coin2.address,
      decimals: coin1.decimals,
      privateKey: privateKey,
      slippage: slippage,
      amountToSell: coin1Input,
      networkId: network,
      gasPrice: gasPrice
    })

    console.log(res.data)
    setApproved(res.data.approved)
    setApprovedHash(res.data.hash)
    saveToHistory('Approval', res.data.hash)
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

  const saveToHistory = (title, hash) => {
    !localStorage.getItem('transactionHistory') && localStorage.setItem('transactionHistory', '[]')
    let local_history = JSON.parse(localStorage.getItem('transactionHistory'))
    local_history.push({
      title: title,
      hash: hash,
      from: coin1,
      to: coin2,
      from_amount: coin1Input,
      to_amount: coin2Input
    })
    localStorage.setItem('transactionHistory', JSON.stringify(local_history))
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
        <div className={styles.swap}>
          
          <div className={styles.menu}>
            <div className={styles.top}>
              <div className={styles.cog} onClick={() => setTransactionHistory(!transactionHistory)}>
                <i className='far fa-history'></i>
              </div>

              <div className={styles.cog} onClick={() => setMenu(!menu)}>
                <i className='fal fa-cog'></i>
              </div>
            </div>

            {menu && 
              <div className={styles.slippage}>
                <SlippageSelection styles={styles} slippage={slippage} setSlippage={setSlippage} />

            {/* <GasSelection 
                  gasPrice={gasPrice}
                  setGasPrice={setGasPrice}
                  networkId={network}
                  styles={styles} /> */}
              </div>}

            {transactionHistory && <TransactionHistory />}
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

          <SwapSymbol styles={styles} swapSymbolButton={swapSymbolButton} />
  
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
              ((approved && coin1Input !== '') ? styles.button : `${styles.button} ${styles.disabled}`) : 
              coin1Input === '' ? `${styles.button} ${styles.disabled}` : styles.button}  
              /* Honestly I don't even remember */
              onClick={coin1Input !== '' ? swapTokens : console.log('can not swap - empty input')}>
              <i className='fad fa-route'></i>
              <p>{coin1Input === '' ? 'Enter Amount' : 'Swap'}</p>
            </div>
          </div>
        </div>

        {approvedHash !== null && <ApprovedHashMessage approvedHash={approvedHash} setApprovedHash={setApprovedHash} styles={styles} />}
        
        <OrderHistory />
      </div>
      </>}
      <p className={styles.noticeMSG}>Please do not use this app - yet - as it's still unstable.</p>
    </div>
  )
}

export default swap