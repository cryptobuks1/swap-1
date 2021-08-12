const BlockchainMenu = ({styles, setBlockchainMenu, setSwapNetwork}) => {
  return (
    <div className={styles.connectMenu}> {/* same styles as connectMenu */}
      <div className={styles.top}>
        <p className={styles.header}>Select Blockchain</p>
        <i className='far fa-times' onClick={() => setBlockchainMenu(false)}></i>
      </div>

      <div className={styles.bottom}>
        <div className={styles.blockchain} onClick={() => {setSwapNetwork(1), setBlockchainMenu(false)}}>
          <img src='https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' alt='' />
          <p>Ethereum</p>
        </div>
        
        <div className={styles.blockchain} onClick={() => {setSwapNetwork(56), setBlockchainMenu(false)}}>
          <img src='https://tokens.1inch.exchange/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png' alt='' />
          <p>Smart Chain</p>
        </div>

        {/* {network !== 137 && <div className={styles.blockchain} onClick={() => setSwapNetwork(137)}>
          <img src='https://tokens.1inch.exchange/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png' alt='' />
          <p>Polygon</p>
        </div>} */}
      </div>
    </div>
  )
}

export default BlockchainMenu
