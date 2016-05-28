var mongoose = require('../libs/mongoose'),
	View 	 = mongoose.model('View');

module.exports = (req, res, next) => {

	View.find()
		.lean()
		.exec((err, views) => {
			if (err) return next(err);

			res.locals.views = views;
			next();
		})
}