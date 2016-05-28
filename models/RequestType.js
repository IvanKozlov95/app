var mongoose  = require('../libs/mongoose'),
    Schema    = mongoose.Schema,
    HtmlError = require('../libs/HtmlError'),
    log 	  = require('../utils/logger')(module),
    async 	  = require('async');

var RequestTypeSchema = new Schema({
	name: String,
	description: String,
	fields: []
}, { strict: false });

// RequestTypeSchema.statics.update = function (options) {
// 	return new Promise((resolve, reject) => {
// 		var _new;

// 		if (options.id) {
// 			_new = new Promise((resolve, reject) => {
// 				this
// 					.findById(id)
// 					.exec((err, item) => {
// 						if (err) reject(err);

// 						resolve(item);
// 					});
// 				});
// 		} else {
// 			_new = new Promise((resolve) => {
// 				resolve(new this());
// 			});
// 		}

// 		_new
// 			.then(item => {
// 				item.update(options, (err) =>{
// 					if (err) reject(err);

// 					resolve();
// 				})
// 			})
// 			.catch(reject);
// 	});		
// }

RequestTypeSchema.methods.addFields = function (fields, cb) {
	var View = mongoose.model('View');
	var self = this;

	async.each(fields, (field, cb) => {
		View
			.findOne({ name: field.type })
			.exec((err, view) => {
				if (err) return cb(err);

				if (view) {
					self.fields.push({
						type: view.id,
						name: field.name
					});
					cb(null);
				} else {
					cb(new HtmlError(400, 'Тип ' + field.type + ' не найден в базе.'));
				}
			})
	}, (err) => {
		if (err) return cb(err);

		self.save(cb);
	});
}

RequestTypeSchema.methods.getFields = function () {
	var View = mongoose.model('View');
	var res = [];
	var self = this;

	return new Promise((resolve, reject) => {
		async.each(self.fields, (field, cb) => {
			View
				.findOne({ text: field.type })
				.lean()
				.exec((err, view) => {
					if (err) return cb(err);

					if (view) {
						res.push(view);
						cb(null);
					} else {
						cb(new HtmlError(400, 'Тип ' + field.type + ' не найден в базе.'));
					}
				})
		}, (err) => {
			if (err) reject(err);

			resolve(res);
		});
	});
}

mongoose.model('RequestType', RequestTypeSchema);