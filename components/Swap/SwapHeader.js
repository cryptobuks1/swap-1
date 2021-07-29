import { useEffect, useState } from 'react'
import Wallet from '../Wallet/Wallet'
import IdenticonIcon from '../IdenticonIcon'
import styles from '../../styles/swapHeader.module.scss'
import axios from 'axios'

const SwapHeader = () => {
  const [walletMenu, setWalletMenu] = useState(false)
  const [cogMenu, setCogMenu] = useState(false)
  const [network, setNetwork] = useState(null)
  
  // New
  const [connectMenu, setConnectMenu] = useState(false)
  const [passwordMenu, setPasswordMenu] = useState(false)
  const [sessionPrivateKey, setSessionPrivateKey] = useState('') // saved private key from private key
  const [importMode, setImportMode] = useState(true) // true == Custom, false == WConnect
  const [privateKey, setPrivateKey] = useState('')
  const [walletName, setWalletName] = useState('')
  const [walletPassword, setWalletPassword] = useState('')
  const [passwordVisibility, setPasswordVisibility] = useState(false) // true = text, false = dots
  const [address, setAddress] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [profileSettings, setProfileSettings] = useState(false)

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
    let wallet = JSON.parse(localStorage.getItem('wallet'))

    if(Object.keys(wallet).length !== 0)
      setAddress(`0x${wallet.wallet[0].address}`)
  }

  const loadLoggedInSessionFromStorage = () => {
    let logged_in = JSON.parse(sessionStorage.getItem('loggedIn'))
    console.log(logged_in)
    setLoggedIn(logged_in)
  }

  const getNetwork = async() => {
    let net = JSON.parse(localStorage.getItem('swapNetwork'))
    setNetwork(net)
  }
  
  useEffect(() => {
    loadWalletOnLocalStorage()
    loadLoggedInSessionFromStorage()
    getNetwork()
  }, [])

  return (
    <div className={styles.header}>
      {(connectMenu || passwordMenu )&& <div className={styles.filter}></div>}

      <div className={styles.menu}>
        <img src='https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' alt='' />
        <p>Ethereum</p>
            
        {/* <div className={network == 56 && styles.selected} onClick={() => setSwapNetwork(56)}>
          <img src='https://tokens.1inch.exchange/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png' alt='' />
          <p>Smart Chain</p>
        </div> */}

        {/* <div className={network == 137 ? 'selected' : ''} onClick={() => setSwapNetwork(137)}>
          <img src='https://tokens.1inch.exchange/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png' alt='' />
          <p>Polygon</p>
        </div> */}
      </div>

      {address == null ?
        <div className={styles.menu} style={{padding: '8px 15px'}} onClick={() => setConnectMenu(true)}>
          Connect Wallet 
          <i className='far fa-ellipsis-v'></i>
        </div>
      :
        <div className={styles.connectedProfile}>
          {loggedIn ?
            <div className={styles.profile} onClick={() => setProfileSettings(!profileSettings)}>
              <IdenticonIcon image={address} />
              <p>{address.slice(0, 6)}...{address.slice(38, 42)}</p>
            </div>
          :
            <div className={styles.profile} onClick={() => setPasswordMenu(true)}>
              <p className={styles.logBtn}>Log In</p>
            </div>
          }

          <div className={styles.cog} onClick={() => setCogMenu(!cogMenu)}>
            <i className='fal fa-user-cog'></i>
          </div>

          {profileSettings && 
            <div className={styles.profileSettings}>
              <p onClick={removeWallet}>Remove Wallet <i className='fad fa-trash-alt'></i></p>
            </div>
          }

          {cogMenu &&
            <div className={styles.profileSettings}>
              <p onClick={logOutWallet}>Log out <i className='far fa-sign-out-alt'></i></p>
            </div>
          }
       </div>
      }

      {passwordMenu &&
        <div className={styles.connectMenu}> {/* same styles as connectMenu */}
          <div className={styles.top}>
            <p className={styles.header}>Type Password</p>
            <i className='far fa-times' onClick={() => setPasswordMenu(false)}></i>
          </div>

          <div className={styles.bottom}>
            <div className={styles.importMenu}>
                <p className={styles.header}>Password</p>
                <div className={styles.btnInput}>
                  <input type={passwordVisibility ? 'text' : 'password'} style={{letterSpacing: passwordVisibility ? '0' : '3px'}} value={walletPassword} onChange={e => setWalletPassword(e.target.value)}  />
                  <i className={passwordVisibility ? 'far fa-eye' : 'far fa-eye-slash'} onClick={() => setPasswordVisibility(!passwordVisibility)}></i>
                </div>

                <button onClick={unlockWallet}>Unlock Wallet</button>
              </div>
            </div>
        </div>
      }

      {connectMenu &&
        <div className={styles.connectMenu}>
          <div className={styles.top}>
            <p className={styles.header}>Connect Wallet</p>
            <i className='far fa-times' onClick={() => setConnectMenu(false)}></i>
          </div>

          <div className={styles.bottom}>
            <div className={styles.selectionMenu}>
              <div className={importMode && styles.selected} onClick={() => setImportMode(true)}>
                <p>Custom</p>
              </div>

              <div className={!importMode && styles.selected} onClick={() => setImportMode(false)}>
                <p>Wallet Connect</p>
              </div>
            </div>

            {importMode ? // Custom
              <div className={styles.importMenu}>
                <p className={styles.header}>Wallet Name</p>
                <input type='text' value={walletName} onChange={e => setWalletName(e.target.value)} />

                <p className={styles.header}>Password</p>
                <div className={styles.btnInput}>
                  <input type={passwordVisibility ? 'text' : 'password'} style={{letterSpacing: passwordVisibility ? '0' : '3px'}} value={walletPassword} onChange={e => setWalletPassword(e.target.value)}  />
                  <i className={passwordVisibility ? 'far fa-eye' : 'far fa-eye-slash'} onClick={() => setPasswordVisibility(!passwordVisibility)}></i>
                </div>
                <p className={styles.notice}>Please remember your password.</p>

                <p className={styles.header}>Private Key / Mnemonic Phrase</p>
                <textarea placeholder='0x... || Mnemonic Phrase' value={privateKey} onChange={e => setPrivateKey(e.target.value)} />

                <button onClick={importWallet}>Import</button>
              </div>
              : // Wallet Connect
              <div className={styles.importMenu}>
                <p className={styles.header}>Coming Soon</p>
              </div>
            }
          </div>
        </div>
      }
    </div>
  )
}

export default SwapHeader
