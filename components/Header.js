import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../styles/header.module.scss'
import SwapHeader from './Swap/SwapHeader'

const Header = () => {
  const [windowWidth, setWindowWidth] = useState()
  const router = useRouter()

  useEffect(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <p className={styles.logo}>WasteBridge</p>
        <p className={styles.app}>{windowWidth > 450 ? 'Swap' : 'You DeFi Swap'}</p>
      </div>

      <div className={styles.right}>
        {/* <ul>
          <li>Wallet</li>
          <li className={router.pathname == '/' ? styles.selected : ''}>Swap</li>
          <li>Blog</li>
          <li>About</li>
        </ul> */}

        <SwapHeader />
      </div>
    </div>
  )
}

export default Header
