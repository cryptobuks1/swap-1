const SwapSymbol = ({styles, swapSymbolButton}) => {
  return (
    <div className={styles.swapSymbol} onClick={swapSymbolButton}>
      <div className={styles.symbol}>
        <i className='far fa-exchange-alt'></i>
      </div>
    </div>
  )
}

export default SwapSymbol
