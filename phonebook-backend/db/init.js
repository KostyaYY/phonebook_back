const fs = require('fs');
const path = require('path');

const pool = require('./index');

const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

pool
  .query(sql)
  .then(() => {
    console.log('Database schema is ready');
  })
  .catch(error => {
    console.log(error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
