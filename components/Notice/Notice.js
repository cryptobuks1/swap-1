
import styles from './Notice.module.scss'
import { useEffect, useState } from 'react'

const Notice = () => {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    var end = new Date('08/30/2021 06:00 PM');

    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;

    function showRemaining() {
        var now = new Date();
        var distance = end - now;
        if (distance < 0) {
            clearInterval(timer);

            return;
        }
        var days = Math.floor(distance / _day);
        var hours = Math.floor((distance % _day) / _hour);
        var minutes = Math.floor((distance % _hour) / _minute);
        var seconds = Math.floor((distance % _minute) / _second);

        setDays(days)
        setHours(hours)
        setMinutes(minutes)
        setSeconds(seconds)
    }

    timer = setInterval(showRemaining, 1000);
  }, [])

  return (
    <div className={styles.notice}>
      <div className={styles.waves}></div>
      
      <p className={styles.top}>❗DxSale Pre Sale❗</p>
      <p className={styles.timer}>LIVE NOW</p>
      <div className={styles.btns}>
        <div className={styles.button} onClick={() => window.open('https://dxsale.app/app/v2_9/defipresale?saleID=2661&chain=BSC')}><i className='fad fa-tags'></i> Participate</div>
        <div className={styles.button} onClick={() => window.open('/howto.pdf')}><i className='fas fa-info'></i> How to Buy</div>
      </div>
    </div>
  )
}

export default Notice
