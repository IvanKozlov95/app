var mongoose = require('../libs/mongoose'),
    Schema   = mongoose.Schema;

var ViewSchema = new Schema({
	tag: String,
	type: String,
	text: String,
	value: Number
});

mongoose.model('View', ViewSchema);