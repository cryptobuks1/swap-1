import Identicon from 'identicon.js';
import { useEffect, useState } from 'react'

const IdenticonIcon = ({image}) => {
  const [icon, setIcon] = useState(null)

  useEffect(() => {
    setIcon(new Identicon(image))
  }, [])

  return (
    <div className='identicon-icon'>
      {icon && <img src={`data:image/png;base64,${icon}`} />}
    </div>
  )
}

export default IdenticonIcon
