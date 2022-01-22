require('newrelic')
const express = require('express');
const app = express();
const PORT = 3000
const client = require('../database/connection.js')
const path = require('path')
const TOKEN = require('../config.js')

const query = async (text, params) => {
  const start = Date.now()
  const res = await client.query(text, params)
  const duration = Date.now() - start
  // console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}

app.use(express.json())

app.get(`/${TOKEN}`, (req, res) => {
  res.status(200).send(`${TOKEN}`)
});

app.get('/reviews', async (req, res) => {
  const product_id = req.query.product_id
  const sort = req.query.sort === 'relevant' ? 'helpfulness DESC, DATE DESC' :
               req.query.sort === 'helpful' ? 'helpfulness DESC' : 'date DESC';
  const page = req.query.page ? `'page', ${req.query.page},` : '' ;
  const count = req.query.count ? `'count', ${req.query.count},` : '' ;
  const limitCount = req.query.count ? `LIMIT ${req.query.count}` : '' ;
  const params = [product_id]
  const text =
  `SELECT json_build_object(
    'product', ${product_id},
    ${page}
    ${count}
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
        'helpfulness', r.helpfulness,
        'photos', photos
      ) ORDER BY ${sort}
    )
  ) review
  FROM reviews r
  LEFT JOIN (
  	SELECT
	  p.review_id,
	  array_agg(
	  	json_build_object(
			'id', p.photos_id,
			'url', p.url
		)
	  ) photos FROM reviews_photos p
	  GROUP BY p.review_id
  ) p ON p.review_id=r.review_id
  WHERE r.product_id=($1)`
  const results = await query(text, params)
  res.status(200).send(results.rows[0].review)
})

app.get('/reviews/meta', async (req, res) => {
  const product_id = req.query.product_id
  const params = [product_id]
  const text =
  `SELECT row_to_json(rev)
      FROM (
      SELECT reviews.product_id, reviews.rating, reviews.recommend, reviews.review_id
      FROM reviews
      WHERE reviews.product_id IN ($1)
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
  const params = [req.body.product_id, req.body.rating, req.body.summary, req.body.body, req.body.recommend, req.body.name, req.body.email]
  const text =
  `INSERT INTO reviews
      (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
    VALUES
      ($1, $2, CURRENT_DATE, $3, $4, $5, $6, $7)
    RETURNING review_id AS review_id;`
  query(text, params)
    .then((data) => {
      if (req.body.photos.length > 0) {
        req.body.photos.forEach((photo) => {
          const params = [data.rows[0].review_id, photo.url]
          const text =
          `INSERT INTO reviews_photos
              (review_id, url)
            VALUES
              ($1, $2)`
          query(text, params)
        })
      }
      if (Object.keys(req.body.characteristics).length > 0) {
        for (let key in req.body.characteristics) {
          const params = [data.rows[0].review_id, key, req.body.characteristics[key].value]
          const text =
          `INSERT INTO characteristics_reviews
            (characteristic_id, review_id, value)
          VALUES
            ((SELECT characteristic_id FROM characteristics
              WHERE (product_id=${req.body.product_id} AND name=$2)), $1, $3)`
          query(text, params)
        }
      }
    })
    .then((data) => {
      res.status(201).send(data)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})


app.put('/reviews/helpful', async (req, res) => {
  const params = [req.body.review_id]
  const text =
  `UPDATE reviews
  SET helpfulness=helpfulness + 1
  WHERE review_id=$1`
  query(text, params)
    .then((data) => {
      res.status(204).send(data)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

app.put('/reviews/report', async (req, res) => {
  const params = [req.body.review_id]
  const text =
  `UPDATE reviews
  SET reported=true
  WHERE review_id=$1`
  query(text, params)
    .then((data) => {
      res.status(204).send(data)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})

module.exports = app;