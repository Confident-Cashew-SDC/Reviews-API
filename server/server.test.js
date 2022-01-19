const request = require('supertest')
const app = require('./index.js')

describe("GET /reviews", () => {
  test('expects GET /reviews response product ID to be same as input ID', (done) => {
    request(app)
      .get('/reviews')
      .query({ product_id: 63609 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.product).toBe(63609)
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      })
  })
})

describe("GET /reviews/meta", () => {
  test('expects GET /reviews/meta to have two values (true and false) for recommended', (done) => {
    request(app)
      .get('/reviews/meta')
      .query({ product_id: 63609 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(Object.keys(res.body.recommended).length).toEqual(2)
        expect(res.body.recommended.hasOwnProperty('true')).toBe(true)
        expect(res.body.recommended.hasOwnProperty('false')).toBe(true)
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      })
  })
})

describe("POST /reviews", () => {
  beforeEach(() => {
    jest.setTimeout(10000);
  })
  test('expects POST /reviews to save in database', async (done) => {
    const newReview = {
      product_id: 63610,
      rating: 1,
      summary: "SUGOI",
      body: "SUGOI",
      recommend: true,
      name: "MrSugoi",
      email: "SUGOI@gmail.com",
      photos: [
        {
            url: "https://images.unsplash.com/photo-1560829675-11dec1d78930?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80"
        }
      ],
      characteristics: {
          Fit: {
              value: 4
          },
          Length: {
              value: 3
          }
      }
    }
    request(app)
      .post('/reviews')
      .send(newReview)
      .get('/reviews')
      .query({product_id: 63610})
      .expect((res) => {
        console.log(res)
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      })
  })
})

describe("PUT /reviews/helpful", () => {
  test('expects PUT /reviews/helpful to have a 204 success status', (done) => {
    request(app)
      .put('/reviews/helpful')
      .query({ review_id: 5774934 })
      .expect((res) => {
        expect(res.status).toBe(204)
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      })
  })
})

describe("PUT /reviews/report", () => {
  test('expects PUT /reviews/report to have a 204 success status', (done) => {
    request(app)
      .put('/reviews/report')
      .query({ review_id: 5774934 })
      .expect((res) => {
        expect(res.status).toBe(204)
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      })
  })
})