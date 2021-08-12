const PasswordMenu = ({styles, setPasswordMenu, passwordVisibility, setPasswordVisibility, walletPassword, setWalletPassword, unlockWallet}) => {
  return (
    <div className={styles.connectMenu}>
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
  )
}

export default PasswordMenu
