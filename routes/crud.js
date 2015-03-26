/**
 * Created by Joost on 25-3-2015.
 */
var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('user');
var Spot = mongoose.model('spot');

module.exports = function(router) {
    router.get('/', function (req, res, next) {
        res.render('crud/index');
    });

    router.get('/users', function (req, res, next) {
        //Gebruik lean voor javascript Objects, in plaats van MongooseObjects. Save en andere mongoose functies werken hierdoor niet
        User.find({}).lean().exec(function (err, users) {
            res.render('crud/users', {users: users});
        });

    });

    router.get('/spots', function (req, res, next) {
        Spot.find({}).populate('image owner').lean().exec(function (err, spots) {
            res.render('crud/spots', {spots: spots});
        });
    });

    return router;
};


