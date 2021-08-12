const BlockchainMenuButton = ({styles, setBlockchainMenu, network}) => {
  return (
    <div className={styles.menu} onClick={() => setBlockchainMenu(true)}>
      {network === 1 && <>
        <img src='https://tokens.1inch.exchange/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' alt='' />
        <p>Ethereum</p>
      </>}

      {network === 56 && <>
        <img src='https://tokens.1inch.exchange/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png' alt='' />
        <p>Smart Chain</p>
      </>}
    </div>
  )
}

export default BlockchainMenuButton
