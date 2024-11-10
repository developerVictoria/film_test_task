const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'postgres', 
  host: '172.17.0.3', //change to the container IP recived in the srcipt
  port: 5432,
  database: 'dvdrental'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
