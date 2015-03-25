var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var image = new Schema({
    name    	: { type: String, required : true },
    extension 	: { type: String, required : true },
    data 		: { type: String, required : true }
});

mongoose.model( 'image', image );
mongoose.connect( 'mongodb://localhost/treinspot' );