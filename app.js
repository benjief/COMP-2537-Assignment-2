// Requires
const express = require('express');
const app = express();
const fs = require("fs");
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Gets
app.get('/', function (req, res) {

  // Build the DB if it doesn't exist
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
  });

  const createDBAndTables =
    // Table of GreenQuest users
    `CREATE DATABASE IF NOT EXISTS greenquest;
      use greenquest;
    CREATE TABLE IF NOT EXISTS users (
        ID int NOT NULL AUTO_INCREMENT,
        first_name varchar(30) NOT NULL,
        last_name varchar(50) NOT NULL,
        email varchar(50),
        user_type varchar(30) NOT NULL,
        PRIMARY KEY (ID)
        );`;

  connection.connect();
  connection.query(createDBAndTables, function (error, results, fields) {
    if (error) {
      throw error;
    }
    //console.log(results);

  });
  connection.end();

  let doc = fs.readFileSync('./index.html', "utf8");
  res.send(doc);
});


app.get('/get-users', function (req, res) {

  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'greenquest'
  });
  connection.connect();
  connection.query('SELECT * FROM users', function (error, results, fields) {
    if (error) {
      throw error;
    }
    console.log('Rows returned are: ', results);
    res.send({ status: "success", rows: results });

  });
  connection.end();


});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Notice that this is a 'POST'
app.post('/add-user', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  console.log("First Name", req.body.first_name);
  console.log("Last Name", req.body.last_name);
  console.log("email", req.body.email);
  console.log("User type", req.body.user_type);

  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'greenquest'
  });
  connection.connect();
  // TO PREVENT SQL INJECTION, DO THIS:
  // (FROM https://www.npmjs.com/package/mysql#escaping-query-values)
  connection.query('INSERT INTO users (first_name, last_name, email, user_type) values (?, ?, ?, ?)',
        [req.body.first_name, req.body.last_name, req.body.email, req.body.user_type],
        function (error, results, fields) {
    if (error) {
        throw error;
    }
    //console.log('Rows returned are: ', results);
    res.send({ status: "success", msg: "Recorded added." });

  });
  connection.end();

});

// POST: we are changing stuff on the server!!!
app.post('/delete-user', function (req, res) {
  console.log(req.body.row_id);
  res.setHeader('Content-Type', 'application/json');

  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'greenquest'
  });
  connection.connect();

  connection.query('DELETE FROM users WHERE ID = ' + req.body.row_id,
    function (error, results, fields) {
      if (error) {
        throw error;
      }
      //console.log('Rows returned are: ', results);
      res.send({ status: "success", msg: "User deleted." });

    });
  connection.end();

});

// POST: we are changing stuff on the server!!!
app.post('/delete-all-users', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'greenquest'
  });
  connection.connect();
  // REALLY A DUMB THING TO DO, BUT JUST SHOWING YOU CAN
  connection.query('DELETE FROM users',
    function (error, results, fields) {
      if (error) {
        throw error;
      }
      //console.log('Rows returned are: ', results);
      res.send({ status: "success", msg: "All users deleted." });

    });
  connection.end();

});

// ANOTHER POST: we are changing stuff on the server!!!
app.post('/update-user', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'greenquest'
  });
  connection.connect();

  connection.query('UPDATE users SET email = ? WHERE ID = ?',
    [req.body.email, req.body.id],
    function (error, results, fields) {
      if (error) {
        throw error;
      }
      //console.log('Rows returned are: ', results);
      res.send({ status: "success", msg: "Recorded updated." });

    });
  connection.end();

});

// RUN SERVER
let port = 8000;
app.listen(port, function () {
  console.log('CRUD app listening on port ' + port + '!');
})
