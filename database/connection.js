const pg = require('pg');
const config = require('./config.js')
const pgClient = new pg.Client(config)
const db = pgClient.connect();


db
  .then(db => console.log(`Connected to: PSQL`))
  .catch(err => {
    console.log(`There was a problem connecting to PSQL`);
    console.log(err);
  });

module.exports = db;