var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var image = new Schema({
    extension 	: { type: String, required : true },
    data 		: { type: String, required : true },
});

var spot = new Schema({
    name    		: { type: String, required : true },
    description 	: { type: String },
    latitude 		: { type: Double, required : true },
    longitude 		: { type: Double, required : true },
    image			: { type: Schema.Types.ObjectId, ref: 'image', required : true },
    owner			: { type: Schema.Types.ObjectId, ref: 'user' },			
});

var user = new Schema({
    name    	: { type: String, required : true },
    password 	: { type: String, required : true },
});

var location = new Schema({
	name 		: { type: String, required : true },
	type 		: { type: String, required : true },
    latitude 		: { type: Double, required : true },
    longitude 		: { type: Double, required : true },
});

mongoose.model( 'image', image );
mongoose.model( 'spot', spot );
mongoose.model( 'user', user );
mongoose.model( 'location', location );

mongoose.connect( 'mongodb://localhost/treinspot' );