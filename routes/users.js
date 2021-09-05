const express = require('express');
const cookieParser = require('cookie-parser');

const user = express.Router();
const path = require("path");
const session = require('express-session')
var mysql = require('mysql');

user.use(session({
  secret: 'some secret',
  cookie: { maxAge: 30000},
  saveUninitialized: false
}))
user.use(cookieParser());
user.use(express.static(path.join(__dirname, '/views')));
user.use(express.json());
user.use(express.urlencoded({ extended: false}));


module.exports = user ;
require('dotenv').config();

var config =
{
    host: process.env['DB_HOST'],
    user: process.env['DB_user'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_DATABASE'],
    port: 3306,
    ssl: true
};
const conn = new mysql.createConnection(config);

conn.connect(
    conn.on('error', function(err) {
        console.log("[mysql error]", err);
}));

// function validataAuthToken(req, res, next){
//   const { authorization } = req.headers;
//   if (authorization && authorization === '123'){
//     next();
//   } else{
//     res.status(403).send({ msg: 'Forbidden. Incorrect Credentials'});
//   }
// }

function validateCookie(req, res, next){
  const { cookies } = req;
  if("session_id" in cookies){
    console.log("Session ID Exists.");
    if(cookies.session_id === '1234567') next();
    else res.status(403).send({ msg: "Not Authenticated."});
  } else res.status(403).send({ msg: "Not Authenticated."});
}

user.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
})

user.get('/protected', validateCookie, (req, res) =>{
  res.status(200).json({ msg: 'You are authorized!'});
})

user.get('/register', (req, res) => {
  if (req.session.authenticated){
    res.redirect('/')
  }
  res.sendFile(path.join(__dirname, "../views/register.html"));
  // res.cookie('session_id', '1234567');
  // res.status(200).json({ msg: 'Logged in.'})
})

user.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    if (req.session.authenticated){
      res.redirect('/')
    }
    conn.query('SELECT * FROM MRT.users WHERE `email` = ?;', [email],
      function(err, result, fields){
        if (result.length == 0){
          conn.query('INSERT INTO MRT.users (`username`, `password`, `email`) VALUES (?, ?, ?) ;', [name, password, email])
          res.redirect('/user/login')
        }
        else{
          res.redirect('/user/register')
          // res.status(403).json({ msg: 'Registed Already.'})
        }
  })
  }
})

user.get('/login', (req, res) => {
  if (req.session.authenticated){
    res.redirect('/')
  }
  res.sendFile(path.join(__dirname, "../views/login.html"));
})
user.post('/login',  (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    if (req.session.authenticated){
      res.json(req.session);
      res.redirect('/');
    } else {
      conn.query('SELECT `password` FROM MRT.users WHERE `email` = ?;', [email],
      function(err, result, fields){
        if( password === result[0]["password"]){
          req.session.authenticated = true;
          req.session.user = {
            email, password
          };
          // console.log(req.session.authenticated);
          res.redirect('/')
          // res.sendFile(path.join(__dirname, "../views/index.html"));
        } else{
          res.status(403).json({ msg: 'Bad Credentials'});
        }
      })
      // console.log(sql_password, password);
      
    }
  }
  // res.send(200);
})

user.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, "../views/forgot-password.html"));
})


user.delete('/logout', (req, res) => {

  res.redirect('/login')
})
