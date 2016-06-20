var express    = require('express'),
	router 	   = express.Router(),
	mw 	   = require('../../mw'),
	mongoose   = require('../../libs/mongoose'),
	User       = mongoose.model('User'),
	log 	   = require('../../utils/logger')(module),
	storages   = require('../../utils/storages'),
	HtmlError  = require('../../libs/HtmlError'),
	storages  = require('../../utils/storages'),
 	multer	  = require('multer'),
 	upload	  = multer({ storage: storages.logoStorage });

router.post('/update', upload.single('avatar'), mw.user.isAuthentificated, function(req, res, next) {

	if (req.user.id != req.body.id) {
		return next(new HtmlError(403));
	}

	User.findById(req.body.id, (err, user) => {
		if (err) return next(err);

		if (user) {
			for (var i in req.body) {
				user[i] = req.body[i];
			}
			
			user.save((err) => {
				if (err && err.code) return next(new HtmlError(409, 'Name is already taken'));
				if (err) return next(err);

				log.info('User was updated');
				res.redirect('/');
			});
		} else {
			next(new HtmlError(404));
		}
	});
})

module.exports = router;