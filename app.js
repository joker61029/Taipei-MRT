const bodyparser = require('body-parser'); 
var express = require("express");
var app = express();
var path = require("path");
var station = require("./routes/station");
var users = require("./routes/users")
const bcrypt = require('bcrypt');
const passport = require('passport');
// const flash = require('express-flash');
// const session = require('express-session');
// const methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '/views')));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/index.html"));
})

app.use("/api/station", station);
app.use("/user", users);

app.listen(3000, function(){
    console.log("Server Started");
});
