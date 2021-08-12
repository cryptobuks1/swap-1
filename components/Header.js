import styles from '../styles/header.module.scss'
import SwapHeader from './Swap/SwapHeader'

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <p className={styles.logo}>WasteBridge</p>
        <p className={styles.app}>Swap</p>
      </div>

      <div className={styles.right}>
        <SwapHeader />
      </div>
    </div>
  )
}

export default Header
