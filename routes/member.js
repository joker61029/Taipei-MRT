var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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

router.post('/', function(req, res, next) {
  console.log(req.body.test)
    
});

module.exports = router;