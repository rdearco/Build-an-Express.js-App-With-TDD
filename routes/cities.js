var express = require("express");

var bodyParser = require('body-parser');
//==> False force the use of the native querystring Node library
var parseUrlencoded = bodyParser.urlencoded({extended: false});

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

var router = express.Router();

router.route("/:name")
.get(function(request, response) {
    client.hget('cities', request.params.name, function(error, description) {
      response.render('show.ejs',
                      { city:
                        { name: request.params.name, description: description }
                      });
    });
})
.delete(function(request, response) {
    client.hdel("cities", request.params.name, function(error) {
        if (error) {
            throw error;
        }
        response.sendStatus(204);
    });
});

router.route("/")
.get(function(request, response) {
    client.hkeys("cities", function(error, names) {
        if (error) {
            throw error;
        }
        response.json(names);
    });
})
.post(parseUrlencoded, function(request, response) {
    var newCity = request.body;
    if (!newCity.name || !newCity.description) {
        return response.sendStatus(400);
    }
    client.hset("cities", newCity.name, newCity.description, function(error) {
        if (error) {
            throw error;
        }
        response.status(201).json(newCity.name);
    });
});

module.exports = router;