import { useState, useEffect } from 'react'
import styles from './TransactionHistory.module.scss'
import Tab from './Tab'

const TransactionHistory = () => {
  const [history, setHistory] = useState()

  const getHistory = () => {
    !localStorage.getItem('transactionHistory') && localStorage.setItem('transactionHistory', '[]')
    setHistory(JSON.parse(localStorage.getItem('transactionHistory')))
  }

  const clearHistory = () => {
    localStorage.setItem('transactionHistory', '[]')
    setHistory(null)
  }

  useEffect(() => {
    getHistory()
  }, [])

  return (
    <div className={styles.transactionHistory}>
      <div className={styles.header}>
        <p className={styles.infoHeader}><i className='fad fa-book'></i> Transaction History</p>
        <p className={styles.clear} onClick={clearHistory}><i className='far fa-trash-alt'></i> Clear History</p>
      </div>

      <div className={styles.historyScroll} key={history}>
        {history && 
          history.map(tab => (
            <Tab 
            tab={tab}
            styles={styles} />
        ))}
      </div>
    </div>
  )
}

export default TransactionHistory
