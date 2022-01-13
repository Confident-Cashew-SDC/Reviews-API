let productSchema = mongoose.Schema({
  _id: { type: Number, unique: true },
  product_id: Number,
  ratings: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  recommended: {
    false: Number,
    true: Number
  },
  reviews: [Number]
});

let reviewsSchema = mongoose.Schema({
  _id: {type: Number, unique: true},
  response: String,
  body: String,
  summary: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number
})

let characteristicSchema = mongoose.Schema({
  _id: { type: Number, unique: true },
  product_id: Number,
  type: String,
  value: Number
});