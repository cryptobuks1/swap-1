import { useState } from 'react'
import styles from '../../styles/MoreSettings.module.scss'

const MoreSettings = () => {
  const [nonce, setNonce] = useState(0)

  return (
    <div className={styles.moreSettings}>
      <p className={styles.infoHeader}><i className='fad fa-sliders-v-square'></i> More Settings</p>

      <div className={styles.section}>
        <p className={styles.type}><i className='fad fa-fingerprint'></i>Nonce:</p>
        <input value={nonce} onChange={e => setNonce(e.target.value)} />
      </div>

      <div className={styles.section}>
        <p className={styles.type}><i className='fad fa-gas-pump'></i> Gas Price:</p>
        <input value={nonce} onChange={e => setNonce(e.target.value)} />
      </div>

      <p className={styles.subInfoHeader}>If left blank, default values will be used for transactions.</p>
    </div>
  )
}

export default MoreSettings
