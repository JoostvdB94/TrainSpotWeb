var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePages = require('mongoose-pages');
var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');


var image = new Schema({
    extension: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
});

var spot = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    creationDate: {
        type: Number,
        required: true
    }
    image: {
        type: Schema.Types.ObjectId,
        ref: 'image',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
});

mongoosePages.skip(spot);

var user = new Schema({
    roles: [String],
    local: {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    }
});


var location = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['knooppuntIntercitystation', 'stoptreinstation', 'userlocation', 'intercitystation', 'facultatiefStation', 'knooppuntStoptreinstation']
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

mongoose.model('image', image);
mongoose.model('spot', spot);
mongoose.model('user', user);
mongoose.model('location', location);

mongoose.connect('mongodb://trainspot:TrainSpot@ds045027.mongolab.com:45027/trainspot');