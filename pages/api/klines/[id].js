import axios from 'axios'

export default async (req, res) => {
  const { id, t } = req.query

  let response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${id}&interval=${t}`)
  let data = response.data

  let finalArray = []
  for(let i in data) {
    finalArray.push({time: data[i][0] / 1000, open: data[i][1], high: data[i][2], low: data[i][3], close: data[i][4]})
  }

  res.status(200).json(finalArray)
}