// import and require express and mysql2
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'M0niqu3$$',
    database: 'movies_db'
  },
  console.log(`Connected to the movies_db database.`)
);


// routes

// see list of all departments
app.get('/movies', (req, res) => {
  db.query('SELECT * FROM movies_db', function (err, results) {
    res.json(results);
    if (err) {
      return console.log(err);
    }
    console.log(results);
  });
});

app.post('/add-movie', (req, res) => res.send('I have now created a DELETE route!'));
app.put('/update-review', (req, res) => res.send('I have now created a PUT route!'));

// remove a movie
app.delete('/movie/:id', (req, res) => {
  let remove = 3;
  db.query(`DELETE FROM movies_db WHERE id = ?`, remove, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });
});

// default response for any other request (not found)
app.use((req, res) => {
  res.status(404).end();
});

// app listens on designated port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
