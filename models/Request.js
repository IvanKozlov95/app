var mongoose = require('../libs/mongoose'),
    Schema   = mongoose.Schema;

var RequestSchema = new Schema({
	info: { type: Schema.Types.ObjectId, required: true, ref: 'RequestType' },
	// field: { type: Schema.Types.ObjectId, required: true, ref: 'Field' },
	client: { type: Schema.Types.ObjectId, required: true, ref: 'Client' },
	date: Date,
	modified: { type: Date, default: new Date() },
	status: { type: String, default: 'Новая' }
});

RequestSchema.statics.create = function(options, cb) {
	var _new = new this({
		client: options.client,
		date: options.date
	});

	_new
		.createInfoEntity(options.info)
		.then((infoId) => {
			_new.info = infoId
			_new.save(cb)
		})
		.catch(cb);
}

RequestSchema.methods.createInfoEntity = function(options) {
	var RequestType = mongoose.model('RequestType');

	return new Promise((resolve, reject) => {
		var _new = new RequestType();
		_new.save((err, info) => {
			if (err) return reject(err);

			resolve(info.id);
		});
	});
}

mongoose.model('Request', RequestSchema);