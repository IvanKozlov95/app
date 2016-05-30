var express   	  = require('express'),
	router 	      = express.Router(),
	mongoose  	  = require('../../libs/mongoose'),
	Company  	  = mongoose.model('Company'),
    HtmlError     = require('../../libs/HtmlError'),
	mw         	  = require('../../mw/'),
	log 	      = require('../../utils/logger')(module);

router.get('/profile', mw.user.isCompany, function(req, res, next) {
	Company
		.findById(req.user.id)
		.exec((err, company) => {
			if (err) return next(err);

			if (company) {
				res.render('company/index', { 
					company: company.toJSON()
				})
			} else {
				log.warn('Couldn\'t a company but it should be here. Id: ' + res.user.id);
				next(new HtmlError(404));
			}
		});
})

router.get('/search', (req, res, next) => {
	var name = req.query.name;

	if (name) {
		var	Company = mongoose.model('Company');
		var regex = new RegExp(name, 'i');
		Company
			.find({ 'name': { $regex: regex } })
			.lean()
			.select('name avatar description')
			.exec(function(err, companies) {
				if (err) return next(err);

				res.json(companies);
			});
	} else {
		res.render('company/search');
	}
})

router.get('/', (req, res, next) => {
	var id = req.query.id;
	var Company = mongoose.model('Company');

	Company
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
