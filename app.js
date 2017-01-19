var express = require("express");
var app = express();

var bodyParser = require('body-parser');
//==> False force the use of the native querystring Node library
var parseUrlencoded = bodyParser.urlencoded({extended: false});

//==> "static" is the only middleware that comes with express
app.use(express.static("public"));

//BEGIN - Redis Connection
var redis = require("redis");

if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var client = redis.createClient(rtg.port, rtg.hostname);

    client.auth(rtg.auth.split(":")[1]);
} else {
    var client = redis.createClient();
    client.select((process.env.NODE_ENV || "development").length);
}
//END - Redis Connection

app.get("/", function(request, response) {
    response.send("OK");
});

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

app.get("/cities", function(request, response) {
    client.hkeys("cities", function(error, names) {
        if (error) {
            throw error;
        }
        response.json(names);
    });
});

app.post("/cities", parseUrlencoded, function(request, response) {
    var newCity = request.body;
    if (!newCity.name || !newCity.description) {
        return response.sendStatus(400);
    }
    client.hset("cities", newCity.name, newCity.description, function(error) {
        if (error) {
            throw error;
        }
        return response.status(201).json(newCity.name);
    });
});

app.delete("/cities/:name", function(request, response) {
    client.hdel("cities", request.params.name, function(error) {
        if (error) {
            throw error;
        }
        return response.sendStatus(204);
    });
});

module.exports = app;