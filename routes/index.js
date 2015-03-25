var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');

router.get('/',function(req, res, next){
    res.render('index');
});

router.post('/login', passport.authenticate('local',{successRedirect:'/crud',failureRedirect:'/fail'}));

router.get('/fail',function(req,res,next){
    res.send("Auth error");
});

module.exports = router;