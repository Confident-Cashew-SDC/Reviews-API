require('newrelic')
const express = require('express');
const app = express();
const PORT = 3000
const client = require('../database/connection.js')
const path = require('path')
const TOKEN = require('../config.js')

const query = (text, params) => {
  const start = Date.now()
  const res = client.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
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
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const params = [product_id]
  const text =
  `SELECT json_build_object(
    'product', ${product_id},
    'page', ${page},
    'count', ${count},
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
        'photos', (SELECT coalesce(json_agg(
                    json_build_object(
                      'id', photos_id,
                      'url', url
                  )), '[]'::json) AS Photos FROM reviews_photos WHERE r.review_id = review_id
        )
      ) ORDER BY ${sort}
    )
  )
  FROM reviews r
  WHERE r.product_id IN ($1)
  LIMIT ${count}`
  client.query(text, params, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data.rows[0].json_build_object)
    }
  })
})

app.get('/reviews/meta', async (req, res) => {
  const product_id = req.query.product_id
  const params = [product_id]
  const text =
  `SELECT json_build_object(
    'product_id', product_id,
    'ratings',
      (SELECT json_object_agg(
        rating,
        num_reviews
      )
      FROM
        (SELECT
          rating,
          count(*) AS num_reviews
        FROM reviews
        WHERE product_id =$1
        GROUP BY rating
      ) r),
    'recommended',
      (SELECT json_object_agg(
        recommend,
        num_reviews)
      FROM (
        SELECT
          recommend,
          count(*) AS num_reviews
        FROM reviews
        WHERE product_id = $1
        GROUP BY recommend
      ) re),
    'characteristics',
      (SELECT json_object_agg(
        name, json_build_object(
            'id', characteristic_id,
            'value', value
      ))
      FROM (
        SELECT c.name,
              c.characteristic_id,
              sum(value)/count(*) AS value
        FROM characteristics c
        LEFT JOIN characteristics_reviews cr
        ON c.characteristic_id = cr.characteristic_id
        WHERE c.product_id = $1
        GROUP BY  c.name, c.characteristic_id
        ) r
    )
  )
  FROM reviews
  WHERE product_id = $1`
  client.query(text, params, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data.rows[0].json_build_object)
    }
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