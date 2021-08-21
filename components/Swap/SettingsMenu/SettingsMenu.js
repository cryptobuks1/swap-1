import SlippageSelection from './SlippageSelection'
import MoreSettings from './MoreSettings'
import styles from './SettingsMenu.module.scss'

const SettingsMenu = ({slippage, setSlippage}) => {
  return (
    <div className={styles.settingsMenu}>
      <SlippageSelection styles={styles} slippage={slippage} setSlippage={setSlippage} />

      <MoreSettings />
    </div>
  )
}

export default SettingsMenu
