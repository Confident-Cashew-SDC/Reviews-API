const express = require('express');
const app = express();
const PORT = 3000
const client = require('../database/connection.js')
const path = require('path')

// app.get('/reviews', (req, res) => {
//   client.query('SELECT * FROM reviews LIMIT 10', (err, res) => {
//     if (err) {
//       throw err;
//     }
//     console.log(res.rows)
//     client.end()
//   })
// })

const query = async (text, params) => {
  const start = Date.now()
  const res = await client.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}

app.get('/reviews', async (req, res) => {
  const text = 'SELECT * FROM reviews LIMIT 10'
  const result = await query(text)
  console.log('query.rows:', result.rows)
})


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})