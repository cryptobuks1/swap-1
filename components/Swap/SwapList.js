import { useState } from 'react'

const SwapList = ({tokens, setSwapMenu, setCoin, styles}) => {
  const [coinsSearched, setCoinsSearched] = useState(tokens);
  const [search, setSearch] = useState('');
  const [startSearching, setStartSearching] = useState(false)

  return (
    <div className={styles.swapList}>
      <div className={styles.topMenu}>
        <div className={styles.close} onClick={() => setSwapMenu(false)}>
          <i className='far fa-times'></i>
        </div>
      
        <input
          onChange={e => {
            const test = Object.keys(tokens).filter(token => {
              return tokens[token].name.toLowerCase().includes(e.target.value.toLowerCase());
            });

            setCoinsSearched(test);
            setSearch(e.target.value);
            setStartSearching(true)
          }}
          type='text'
          value={search}
          placeholder='Token Search'
          spellCheck={false}
        />
      </div>

      {startSearching && <div className={styles.list}>
         {coinsSearched.map((address, index) => 
            <div className={styles.token} onClick={() => {setCoin(tokens[address]); setSwapMenu(false)}} key={index}>
              <img src={tokens[address].logoURI} alt='' />
              <div>
                <p className={styles.symbol}>{tokens[address].symbol}</p>
                <p className={styles.name}>{tokens[address].name}</p>
              </div>
            </div>
          )}
        </div>
      }
    </div>
  )
}

export default SwapList
