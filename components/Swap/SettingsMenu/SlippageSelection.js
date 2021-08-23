import React from 'react'

const SlippageSelection = ({styles, slippage, setSlippage}) => {
  return (
    <div className={styles.slippage}>
      <p className={styles.infoHeader}><i className='far fa-wave-square'></i> Slippage tolerance</p>
      <div className={styles.top}>
        <div className={slippage == 0.1 ? `${styles.active} ${styles.slipBtn}` : styles.slipBtn} onClick={() => setSlippage(0.1)}>0.1%</div>
        <div className={slippage == 0.5 ? `${styles.active} ${styles.slipBtn}` : styles.slipBtn} onClick={() => setSlippage(0.5)}>0.5%</div>
        <div className={slippage == 1 ? `${styles.active} ${styles.slipBtn}` : styles.slipBtn} onClick={() => setSlippage(1)}>1%</div>
        <input type='number' value={slippage} onChange={e => setSlippage(e.target.value)} />
        <span>%</span>
      </div>

      {slippage == 0.1 && <p className={styles.error}>Your transaction may fail</p>}
      {slippage == 0 && <p className={styles.error}>Enter a valid slippage percentage</p>}
      {(slippage >= 6 && slippage <= 50) && <p className={styles.error}>Your transaction may be frontrun</p>}
      {slippage > 50 && <p className={styles.error}>Enter a valid slippage percentage</p>}
    </div>
  )
}

export default SlippageSelection
