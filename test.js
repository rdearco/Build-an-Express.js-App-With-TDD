var request = require("supertest");
var app = require("./app");

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
        .expect(JSON.stringify(['Lotopia', 'Caspiana', 'Indigo']), done);
    });
});