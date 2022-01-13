DROP DATABASE reviews;

CREATE DATABASE reviews;

USE reviews;

CREATE TABLE reviews (
  id_reviews INT AUTO_INCREMENT,
  id_product INT NOT NULL,
  rating INT,
  summary VARCHAR(250),
  recommend VARCHAR(10),
  response VARCHAR(50),
  body VARCHAR(250),
  date DATETIME,
  reviewer_name VARCHAR(20),
  helpfulness INT,
  PRIMARY KEY (id_reviews)
);

CREATE TABLE characteristics (
  id_characteristics INT AUTO_INCREMENT,
  type VARCHAR(10),
  value INT,
  id_product INT NOT NULL,
  PRIMARY KEY (id_characteristics)
);

CREATE TABLE reviewsMeta (
  id_reviewsMeta INT AUTO_INCREMENT,
  id_product INT NOT NULL,
  recommend_true INT,
  recommend_false INT,
  id_characteristics INT NOT NULL,
  1_star INT,
  2_star INT,
  3_star INT,
  4_star INT,
  5_star INT,
  PRIMARY KEY (id_reviewsMeta),
  FOREIGN KEY (id_characteristics) REFERENCES characteristics(id_characteristics)
);
