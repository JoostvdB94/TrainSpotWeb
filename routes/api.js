var mongoose = require('mongoose');
var http = require('http');

var Image = mongoose.model('image');
var Spot = mongoose.model('spot');
var User = mongoose.model('user');
var Location = mongoose.model('location');

module.exports = function(router,io) {

    


    router.post('/spots', function (req, res, next) {
        var image = new Image({
            extension: req.body.image.extension,
            data: req.body.image.data
        });

        image.save(function (err, image, count) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            var spot = new Spot({
                name: req.body.name,
                description: req.body.description,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                image: image,
                owner: "55129a68c29fcd301d0612ea" //hardcoded owner
            });
            spot.save(function (err, spot, count) {
                if (err) {
                    res.statusCode = 404;
                    res.json(err);
                }
                res.json(spot);
                io.emit('spot added', spot);
            });

        });
    });

    router.get('/spots/:id', function (req, res, next) {
        Spot.findById(req.params.id, function (err, spot) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
        });
    });

    router.get("/spots", function (req, res, next) {
        var criteria = {};
        if (req.param('owner')) {
            criteria = {owner: req.param('owner') }
        }
        
        Spot.find(criteria, function (err, spot, count) {
            if (err) {
                res.json(err);
            }
            res.json(spot);
        }).populate('image owner');
    });

    router.delete("/spots/:id", function (req, res, next) {
        Image.findById(req.params.id, function (err, spot) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            if (spot != null) {
                spot.remove(function (err, spot) {
                    res.json(spot);
                });
            }
        });
    });


    router.post('/locations', function (req, res, next) {
        var location = new Location({
            name: req.body.name,
            type: req.body.type,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });

        location.save(function (err, location, count) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            res.json(location);
        });
    });

    router.get('/locations/:id', function (req, res, next) {
        Location.findById(req.params.id, function (err, location) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            res.json(location);
        });
    });

    router.get("/locations", function (req, res, next) {
        Location.find({}, function (err, location, count) {
            if (err) {
                res.json(err);
            }
            res.json(location);
        });
    });

    router.delete("/locations/:id", function (req, res, next) {
        Location.findById(req.params.id, function (err, location) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            if (location != null) {
                location.remove(function (err, location) {
                    res.json(location);
                });
            }
        });
    });


    router.get('/data', function (req, res, next) {
        var options = {
            host: 'webservices.ns.nl',
            path: '/ns-api-stations-v2',
            auth: "dannyvdbiezen@outlook.com" + ':' + "XnUYCIQtPEjlnz0BUztek8jqMgpxm4_Nvk1yqx7C59sEzjy71yZz2g"
        };
        var req = http.get(options, function (resp) {
            var xml = '';
            resp.on('data', function (chunk) {
                xml += chunk;
            });

        resp.on('end', function () {
          xml2js = require('xml2js');
          var parser = new xml2js.Parser({explicitArray : false});
          parser.addListener('end', function(result) {
            res.json(addLocationsToSchema(result));
          });
          parser.parseString(xml);
          
        });
      });

      req.on('error', function (err) {
        console.log(err);
      });
    });

  function addLocationsToSchema(json) {
    var locations = [];
    for(var station in json.Stations.Station){
      var result = json.Stations.Station[station]
      var location = new Location({
        name: result.Namen.Lang,
        type: result.Type,
        latitude: result.Lat,
        longitude: result.Lon
      });
      locations.push(location);
    }
    return locations;
  }

  router.post('/images', function (req, res, next) {
        var image = new Image({
            extension: req.body.extension,
            data: req.body.data
        });

        image.save(function (err, image, count) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            res.json(image);
        });
    });

    router.get('/images/:id', function (req, res, next) {
        Image.findById(req.params.id, function (err, image) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            res.contentType(image.extension);
            var buffer = new Buffer(image.data, 'base64');
            res.send(buffer);
        });
    });

    router.get("/images", function (req, res, next) {
        Image.find({}, function (err, images, count) {
            if (err) {
                res.json(err);
            }
            if (count === 0) {
                res.json({"Message": "No images found"})
            }
            res.json(images);
        });
    });

    router.delete("/images/:id", function (req, res, next) {
        Image.findById(req.params.id, function (err, image) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            if (image != null) {
                image.remove(function (err, image) {
                    res.json(image);
                });
            }
        });
    }); 
  return router;
};