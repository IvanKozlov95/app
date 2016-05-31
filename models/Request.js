var mongoose = require('../libs/mongoose'),
    Schema   = mongoose.Schema;

var RequestSchema = new Schema({
	client: { type: Schema.Types.ObjectId, ref: 'Client' },
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	date: Date,
	message: String,
	message2: String,
	time: String,
	persons: Number,
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

RequestSchema.statics.archive = function(id, status) {
	var Archive = mongoose.model('Archive');

	return new Promise((resolve, reject) => {
		this
			.findById(id)
			.lean()
			.exec((err, request) => {
				if (err) reject(err);

				if (status) request.status = status;
				
				var _new = new Archive(request);
				_new.save((err) => {
					if (err) reject(err);

					resolve();
				})
			})
	});
}
 
mongoose.model('Request', RequestSchema);