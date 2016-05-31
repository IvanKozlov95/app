var express   	  = require('express'),
	router 	      = express.Router(),
	mongoose  	  = require('../../libs/mongoose'),
	HtmlError     = require('../../libs/HtmlError'),
	logger     	  = require('../../utils/logger'),
	mw         	  = require('../../mw/');

router.get('/profile',	mw.user.isClient,
						(req, res, next) => {
							var Client = mongoose.model('Client');
							var Request = mongoose.model('Request');

							Request
								.find({})
								.where('client').equals(req.user.id)
								.sort('date time')
								.populate('company')
								.lean()
								.exec((err, requests) => {
									if (err) return next(err);
									log.info(requests);
									res.render('client/profile', {
										client: req.user.toJSON(),
										requests: requests
									})
								})
						})

router.get('/', (req, res, next) => {
	var id = req.query.id;
	var Client = mongoose.model('Client');

	Client
		.findById(id)
		.select('-hashedPassword -salt -login -_id -__t -__v')
		.lean()
		.exec((err, company) => {
			if (err) return next(err);

			if (company) {
				res.render('company/info', {
					company: company
				});
			} else {
				next(new HtmlError(404));
			}
		})
})

module.exports = router;