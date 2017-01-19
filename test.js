var request = require("supertest");
var app = require("./app");

var redis = require("redis");
var client = redis.createClient();
client.select("test".length);
//==> Clear database
client.flushdb();

describe("Requests to the root path", function(){
    it("Returns a 200 status code", function(done) {
        request(app).get('/')
        .expect(200, done);
    });

    it("Returns a HTML format", function(done) {
        request(app).get('/')
        .expect('Content-Type', /html/, done);
    });

    it("Returns an index file with Cities", function(done) {
        request(app).get('/')
        .expect(/cities/i, done); //==> Use regular expressions case insenstive
    });
});
describe("Listing Cities on /cities", function(){
    it("Returns a 200 status code", function(done) {
        request(app).get('/cities')
        .expect(200, done); //==> 2nd parameter allows you to not have to call .end()
    });

    it("Returns JSON format", function(done) {
        request(app).get('/cities')
        .expect('Content-Type', /json/) //==> Send in a regular expression
        .end(function(error) {
            if (error) throw error;
            done();
        });
    });

    it("Returns initial cities", function(done) {
        request(app).get('/cities')
        .expect(JSON.stringify([]), done);
    });
});
describe("Creating new cities", function(){
    it("Returns a 201 status code", function(done) {
        request(app)
        .post('/cities')
        .send('name=Springfield&description=where+the+simpsons+live')
        .expect(201, done);
    });

    it("Returns the city name", function(done) {
        request(app)
        .post('/cities')
        .send('name=Springfield&description=where+the+simpsons+live')
        .expect(/springfield/i, done);
    });
});
describe("Deleting cities", function(){
    before (function() {
        client.hset("cities", "Banana", "A tasty fruit");
    });
    after(function() {
        client.flushdb();
    });

    it("Returns a 204 status code", function(done) {
        request(app)
        .delete('/cities/Banana')
        .expect(204)
        .end(function(error) {
            if (error) {
                throw error;
            }
            done();
        });
    });
    /*
    it("Returns the city name", function(done) {
        request(app)
        .post('/cities')
        .send('name=Springfield&description=where+the+simpsons+live')
        .expect(/springfield/i, done);
    });
    */
});