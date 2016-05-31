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
	var options = req.body;
	var Request = mongoose.model('Request');
	options.date = commonUtil.setDateWithOutTime(options.date);

	if (!commonUtil.isDateValid(options.date, options.time)) return next(new HtmlError(400, 'Назад в будущее??'));

	var _new = new Request(options);
	_new.save((err, request) => {
		if (err) return next(err);

		res.status(200).json('Заявка была созадана. Письмо отправлено.')
	});
})

router.get('/list', mw.user.haveRights, (req, res, next) => {
	var Request = mongoose.model('Request');
	var query = { $or: [ { 'client': req.query.id }, 
						 { 'company': req.query.id } ] };
	var isCompany = req.user.__t == 'Company' ? true : false;
	Request
		.find(query)
		.where('status').equals(statuses.new)
		.populate('client')
		.populate('company')
		.sort('date time')
		.lean()
		.exec((err, requests) => {
			if (err) return next(err);

			if (requests) {
				res.render('request/list', {
					requests: requests,
					isCompany: isCompany
				});
			} else {
				next(new HtmlError(404));
			}
		});
})

router.post('/submit',	mw.user.isAuthentificated,
						mw.user.ownRequest,
						mw.load.requestById(''),
						(req, res, next) => {
							var data = req.body.data;
							if (data && (req.request.date.getTime() != commonUtil.setDateWithOutTime(data.date).getTime()
								|| req.request.time != data.time)) {

								if (!commonUtil.isDateValid(data.date, data.time)) return next(new HtmlError(400,
									'Назад в будущее??'));

								req.request.date = data.date;
								req.request.time = data.time;
								req.request.status = statuses.pending;
								req.request.save((err) => {
									if (err) return next(err);

									return res.status(200).json('Ждем ответа от пользователя');
								})
							} else {
								req.request.status = statuses.accepted;
								req.request.save((err, request) => {
												if (err) return next(err);

												global.requestManager.addRequest(request.id);

												res.status(200).json('Заявка одобрена');
											});
							}	
})

router.post('/reject',	mw.user.isCompany,
						mw.load.requestById(''),
						(req, res, next) => {
							req.request.status = statuses.rejected;
							req.request.message2 = req.body.message2;
							req.request.save((err) => {
								if (err) return next(err);

								global.requestManager.deleteRequest({ 
									company: req.user.id,
									request: req.request._id.toString(),
									status: req.request.status
								});

								res.status(200).json('Заявка отвергнута.');
							})
})

router.post('/update',	mw.user.isAuthentificated,
						mw.load.requestById(''),
						(req, res, next) => {
							if (req.request.client != req.user.id) return next(new HtmlError(403));

							for (type in req.body.data) {
								req.request[type] = req.body.data[type];
							}

							if (!commonUtil.isDateValid(req.request.date, req.request.time)) return next(new HtmlError(400, 'Назад в будущее??'));
							req.request.save((err, request) => {
								if (err) return next(err);

								res.status(200).json('Заявка успешно изменена.');
							});
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
								requests: req.requests,
								date: req.query.date
							});
						}
					})

router.post('/delete',	mw.user.isAuthentificated,
						mw.load.requestById(''),
						(req, res, next) => {
							var Request = mongoose.model('Request');

							if (req.request.client != req.user.id) return next(new HtmlError(403));

							Request
								.archive(req.request.id, 'Удалена')
								.then(() => {
									Request
										.findById(req.request.id)
										.remove()
										.exec((err) => {
											if (err) return next(err);

											res.status(200).json('Заявка была удалена.');
										});
									global.requestManager.deleteRequest({ request: req.request.id });
								})
								.catch(next);
						})

module.exports = router;