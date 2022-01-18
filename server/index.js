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
  const product_id = req.query.product_id
  const params = [product_id]
  const text =
  `SELECT json_build_object(
    'product', ${product_id},
    'results', json_agg(
      json_build_object(
        'review_id', r.review_id,
        'rating', r.rating,
        'summary', r.summary,
        'recommend', r.recommend,
        'response', r.response,
        'body', r.body,
        'date', r.date,
        'reviewer_name', r.reviewer_name,
        'helpfulness', r.helpfulness
      )
    )
  )
  FROM reviews r
  WHERE r.product_id=$1`
  let review = {};
  query(text, params)
    .then((res) => {
      review = res.rows[0].json_build_object
      let params = '';
      review.results.forEach((review) => {
        params += `${review.review_id}, `
      })
      let text =
      `SELECT * FROM reviews_photos
      WHERE reviews_photos.review_id
      IN (${params.slice(0, params.length-2)});`
      return query(text)
    })
    .then((data) => {
      for (let i = 0; i < review.results.length; i++) {
        for (let j = 0; j < data.rows.length; j++) {
          if (review.results[i].review_id === data.rows[j].review_id) {
            if (!review.results[i].photos) {
              review.results[i].photos = []
              review.results[i].photos.push({
                id: data.rows[j].photos_id,
                url: data.rows[j].url
              })
            } else {
              review.results[i].photos.push({
                id: data.rows[j].photos_id,
                url: data.rows[j].url
              })
            }
          }
        }
      }
      res.status(200).send(review)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

app.get('/reviews/meta', async (req, res) => {
  const product_id = req.query.product_id
  const params = [product_id]
  const text =
  `SELECT row_to_json(rev)
      FROM (
      SELECT reviews.product_id, reviews.rating, reviews.recommend, reviews.review_id
      FROM reviews
      WHERE reviews.product_id = $1
  ) rev`
  let meta = {};
  let ratings = {};
  let recommended = {};
  let characteristics = {};
  query(text, params)
    .then((data) => {
      let params = '';
      data.rows.forEach((element) => {
        params += `${element.row_to_json.review_id}, `
        if (!ratings[element.row_to_json.rating]) {
          ratings[element.row_to_json.rating] = 1
        } else {
          ratings[element.row_to_json.rating]++
        }
        if (!recommended[element.row_to_json.recommend]) {
          recommended[element.row_to_json.recommend] = 1
        } else {
          recommended[element.row_to_json.recommend]++
        }
      })
      let text =
      `	SELECT characteristics.characteristic_id, characteristics.name, AVG(characteristics_reviews.value)
      FROM characteristics_reviews
      LEFT JOIN characteristics
      ON characteristics_reviews.characteristic_id=characteristics.characteristic_id
      WHERE characteristics_reviews.review_id IN (${params.slice(0, params.length-2)})
      GROUP BY characteristics.characteristic_id;`
      return query(text)
    })
    .then((data) => {
      data.rows.forEach((element) => {
        if (!characteristics[element.name]) {
          characteristics[element.name] = {
            id: element.characteristic_id,
            value: element.avg
          }
        }
      })
      meta = {
        product_id: product_id,
        ratings: ratings,
        recommended: recommended,
        characteristics, characteristics
      }
      res.status(200).send(meta)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

app.post('/reviews', async (req, res) => {
})


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})