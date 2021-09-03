var express = require("express");
var router = express.Router();
var mysql = require('mysql');

module.exports = router ;

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

router.route('/')
    .get(function(req, res){
        conn.query('SELECT * FROM `station`;', 
            function (err, results, fields) {
                res.json(results)
            });
})

router.route('/:id')
    .get(function(req, res){
        conn.query('SELECT * FROM `line` ORDER BY `id`;',
            function (err, results, fields) {
                res.json(results)
            });
})
