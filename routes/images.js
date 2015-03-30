module.exports = function(router) {

    router.post('/images', function(req, res, next) {
        var image = new Image({
            extension: req.body.extension,
            data: req.body.data
        });
        image.save(function(err, image, count) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            res.json(image);
        });
    });

    router.get('/images/:id', function(req, res, next) {
        Image.findById(req.params.id, function(err, image) {
            if (err) {
                res.statusCode = 404;
                res.json(err);
            }
            res.contentType(image.extension);
            var buffer = new Buffer(image.data, 'base64');
            res.send(buffer);
        });
    });

    router.get("/images", function(req, res, next) {
        Image.find({}, function(err, images, count) {
            if (err) {
                res.json(err);
            }
            if (count === 0) {
                res.json({
                    "Message": "No images found"
                })
            }
            res.json(images);
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
                    res.json(image);
                });
            }
        });
    });
    return router;
}