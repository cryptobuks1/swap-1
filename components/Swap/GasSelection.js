import axios from 'axios'
import { useState, useEffect } from 'react'
import styles from '../../styles/GasSelection.module.scss'

const GasSelection = ({gasPrice, setGasPrice, networkId}) => {
  const [gas, setGas] = useState(null)

  const getGas = async() => {
    let res

    if(networkId === 56) {
      res = await axios.get('https://bscgas.info/gas')
      setGasPrice(res.data.standard)
      setGas({
        instant: res.data.instant,
        fast: res.data.fast,
        standard: res.data.standard
      })
    } else {
      res = await axios.get('https://ethgasstation.info/api/ethgasAPI.json')
      setGasPrice(res.data.average / 10)
      setGas({
        instant: res.data.fastest / 10,
        fast: res.data.fast / 10,
        standard: res.data.average / 10
      })
    }
  }

  useEffect(() => {
    getGas()
  }, [])

  return (
    <div className={styles.gasSelection}>
      <p className={styles.infoHeader}><i className='fad fa-charging-station'></i> Gas Price</p>
      {gas !== null &&
        <>
          <div className={gasPrice === gas.instant ? `${styles.option} ${styles.active}` : styles.option} onClick={() => setGasPrice(gas.instant)}>
            <p><span>{gas.instant}</span> Instant</p>
          </div>

          <div className={gasPrice === gas.fast ? `${styles.option} ${styles.active}` : styles.option} onClick={() => setGasPrice(gas.fast)}>
            <p><span>{gas.fast}</span> Fast</p>
          </div>

          <div className={gasPrice === gas.standard ? `${styles.option} ${styles.active}` : styles.option} onClick={() => setGasPrice(gas.standard)}>
            <p><span>{gas.standard}</span> Standard</p>
          </div>

          <div className={styles.option}>
            <input type='number' placeholder='Custom' value={gasPrice} onChange={e => setGasPrice(e.target.value)} />
          </div>
        </>
      }
    </div>
  )
}

export default GasSelection
