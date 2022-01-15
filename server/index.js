const express = require('express');
const app = express();
const PORT = 3000
const client = require('../database/connection.js')
const path = require('path')

const query = async (text, params) => {
  const start = Date.now()
  console.log("here")
  const res = await client.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}

app.get('/reviews', async (req, res) => {
  const text = 'SELECT * FROM reviews2 WHERE product_id=2 LIMIT 10';
  const result = await query(text);
  console.log('query.rows:', result.rows);
  res.status(200).send(result.rows);
})


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})