
/*
run `psql postgres` in terminal to start postgres
run `\i schema.sql` in postgres to run queries
run `\COPY reviews FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/reviews.csv' DELIMITER ',' CSV HEADER` to load reviews.csv to reviews table
run `\COPY characteristics FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/characteristics.csv' DELIMITER ',' CSV HEADER`
run `\COPY characteristics_reviews FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER`
run `\COPY reviews_photos FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/reviews_photos.csv' DELIMITER ',' CSV HEADER`
*/


DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

\c reviews;

CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  product_id INTEGER DEFAULT NULL,
  rating INTEGER DEFAULT NULL,
  date BIGINT DEFAULT NULL,
  summary VARCHAR DEFAULT NULL,
  body VARCHAR DEFAULT NULL,
  recommend VARCHAR DEFAULT NULL,
  reported VARCHAR DEFAULT NULL,
  reviewer_name VARCHAR DEFAULT NULL,
  reviewer_email VARCHAR DEFAULT NULL,
  response VARCHAR DEFAULT NULL,
  helpfulness INTEGER DEFAULT NULL
);

CREATE TYPE features AS ENUM ('Fit', 'Length', 'Comfort', 'Quality', 'Size', 'Width');

CREATE TABLE characteristics (
  characteristic_id SERIAL PRIMARY KEY,
  product_id INTEGER DEFAULT NULL,
  name features
);

CREATE TABLE characteristics_reviews (
  char_rev_id SERIAL PRIMARY KEY,
  characteristic_id INTEGER DEFAULT NULL,
  review_id INTEGER DEFAULT NULL,
  value INTEGER DEFAULT NULL
);

CREATE TABLE reviews_photos (
  photos_id SERIAL PRIMARY KEY,
  review_id INTEGER DEFAULT NULL,
  url VARCHAR DEFAULT NULL
);

-- ---
-- Foreign Keys
-- ---

-- ALTER TABLE reviews ALTER COLUMN date SET DATA TYPE timestamp with time zone USING to_timestamp(date/1000);
ALTER TABLE characteristics_reviews ADD FOREIGN KEY (review_id) REFERENCES reviews (review_id);
ALTER TABLE characteristics_reviews ADD FOREIGN KEY (characteristic_id) REFERENCES characteristics (characteristic_id);
ALTER TABLE reviews_photos ADD FOREIGN KEY (review_id) REFERENCES reviews (review_id);

SELECT setval(pg_get_serial_sequence('reviews', 'review_id'), coalesce(max(review_id), 0)+1 , false) FROM reviews;
SELECT setval(pg_get_serial_sequence('reviews_photos', 'photos_id'), coalesce(max(photos_id), 0)+1 , false) FROM reviews_photos;
SELECT setval(pg_get_serial_sequence('characteristics', 'characteristic_id'), coalesce(max(characteristic_id), 0)+1 , false) FROM characteristics;
SELECT setval(pg_get_serial_sequence('characteristics_reviews', 'char_rev_id'), coalesce(max(char_rev_id), 0)+1 , false) FROM characteristics_reviews;

CREATE INDEX ON reviews(product_id);
CREATE INDEX ON reviews_photos(review_id);
CREATE INDEX ON characteristics_reviews(characteristic_id);
CREATE INDEX ON characteristics_reviews(review_id);
CREATE INDEX ON characteristics(product_id);
-- CREATE INDEX ON reviews(date);
-- CREATE INDEX ON reviews(helpfulness);