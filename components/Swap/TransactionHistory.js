import { useState, useEffect } from 'react'
import styles from '../../styles/swap/TransactionHistory.module.scss'

const TransactionHistory = () => {
  const [history, setHistory] = useState()

  const getHistory = () => {
    !localStorage.getItem('transactionHistory') && localStorage.setItem('transactionHistory', '[]')
    setHistory(JSON.parse(localStorage.getItem('transactionHistory')))
  }

  useEffect(() => {
    getHistory()
  }, [])

  return (
    <div className={styles.transactionHistory}>
      {history &&
        <>
        
        </>
      }
    </div>
  )
}

export default TransactionHistory
