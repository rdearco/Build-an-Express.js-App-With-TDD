var express = require("express");
var app = express();

//==> "static" is the only middleware that comes with express
app.use(express.static("public"));

app.get("/", function(request, response) {
    response.send("OK");
});

app.get("/cities", function(request, response) {
    var cities = ['Lotopia', 'Caspiana', 'Indigo'];
    response.json(cities);
});

module.exports = app;