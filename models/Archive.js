var mongoose = require('../libs/mongoose'),
    Schema   = mongoose.Schema;

var ArchiveSchema = new Schema({
	client: { type: Schema.Types.ObjectId, ref: 'Client' },
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	date: Date,
	time: String,
	persons: Number,
	status: String
});


mongoose.model('Archive', ArchiveSchema);