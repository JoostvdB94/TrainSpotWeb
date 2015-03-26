var mongoose = require('mongoose');
var passport = require('passport');

module.exports = function(router) {

    router.get('/', function (req, res, next) {
        res.render('index');
    });

    router.post('/login', passport.authenticate('local', {successRedirect: '/crud', failureRedirect: '/fail'}));

    router.get('/fail', function (req, res, next) {
        res.send("Auth error");
    });

    return router;
};