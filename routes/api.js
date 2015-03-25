var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Image = mongoose.model('image');


router.post('/images', function(req, res, next) {
	var image = new Image({
      name        : req.body.name,
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
    res.send(buf);
  });
});

module.exports = router;