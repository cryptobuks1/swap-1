import { useState } from 'react'
import styles from './MoreSettings.module.scss'

const MoreSettings = () => {
  const [nonce, setNonce] = useState()
  const [gas, setGas] = useState()

  return (
    <div className={styles.moreSettings}>
      <p className={styles.infoHeader}><i className='far fa-sliders-v'></i> More Settings</p>

      <div className={styles.section}>
        <p className={styles.type}><i className='fad fa-fingerprint'></i>Nonce:</p>
        <input type='number' placeholder='0' value={nonce} onChange={e => setNonce(e.target.value)} />
      </div>

      <div className={styles.section}>
        <p className={styles.type}><i className='fad fa-gas-pump'></i> Gas Price:</p>
        <input type='number' placeholder='0' value={gas} onChange={e => setGas(e.target.value)} />
      </div>

      <p className={styles.subInfoHeader}>Currently Nonce & Gas don't work.</p>
      {/* If left blank, default values will be used for transactions.  */}
    </div>
  )
}

export default MoreSettings
