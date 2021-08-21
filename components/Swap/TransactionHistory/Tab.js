import { useState } from 'react'

const Tab = ({tab, styles}) => {
  const [expandable, setExpandable] = useState(false)

  return (
    <div className={styles.tab}>
      <div className={styles.top} 
        style={expandable ? {backgroundColor: '#268ffc', borderColor: '#268ffc'} : {backgroundColor: '#212429', borderColor: '#212429', borderRadius: 'inherit'}} 
        onClick={() => setExpandable(!expandable)}>
        <p className={styles.title}><i class={tab.title === 'Swap' ? 'fad fa-map-marked-alt' : 'fad fa-shield-check'}></i> {tab.title}</p>
      
        <div className={styles.path}>
          <img src={tab.from.logoURI} alt={tab.from.logoURI} />
          <i className='far fa-chevron-right'></i>
          <img src={tab.to.logoURI} alt={tab.to.logoURI} />
        </div>
      </div>

      {expandable && 
        <div className={styles.expandable}>
          <div className={styles.path}>
            <i className={`far fa-level-up-alt ${styles.pathIcon}`}></i>
            <img src={tab.from.logoURI} alt={tab.from.logoURI} />
            <p>{tab.from.symbol}</p>
            <i className='far fa-chevron-right'></i>
            <img src={tab.to.logoURI} alt={tab.to.logoURI} />
            <p>{tab.to.symbol}</p>
          </div>

          <div className={styles.hash}>
            <a href={`https://etherscan.io/search?q=${tab.hash}`}>View on EtherScan</a>
          </div>
        </div>
      }
    </div>
  )
}

export default Tab
