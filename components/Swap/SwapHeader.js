import { useEffect, useState } from 'react'
import IdenticonIcon from '../IdenticonIcon'
import styles from '../../styles/swapHeader.module.scss'
import axios from 'axios'
import BlockchainMenuButton from '../Header/BlockchainMenuButton'
import BlockchainMenu from '../Header/BlockchainMenu'
import PasswordMenu from '../Header/PasswordMenu'
import ConnectMenu from '../Header/ConnectMenu'

const SwapHeader = () => {
  const [walletMenu, setWalletMenu] = useState(false)
  const [cogMenu, setCogMenu] = useState(false)
  const [network, setNetwork] = useState(1)
  const [connectMenu, setConnectMenu] = useState(false)
  const [passwordMenu, setPasswordMenu] = useState(false)
  const [blockchainMenu, setBlockchainMenu] = useState(false)
  const [sessionPrivateKey, setSessionPrivateKey] = useState('') // saved private key from private key
  const [importMode, setImportMode] = useState(true) // true == Custom, false == WConnect
  const [privateKey, setPrivateKey] = useState('')
  const [walletName, setWalletName] = useState('')
  const [walletPassword, setWalletPassword] = useState('')
  const [passwordVisibility, setPasswordVisibility] = useState(false) // true = text, false = dots
  const [address, setAddress] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [profileSettings, setProfileSettings] = useState(false)
  const [windowWidth, setWindowWidth] = useState()

  const importWallet = async() => {
    let res = await axios.post('/api/wallet/import-wallet', {
      privateKey, walletPassword })
    
    let wallet = res.data

    localStorage.setItem('wallet', JSON.stringify({
      walletName,
      wallet: wallet
    }))

    location.reload()
  }

  const unlockWallet = async() => {
    let wallet = JSON.parse(localStorage.getItem('wallet')).wallet
    let res = await axios.post('/api/wallet/unlock-wallet', {
      walletPassword, wallet
    })

    sessionStorage.setItem('privateKey', res.data)
    sessionStorage.setItem('loggedIn', JSON.stringify(true))
    location.reload()
  }

  const removeWallet = () => {
    localStorage.setItem('wallet', JSON.stringify({}))
    sessionStorage.setItem('privateKey', '')
    sessionStorage.setItem('loggedIn', JSON.stringify(false))
    location.reload()
  }

  const logOutWallet = () => {
    sessionStorage.setItem('privateKey', '')
    sessionStorage.setItem('loggedIn', JSON.stringify(false))
    location.reload()
  }

  const setSwapNetwork = (net) => {
    localStorage.setItem('swapNetwork', JSON.stringify(net))
    setNetwork(net)
    location.reload()
  }

  const loadWalletOnLocalStorage = () => {
    if(!localStorage.getItem('wallet'))
      localStorage.setItem('wallet', '{}')
      
    let wallet = JSON.parse(localStorage.getItem('wallet'))

    if(Object.keys(wallet).length !== 0)
      setAddress(`0x${wallet.wallet[0].address}`)
  }

  const loadLoggedInSessionFromStorage = () => {
    let logged_in = JSON.parse(sessionStorage.getItem('loggedIn'))
    setLoggedIn(logged_in)
  }

  const getNetwork = async() => {
    if(!localStorage.getItem('swapNetwork'))
      localStorage.setItem('swapNetwork', '1')
      
    setNetwork(JSON.parse(localStorage.getItem('swapNetwork')))
  }

  useEffect(() => {
    getNetwork()
    loadWalletOnLocalStorage()
    loadLoggedInSessionFromStorage()
    setWindowWidth(window.innerWidth)
  }, [])

  return (
    <div className={styles.header}>
      {(connectMenu || passwordMenu || blockchainMenu )&& <div className={styles.filter}></div>}

      <div className={styles.gasStation}>
        <a href='https://station.wastebridge.org'>
          <i className='far fa-gas-pump'></i>
        </a>
      </div>

      <BlockchainMenuButton styles={styles} setBlockchainMenu={setBlockchainMenu} network={network} />

      {address == null ?
        <div className={styles.menu} style={{padding: '8px 15px'}} onClick={() => setConnectMenu(true)}>
          Connect {windowWidth > 450 && 'Wallet'} 
          <i className='far fa-ellipsis-v'></i>
        </div>
      :
        <div className={styles.connectedProfile}>
          {loggedIn ?
            <div className={styles.profile} onClick={() => {setProfileSettings(!profileSettings); setCogMenu(false)}}>
              <IdenticonIcon image={address} />
              <p className={styles.addressText}>{address.slice(0, 6)}...{address.slice(38, 42)}</p>
            </div>
          :
            <div className={`${styles.profile} ${styles.logProfile}`} onClick={() => setPasswordMenu(true)}>
              <p className={styles.logBtn}>Log In</p>
            </div>
          }

          <div className={styles.cog} onClick={() => {setCogMenu(!cogMenu); setProfileSettings(false)}}>
            <i className='fal fa-user-cog'></i>
          </div>

          {cogMenu && 
            <div className={`${styles.profileSettings} ${styles.cogMenu}`}>
              <p>Settings <i className='fal fa-sliders-v-square'></i></p>
              <p onClick={removeWallet}>Remove Wallet <i className='fad fa-trash-alt'></i></p>
            </div>
          }

          {profileSettings &&
            <div className={`${styles.profileSettings} ${styles.profileSettingsMenu}`}>
              <p className={styles.addressText}>{address.slice(0, 6)}...{address.slice(37, 42)} <i className='fal fa-wallet'></i></p>
              <p onClick={logOutWallet}>Log out <i className='far fa-sign-out-alt'></i></p>
            </div>
          }
       </div>
      }

      {blockchainMenu && 
        <BlockchainMenu 
          styles={styles} 
          setBlockchainMenu={setBlockchainMenu} 
          setSwapNetwork={setSwapNetwork} />}

      {passwordMenu &&
        <PasswordMenu 
          styles={styles}
          setPasswordMenu={setPasswordMenu} 
          passwordVisibility={passwordVisibility} 
          setPasswordVisibility={setPasswordVisibility} 
          walletPassword={walletPassword} 
          setWalletPassword={setWalletPassword} 
          unlockWallet={unlockWallet} />}

      {connectMenu &&
        <ConnectMenu 
          styles={styles}
          setConnectMenu={setConnectMenu} 
          importMode={importMode}
          setImportMode={setImportMode} 
          walletName={walletName} 
          setWalletName={setWalletName} 
          passwordVisibility={passwordVisibility} 
          setPasswordVisibility={setPasswordVisibility} 
          importWallet={importWallet} 
          privateKey={privateKey} 
          setPrivateKey={setPrivateKey} 
          walletPassword={walletPassword} 
          setWalletPassword={setWalletPassword} />}
    </div>
  )
}

export default SwapHeader
