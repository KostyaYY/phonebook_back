const app = require('./app');
const pool = require('./db');

const { PORT = 3000 } = process.env;

pool
  .query('select 1')
  .then(() => {
    app.listen(PORT, () => {
      console.log('Database connection successful');
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  });
