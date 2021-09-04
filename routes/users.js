const express = require('express');
const user = express.Router();
var mysql = require('mysql');

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


user.route('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/login.html"));
})
  
user.route('/login',  (req, res) => {
  res.sendFile(path.join(__dirname, "/views/login.html"));
})

// user.post('/login', checkNotAuthenticated, passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }))

// user.get('/register', checkNotAuthenticated, (req, res) => {
//   res.render('./views/register.html')
// })

// user.post('/register', checkNotAuthenticated, async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10)
//     users.push({
//       id: Date.now().toString(),
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword
//     })
//     res.redirect('/login')
//   } catch {
//     res.redirect('/register')
//   }
// })

// user.delete('/logout', (req, res) => {
//   req.logOut()
//   res.redirect('/login')
// })
