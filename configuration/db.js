var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var image = new Schema({
    name    	: { type: String, required : true },
    extension 	: { type: String, required : true },
    data 		: { type: String, required : true },
});

var spot = new Schema({
    name    		: { type: String, required : true },
    description 	: { type: String, required : true },
    latitude 		: { type: String, required : true },
    longitude 		: { type: String, required : true },
    image			: { type: Schema.Types.ObjectId, ref: 'image' },
    owner			: { type: Schema.Types.ObjectId, ref: 'user' , required : true},			
});

var user = new Schema({
    name    	: { type: String, required : true },
    password 	: { type: String, required : true },
    spots 		: [{ type: Schema.Types.ObjectId, ref: 'spot' }]
});

var location = new Schema({
	name 		: { type: String, required : true },
	type 		: { type: String, required : true },
    latitude 		: { type: String, required : true },
    longitude 		: { type: String, required : true },
});

mongoose.model( 'image', image );
mongoose.model( 'spot', spot );
mongoose.model( 'user', user );
mongoose.model( 'location', location );

mongoose.connect( 'mongodb://localhost/treinspot' );