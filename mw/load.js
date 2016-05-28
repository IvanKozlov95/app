var mongoose  = require('mongoose');
var HtmlError = require('../libs/HtmlError');

module.exports = {
	requestById: loadRequestById
}

function loadRequestById(populate) {
	return function(req, res, next) {
		var Request = mongoose.model('Request');
		var id = req.query.id || req.body.id;

		Request
			.findById(id)
			.populate(populate)
			.exec((err, request) => {
				if (err) return next(err);

				if (request) {
					req.request = request;
					next();
				} else {
					next(new HtmlError(404));
				}
			});
	}
}