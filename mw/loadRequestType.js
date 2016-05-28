var mongoose    = require('../libs/mongoose'),
	RequestType = mongoose.model('RequestType');

module.exports = (req, res, next) => {
	var id = req.body.id;

	if (id) {
		RequestType
			.findbyId(id)
			.exec((err, requestType) => {
				if (err) return next(err);

				req.requestType = requestType;
				next(); 
			})
	} else {
		next();
	}
}