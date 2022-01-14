/*
run `psql postgres` in terminal to start postgres
run `\i schema.sql` in postgres to run queries
run `\COPY reviews FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/reviews.csv' DELIMITER ',' CSV HEADER` to load reviews.csv to reviews table
run `\COPY characteristics FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/characteristics.csv' DELIMITER ',' CSV HEADER`
run `\COPY characteristics_reviews FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER`
run `\COPY reviews_photos FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/reviews_photos.csv' DELIMITER ',' CSV HEADER`
*/

psql postgres;

\i schema.sql

\COPY reviews FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/reviews.csv' DELIMITER ',' CSV HEADER;
\COPY characteristics FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/characteristics.csv' DELIMITER ',' CSV HEADER;
\COPY characteristics_reviews FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
\COPY reviews_photos FROM '/Users/catherine91033/Desktop/HRSF139.nosync/SDC_Reviews_API/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;