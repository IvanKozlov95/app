var express     = require('express'),
	router 	    = express.Router(),
	mongoose    = require('../../libs/mongoose'),
	HtmlError	= require('../../libs/HtmlError'),
	mw			= require('../../mw/')
	commonUtil	= require('../../utils/common'),
	log 	    = require('../../utils/logger')(module),
	statuses   	= require('../../utils/status');

router.get('/bydate',	mw.user.isCompany,
						mw.load.archiveByQueryForUser,
						(req, res, next) => {
							if (req.xhr) {
								res.json(req.archives);
							} else {
								res.render('archive/bydate', {
									archives: req.archives,
									date: req.query.date
								});
							}
						})

module.exports = router;