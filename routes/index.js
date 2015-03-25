var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Image = mongoose.model('image');
var fs = require('fs');

module.exports = router;