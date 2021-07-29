import { useRouter } from 'next/router'
import styles from '../styles/header.module.scss'

const Header = () => {
  const router = useRouter()

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <p className={styles.logo}>WasteBridge</p>
        <p className={styles.app}>Swap</p>
      </div>

      <div className={styles.right}>
        <ul>
          <li>Wallet</li>
          <li className={router.pathname == '/' ? styles.selected : ''}>Swap</li>
          <li>Blog</li>
          <li>About</li>
        </ul>
      </div>
    </div>
  )
}

export default Header
