import React from 'react'

const ConnectMenu = ({styles, setConnectMenu, importMode, setImportMode, walletName, setWalletName, passwordVisibility, setPasswordVisibility, importWallet, privateKey, setPrivateKey, walletPassword, setWalletPassword}) => {
  return (
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
  )
}

export default ConnectMenu
