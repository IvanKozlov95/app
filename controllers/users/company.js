var express   	  = require('express'),
	router 	      = express.Router(),
	mongoose  	  = require('../../libs/mongoose'),
	Company  	  = mongoose.model('Company'),
    HtmlError     = require('../../libs/HtmlError'),
	mw         	  = require('../../mw/'),
	log 	      = require('../../utils/logger')(module);

router.get('/', mw.user.isCompany, function(req, res, next) {
	Company
		.findById(req.user.id)
		.lean()
		.exec((err, company) => {
			if (err) return next(err);

			if (company) {
				res.render('company/index', { 
					company: company
				})
			} else {
				log.warn('Couldn\'t a company but it should be here. Id: ' + res.user.id);
				next(new HtmlError(404));
			}
		});
});

module.exports = router;
