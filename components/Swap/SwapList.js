import { useState } from 'react'

const SwapList = ({tokens, setSwapMenu, setCoin}) => {
  const [coinsSearched, setCoinsSearched] = useState(tokens);
  const [search, setSearch] = useState('');
  const [startSearching, setStartSearching] = useState(false)

  return (
    <div className='swap-list'>
      <div className='top-menu'>
        <div className='close' onClick={() => setSwapMenu(false)}>
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

      {startSearching && <div className='list'>
         {coinsSearched.map((address, index) => 
            <div className='token' onClick={() => {setCoin(tokens[address]); setSwapMenu(false)}} key={index}>
              <img src={tokens[address].logoURI} alt='' />
              <div>
                <p className='symbol'>{tokens[address].symbol}</p>
                <p className='name'>{tokens[address].name}</p>
              </div>
            </div>
          )}
        </div>
      }
    </div>
  )
}

export default SwapList
