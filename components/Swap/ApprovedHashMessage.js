const ApprovedHashMessage = ({approvedHash, setApprovedHash, styles}) => {
  return (
    <div className={styles.approvedHashMessage}>
      <i className={`fad fa-lightbulb-exclamation ${styles.bulb}`}></i>
      <p>Transaction <a href={`https://etherscan.io/search?q=${approvedHash}`}>{approvedHash}</a> was mined.</p>
      <i className={`far fa-times ${styles.close}`} onClick={() => setApprovedHash(null)}></i>
    </div>
  )
}

export default ApprovedHashMessage
