var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Image = mongoose.model('image');
var Spot = mongoose.model('spot');
var User = mongoose.model('user');

router.post('/images', function(req, res, next) {
	var image = new Image({
      extension   : req.body.extension,
      data        : req.body.data
    });

    image.save( function( err, image, count ){
      if(err) {
        res.statusCode = 404;
        res.json(err);
      }
      res.json(image);
    });
});

router.get('/images/:id', function(req, res, next) {
  Image.findById(req.params.id, function (err, image) {
    if(err) {
      res.statusCode = 404;
      res.json(err);
    }
    res.contentType(image.extension);
    var buffer = new Buffer(image.data, 'base64'); 
    res.send(buffer);
  });
});

router.get("/images", function (req, res, next) {
    Image.find( {}, function ( err, images, count ){
      if(err) {
        res.json(err);
      }
      if(count === 0) {
        res.json({"Message" : "No images found"})
      }
      res.json(images);
  });
});

router.delete("/images/:id", function (req, res, next) {
      Image.findById( req.params.id, function ( err, image ){
        if(err) {
            res.statusCode = 404;
            res.json(err);
        } 
        if(image != null) {
          image.remove( function ( err, image ){
          res.json(image);
      });
    }
  });
});




















router.post('/spots', function(req, res, next) {
  var image = new Image({
    extension   : req.body.image.extension,
    data        : req.body.image.data
  });

  image.save( function( err, image, count ){
    if(err) {
      res.statusCode = 404;
      res.json(err);
    }
    var spot = new Spot({
      name         : req.body.name,
      description  : req.body.description,
      latitude     : req.body.latitude,
      longitude    : req.body.longitude,
      image        : image,
      owner        : "55129a68c29fcd301d0612ea" //hardcoded owner
    });
    spot.save( function( err, spot, count ){
      if(err) {
        res.statusCode = 404;
        res.json(err);
      }
      res.json(spot);
    });
  });
});

router.get('/spots/:id', function(req, res, next) {
  Spot.findById(req.params.id, function (err, spot) {
    if(err) {
      res.statusCode = 404;
      res.json(err);
    }
  });
});

router.get("/spots", function (req, res, next) {
  var criteria = {};
  if(req.param('owner')) {
    criteria = { owner: req.param('owner')} 
  }
  Spot.find( {}, function ( err, spot, count ){
    if(err) {
      res.json(err);
    }
    if(count === 0) {
      res.json({"Message" : "No spots found"})
    }
    res.json(spot);
  }).populate('image owner');
});

router.delete("/spots/:id", function (req, res, next) {
      Image.findById( req.params.id, function ( err, spot ){
        if(err) {
            res.statusCode = 404;
            res.json(err);
        } 
        if(spot != null) {
          spot.remove( function ( err, spot ){
          res.json(spot);
      });
    }
  });
});

module.exports = router;