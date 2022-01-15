
/*
run `psql postgres` in terminal to start postgres
run `\i schema.sql` in postgres to run queries
run `\COPY reviews FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/reviews.csv' DELIMITER ',' CSV HEADER` to load reviews.csv to reviews table
run `\COPY characteristics FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/characteristics.csv' DELIMITER ',' CSV HEADER`
run `\COPY characteristics_reviews FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER`
run `\COPY reviews_photos FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/reviews_photos.csv' DELIMITER ',' CSV HEADER`
*/

CREATE TABLE new_reviews AS
SELECT reviews.*, characteristics_reviews.characteristic_id, characteristics_reviews.value  from reviews
INNER JOIN characteristics_reviews ON (characteristics_reviews.review_id = reviews.id)
ORDER BY reviews.id ASC;

CREATE TABLE reviews3 AS
SELECT reviews.*, characteristics_reviews.characteristic_id, characteristics_reviews.value, reviews_photos.url, reviews_photos.id AS reviews_photo_id from reviews
INNER JOIN characteristics_reviews ON (characteristics_reviews.review_id = reviews.id)
FULL OUTER JOIN reviews_photos ON (reviews_photos.review_id = reviews.id)
ORDER BY reviews.id ASC;

CREATE INDEX ON reviews3(product_id);

CREATE TABLE meta AS
SELECT characteristics_reviews.*, characteristics.name, characteristics.id AS characteristics_id, reviews.recommend, reviews.product_id from characteristics_reviews
INNER JOIN characteristics ON (characteristics_reviews.characteristic_id = characteristics.id)
LEFT JOIN reviews ON (characteristics_reviews.review_id = reviews.id)
ORDER BY reviews.id ASC;
