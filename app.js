var express = require("express");
var app = express();

//==> "static" is the only middleware that comes with express
app.use(express.static("public"));

var cities = require("./routes/cities");
app.use("/cities", cities);

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

module.exports = app;