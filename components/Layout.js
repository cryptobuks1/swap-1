import Head from 'next/head'
import { useEffect } from 'react'
import Header from './Header'

const Layout = ({children}) => {
  const loadWalletOnLocalStorage = () => {
    if(!localStorage.getItem('wallet'))
      localStorage.setItem('wallet', JSON.stringify({}))
  }

  const loadLoggedInSessionFromStorage = () => {
    if(sessionStorage.getItem('loggedIn') == null) {
      sessionStorage.setItem('loggedIn', JSON.stringify(false))
      sessionStorage.setItem('privateKey', '')
    }
  }

  const getNetwork = async() => {
    if(!localStorage.getItem('swapNetwork'))
      localStorage.setItem('swapNetwork', JSON.stringify(1))
  }

  useEffect(() => {
    getNetwork()
    loadWalletOnLocalStorage()
    loadLoggedInSessionFromStorage()
  }, [])

  return (
    <div>
      <Head>
        <link href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" rel="stylesheet" />
        <link rel='icon' type='image/png' href='/logo.jpeg' />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        <title>Swap</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>

      <Header />
      <main>
        {children}  
      </main>   

      <div className='radial-background'></div>
    </div>
  )
}

export default Layout