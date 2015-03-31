var mongoose = require('mongoose');
var http = require('http');
var Image = mongoose.model('image');
var CronJob = require('cron').CronJob;
var Spot = mongoose.model('spot');
var User = mongoose.model('user');
var Location = mongoose.model('location');
var request = require('request');


var job = new CronJob({
    cronTime: '1 * * * * *',
    onTick: function() {
        updateLocations();
    },
    start: true
});


function updateLocations() {
    var options = {
        host: 'webservices.ns.nl',
        path: '/ns-api-stations-v2',
        auth: "dannyvdbiezen@outlook.com" + ':' + "XnUYCIQtPEjlnz0BUztek8jqMgpxm4_Nvk1yqx7C59sEzjy71yZz2g"
    };
    var req = http.get(options, function(resp) {
        var xml = '';
        resp.on('data', function(chunk) {
            xml += chunk;
        });

        resp.on('end', function() {
            xml2js = require('xml2js');
            var parser = new xml2js.Parser({
                explicitArray: false
            });
            parser.addListener('end', function(result) {
                updateLocationDatabase(transformJsonToLocations(result));
            });
            parser.parseString(xml);

        });
    });

    req.on('error', function(err) {
        console.log(err);
    });
}

function updateLocationDatabase(data) {
    Location.find({}, function(err, locations) {
        for (var station in data) {
            var stationFoundInDatabase = false;
            var stationName = data[station].name;
            for (var location in locations) {
                var locationName = locations[location].name;
                if (stationName == locationName) {
                    stationFoundInDatabase = true;
                }
            }
            if (!stationFoundInDatabase) {
                data[station].save(function(err, location) {});
            }
        }
    });
}

function transformJsonToLocations(json) {
    var locations = [];
    for (var station in json.Stations.Station) {
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

module.exports = function(router, io) {



    router.post('/spots', function(req, res, next) {
        var image = new Image({
            extension: req.body.image.extension,
            data: req.body.image.data
        });

        image.save(function(err, image, count) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            var spot = new Spot({
                name: req.body.name,
                description: req.body.description,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                creationDate: req.body.creationDate,
                image: image,
                owner: "55129a68c29fcd301d0612ea" //hardcoded owner
            });
            spot.save(function(err, spot, count) {
                if (err) {
                    res.statusCode = 404;
                    res.json(err);
                } else {
                    var pushUrl = req.protocol + '://compuplex.nl:10030/send';
                    request({
                            method: 'POST',
                            url: pushUrl,
                            json: true,
                            body: {
                                "android": {
                                    "collapseKey": "optional",
                                    "data": {
                                        "message": "[spot added]"
                                    }
                                }
                            }
                        },
                        function(error, response, body) {
                            if (error) {
                                throw error;
                            }
                        });
                    io.emit('spot added', spot);
                    res.json(spot);
                }
            });

        });
    });

    router.put('/spots/:id', function(req, res, next) {
        Spot.findOneAndUpdate({
            _id: req.params.id
        }, req.body, function(err, spot) {
            if (err) {
                res.json(err);
            } else {
                res.json(spot);
            }
        });
    });


    router.get('/spots/:id', function(req, res, next) {
        Spot.findById(req.params.id, function(err, spot) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            } else {
                res.json(spot);
            }
        });
    });

    router.get("/spots", function(req, res, next) {
        var criteria = {};
        if (req.query.owner) {
            criteria = {
                owner: req.query.owner
            }
        }
        if (req.query.itemsPerPage && req.query.pageNumber) {
            Spot.findPaginated(criteria, function(err, result) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(result);
                }
            }, req.query.itemsPerPage, req.query.pageNumber).populate('image owner');
        } else {
            Spot.find(criteria, function(err, spot, count) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(spot);
                }
            }).populate('image owner');
        }
    });

    router.delete("/spots/:id", function(req, res, next) {
        Spot.findById(req.params.id, function(err, spot) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            if (spot != null) {
                spot.remove(function(err, spot) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(spot);
                    }
                });
            } else {
                res.json({error : "Spot not found"})
            }
        });
    });

    router.post('/locations', function(req, res, next) {
        var location = new Location({
            name: req.body.name,
            type: req.body.type,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });

        location.save(function(err, location, count) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            } else {
                res.json(location);
            }
        });
    });

    router.get('/locations/:id', function(req, res, next) {
        Location.findById(req.params.id, function(err, location) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            } else {
                res.json(location);
            }
        });
    });

    router.get("/locations", function(req, res, next) {
        if (req.query.latitude && req.query.longitude) {
            var range = 50;
            if (req.query.range) {
                range = req.query.range;
            }
            var limit = 0;
            if (req.query.limit) {
                limit = req.query.limit;
            }
            Location.find({}, function(err, locations) {
                if (err) {
                    res.statusCode = 404;
                    res.json(err);
                } else {
                    var locationsInRange = [];
                    for (var location in locations) {
                        var distance = calculateLatLonDistance(req.query.latitude, req.query.longitude, locations[location].latitude, locations[location].longitude)
                        if (distance <= range) {
                            locationWithDistance = locations[location].toObject();
                            locationWithDistance.distance = Math.ceil(distance);
                            locationsInRange.push(locationWithDistance);
                        }
                    }
                    locationsInRange.sort(function(a, b) {
                        return a.distance - b.distance
                    });
                    if (limit > 0) {
                        res.json(locationsInRange.slice(0, limit));
                    } else {
                        res.json(locationsInRange);
                    }
                }
            });
        } else {
            Location.find({}, function(err, location, count) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(location);
                }
            });
        }
    });

    function calculateLatLonDistance(lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var radlon1 = Math.PI * lon1 / 180;
        var radlon2 = Math.PI * lon2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var distance = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        distance = Math.acos(distance)
        distance = distance * 180 / Math.PI;
        distance = distance * 60 * 1.1515;
        distance = distance * 1.609344;
        return distance;
    }

    router.delete("/locations/:id", function(req, res, next) {
        Location.findById(req.params.id, function(err, location) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            if (location != null) {
                location.remove(function(err, location) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(location);
                    }
                });
            }
        });
    });

    router.put('/locations/:id', function(req, res, next) {
        Location.findOneAndUpdate({
            _id: req.params.id
        }, req.body, function(err, location) {
            if (err) {
                res.json(err);
            } else {
                res.json(location);
            }
        });
    });


    router.post('/images', function(req, res, next) {
        var image = new Image({
            extension: req.body.extension,
            data: req.body.data
        });

        image.save(function(err, image, count) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            } else {
                res.json(image);
            }
        });
    });

    router.get('/images/:id', function(req, res, next) {
        Image.findById(req.params.id, function(err, image) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            } else {
                res.contentType(image.extension);
                var buffer = new Buffer(image.data, 'base64');
                res.send(buffer);
            }
        });
    });

    router.get("/images", function(req, res, next) {
        Image.find({}, function(err, images, count) {
            if (err) {
                res.json(err);
            } else {
                res.json(images);
            }
        });
    });

    router.delete("/images/:id", function(req, res, next) {
        Image.findById(req.params.id, function(err, image) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            if (image != null) {
                image.remove(function(err, image) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(image);
                    }
                });
            }
        });
    });
    return router;
};