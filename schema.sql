
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
  id SERIAL,
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
  helpfulness INTEGER DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TYPE features AS ENUM ('Fit', 'Length', 'Comfort', 'Quality', 'Size', 'Width');

CREATE TABLE characteristics (
  id SERIAL,
  product_id INTEGER DEFAULT NULL,
  name features,
  PRIMARY KEY (id)
);

CREATE TABLE characteristics_reviews (
  id SERIAL,
  characteristic_id INTEGER DEFAULT NULL,
  review_id INTEGER DEFAULT NULL,
  value INTEGER DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE reviews_photos (
  id SERIAL,
  review_id INTEGER DEFAULT NULL,
  url VARCHAR DEFAULT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys
-- ---

-- ALTER TABLE reviews ALTER COLUMN date SET DATA TYPE timestamp with time zone USING to_timestamp(date/1000);
ALTER TABLE characteristics_reviews ADD FOREIGN KEY (review_id) REFERENCES reviews (id);
ALTER TABLE characteristics_reviews ADD FOREIGN KEY (characteristic_id) REFERENCES characteristics (id);
ALTER TABLE reviews_photos ADD FOREIGN KEY (review_id) REFERENCES reviews (id);