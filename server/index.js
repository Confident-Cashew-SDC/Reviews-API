const express = require('express');
const app = express();
const PORT = 3000
const client = require('../database/connection.js')
const path = require('path')

const query = async (text, params) => {
  const start = Date.now()
  const res = await client.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}

app.get('/reviews', async (req, res) => {
  const text = 'SELECT * FROM reviews3 WHERE product_id=2';
  const result = await query(text);
  console.log('query.rows:', result.rows);
  const final = {};
  final.product = result.rows[0].product_id;
  final.results = [];
  result.rows.forEach((review) => {
    const resultsObj = {};
    resultsObj.review_id = review.id;
    resultsObj.rating = review.rating;
    resultsObj.summary = review.summary;
    resultsObj.recommend = review.recommend;
    resultsObj.response = review.response;
    resultsObj.body = review.body;
    resultsObj.date = review.date;
    resultsObj.reviewer_name = review.reviewer_name;
    resultsObj.helpfulness = review.helpfulness;
    resultsObj.photos = [].concat({id: review.reviews_photo_id, url: review.url})
    final.results.push(resultsObj)
  })
  res.status(200).send(final);
})


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})