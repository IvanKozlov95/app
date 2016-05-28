var express     = require('express'),
	router 	    = express.Router(),
	mongoose    = require('../../libs/mongoose'),
	HtmlError	= require('../../libs/HtmlError'),
	commonUtil	= require('../../utils/common'),
	log 	    = require('../../utils/logger')(module);

router.get('/edit', (req, res, next) => {
	var id = commonUtil.castToObjectId(req.query.id);
	var	Request = mongoose.model('Request');
	var RequestType = mongoose.model('RequestType');
	var Field = mongoose.model('Field');

	if ( !id ) return next(new HtmlError(404));

	Request
		.findById(id)
		.populate('info')
		.populate('client')
		.lean()
		.exec((err, request) => {
			if (err) return next(err);

			res.render('request/edit', {
				request: request
			});
		});
})

router.get('/', (req, res, next) => {
	var id = commonUtil.castToObjectId(req.query.id);
	var	Request = mongoose.model('Request');
	var RequestType = mongoose.model('RequestType');
	var Field = mongoose.model('Field');

	if ( !id ) return next(new HtmlError(404));

	Request
		.findById(id)
		.populate('info')
		.populate('client')
		.lean()
		.exec((err, request) => {
			if (err) return next(err);
			log.info(request.client)

			res.render('request/index', {
				request: request
			});
		});
})

router.get('/create', (req, res, next) => {
	var RequestType = mongoose.model('RequestType');

	RequestType
		.find()
		// .populate('fields view')
		.exec((err, infos) => {
			if (err) return next(err);
			
			res.render('request/create', {
				infos: infos
			});
		})
})

module.exports = router;