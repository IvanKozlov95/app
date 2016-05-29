var express     = require('express'),
	router 	    = express.Router(),
	mongoose    = require('../../libs/mongoose'),
	HtmlError	= require('../../libs/HtmlError'),
	mw			= require('../../mw/')
	commonUtil	= require('../../utils/common'),
	log 	    = require('../../utils/logger')(module),
	statuses   	= require('../../utils/status');

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

router.post('/create', (req, res, next) => {
	var Request = mongoose.model('Request');
	req.body.date = commonUtil.setDateWithOutTime(req.body.date);
	var _new = new Request(req.body);
	_new.save((err) => {
		if (err) return next(err);

		res.status(200).json('Заявка была созадана. Письмо отправлено.')
	});
})

router.get('/list', mw.user.haveRights, (req, res, next) => {
	var Request = mongoose.model('Request');
	var query = { $or: [ { 'client': req.query.id }, 
						 { 'company': req.query.id } ] };

	Request
		.find(query)
		.where('status').equals('Новая')
		.populate('client')
		.populate('company')
		.lean()
		.exec((err, requests) => {
			if (err) return next(err);

			if (requests) {
				res.render('request/list', {
					requests: requests,
				});
			} else {
				next(new HtmlError(404));
			}
		});
})

router.post('/submit',	mw.user.isCompany,
						mw.load.requestById(''),
						(req, res, next) => {
							req.request.status = 'Одобрена';
							req.request.save((err) => {
												if (err) return next(err);

												res.status(200).json('Заявка одобрена');
											});
})

router.post('/reject',	mw.user.isCompany,
						mw.load.requestById(''),
						(req, res, next) => {
							req.request.status = 'Отвержена';
							req.request.save((err) => {
								if (err) return next(err);

								res.status(200).json('Заявка отвергнута.');
							})
})

router.get('/info',	mw.user.isAuthentificated,
					mw.load.requestById('client company'),
					(req, res, next) => {
						res.render('request/info', {
							request: req.request
						});
					})

router.get('/bydate', mw.load.requestsByQuery,
					(req, res, next) => {
						if (req.xhr) {
							res.json(req.requests);
						} else {
							res.render('request/bydate', {
								requests: req.requests
							});
						}
					})

module.exports = router;