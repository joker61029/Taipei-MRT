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

const conn = new mysql.createConnection(config);

conn.connect(
    conn.on('error', function(err) {
        console.log("[mysql error]", err);
}));

router.route('/')
    .get(function(req, res){
        conn.query('SELECT * FROM `station` WHERE `lineID` = "BL" ORDER BY `lineNum`;', 
            function (err, results, fields) {
                if (err) throw err;
                // else console.log('Selected ' + results.length + ' row(s).');
                for (i = 0; i < results.length; i++) {
                    // console.log(JSON.stringify(results[i]));
                }
                res.json(results)
            });
        // conn.end(
        //     function (err) { 
        //         if (err) throw err;
        //         else  console.log('Closing connection.') 
        // }
        // );
        
        // conn.query('')
    })