process.env.NODE_ENV = 'test';

var app = require('../app');
var request = require('supertest');
var passportStub = require('passport-stub');
var expect = require('chai').expect;
var assert = require('chai').assert;
var api = require('./../routes/api.js')

passportStub.install(app);


describe('/api tests', function() {
	this.timeout(60000);
	describe('/Locations tests', function() {
		var location = null;

		describe('Post /locations', function() {
			it('should return the object just created', function(done) {
				request(app)
					.post('/api/locations')
					.set({
						'Content-Type': 'application/json'
					})
					.send({
						"name": "testGooiWegAUB",
						"type": "knooppuntIntercitystation",
						"latitude": 51.69048,
						"longitude": 5.29362

					})
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isObject(res.body, "response is a location object")
						assert.isNotNull(res.body.name, 'location has a name')
						location = res.body;
						done();
					});
			});
		});
		describe('Get /locations', function() {
			it('should return an array of all location objects', function(done) {
				request(app)
					.get('/api/locations')
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isArray(res.body, 'res.body should be an array of locations');
						done();
					})
			});
			it('should return a single location object', function(done) {
				request(app)
					.get('/api/locations/' + location._id)
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isObject(res.body, 'res.body should be a location object');
						done();
					})
			});
			it('should return an array of location objects sorted on distance from lat/lon where the range parameter is the distance', function(done) {
				request(app)
					.get('/api/locations?latitude=51.69048&longitude=5.29362&range=100000')
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isArray(res.body, 'res.body should be an array of locations');
						done();
					})
			});
			it('should return an array of location objects sorted on distance with a limit on objects returned where the range parameter is the distance', function(done) {
				request(app)
					.get('/api/locations?latitude=51.69048&longitude=5.29362&range=100000&limit=10')
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isArray(res.body, 'res.body should be an array of locations');
						done();
					})
			});
		});
		describe('Put /locations', function() {
			it('should return the object that was modified', function(done) {
				request(app)
					.put('/api/locations/' + location._id)
					.set({
						'Content-Type': 'application/json'
					})
					.send({
						"latitude": 70.69048,
					})
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isObject(res.body, "response is a location object")
						assert.isNotNull(res.body.latitude, 70.69048, 'location has a name')
						location = res.body;
						done();
					});
			});
		});
		describe('Delete /locations', function() {
			it('should return the object that was deleted', function(done) {
				request(app)
					.delete('/api/locations/' + location._id)
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isObject(res.body, "response is a location object")
						assert.isNotNull(res.body.latitude, 70.69048, 'location has a name')
						done();
					})
			});
		});
	});



	describe('/Spots tests', function() {
		var spot = null;

		describe('Post /spots', function() {
			it('should return a spot object that was created', function(done) {
				request(app)
					.post('/api/spots')
					.set({
						'Content-Type': 'application/json'
					})
					.send({
						"name": "spottest",
						"description": "test",
						"latitude": "51.7632138",
						"longitude": "5.8716982",
						"creationDate": "1427842021",
						"image": {
							"extension": "image/jpeg",
							"data": "testimage"
						}
					})
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isObject(res.body, "response is a spot object")
						assert.isNotNull(res.body.name, 'spot has a name')
						spot = res.body;
						done();
					});
			});
		})
		describe('Get /spots', function() {
			it('should return an array of all spot objects', function(done) {
				request(app)
					.get('/api/spots')
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isArray(res.body, 'res.body should be an array of spots');
						done();
					})
			});
			it('should return an array of spot objects with pagination', function(done) {
				request(app)
					.get('/api/spots?itemsPerPage=3&pageNumber=1')
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isObject(res.body, 'res.body should be an array of spots');
						done();
					})
			});
			it('should return an array of spot objects with an owner', function(done) {
				request(app)
					.get('/api/spots?owner=55129a68c29fcd301d0612ea')
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isArray(res.body, 'res.body should be an array of spots');
						done();
					})
			});
			it('should return an array of spot objects sorted on distance with a limit on objects returned', function(done) {
				request(app)
					.get('/api/spots?latitude=51.69048&longitude=5.29362&range=100000&limit=10')
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isArray(res.body, 'res.body should be an array of spots');
						done();
					})
			});
			it('should return a single spot object', function(done) {
				request(app)
					.get('/api/spots/' + spot._id)
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isObject(res.body, 'res.body should be a location object');
						done();
					})
			});
		});
		describe('Put /spots', function() {
			it('should return the object that was modified', function(done) {
				request(app)
					.put('/api/spots/' + spot._id)
					.set({
						'Content-Type': 'application/json'
					})
					.send({
						"latitude": 70.69048
					})
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isObject(res.body, "response is a spot object")
						assert.isNotNull(res.body.latitude, 70.69048, 'spot has a name')
						spot = res.body;
						done();
					});
			});
		});
		describe('Delete /spots', function() {
			it('should return the object that was deleted', function(done) {
				request(app)
					.delete('/api/spots/' + spot._id)
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}
						assert.isObject(res.body, "response is a spot object")
						assert.isNotNull(res.body.latitude, 70.69048, 'spot has a name')
						done();
					})
			});
		});
	});
});

describe('Common operations', function() {
	this.timeout(60000);
	it('should return an image object', function(done) {
		request(app)
			.get('/api/spots/551a923e3b9d50110055a63b')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				done();
			})
	});

	it('should update the database with locations from the NS API', function(done) {
		request(app)
			.get('/api/updateLocationsManually')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				done();
			})
	});
});