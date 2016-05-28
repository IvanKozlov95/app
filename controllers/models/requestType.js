var express     = require('express'),
	router 	    = express.Router(),
	mongoose    = require('../../libs/mongoose'),
	mw    		= require('../../mw'),
	HtmlError	= require('../../libs/HtmlError'),
	commonUtil	= require('../../utils/common'),
	log 	    = require('../../utils/logger')(module);


router.get('/list', mw.user.isCompany, (req, res, next) => {
	var RequestType = mongoose.model('RequestType');

	RequestType
		.find()
		.lean()
		.exec((err, items) => {
			if (err) return next(err);

			if (items) {
				res.render('RequestType/list', {
					items: items
				})
			} else {
				return next(new HtmlError(404));
			}
		})
})

router.get('/new', mw.loadViews, (req, res, next) => {
	res.render('RequestType/new');
})

router.get('/edit', mw.loadViews, (req, res, next) => {
	var id = commonUtil.castToObjectId(req.query.id);
	var RequestType = mongoose.model('RequestType');

	RequestType
		.findById(id)
		// .lean()
		.exec((err, type) => {
			if (err) return next(err);
			log.info(type.fields[0]);
			type
				.getFields()
				.then((views) => {
					res.render('requesttype/edit', {
						requestType: type,
						// views: views
					});
				})
				.catch(next);
		});
})

router.post('/save', mw.loadRequestType, (req, res, next) => {
	var RequestType = mongoose.model('RequestType');

	if (req.requestType) {
		requestType.update(req.body, (err) => {
			if (err) return next(err);

			return res.status(200).end('Запись в бд');
		})
	} else {
		var _new = new RequestType(req.body);
		_new.save((err) => {
			if (err) return next(err);

			return res.status(200).end('Запись в бд');
		});
	}
})

router.get('/info', (req, res, next) => {
	var id = commonUtil.castToObjectId(req.query.id);
	var RequestType = mongoose.model('RequestType');

	RequestType
		.findById(id)
		// .lean()
		.exec((err, info) => {
			if (err) return next(err);

			info
				.getFields()
				.then((views) => {
					res.json({
						RequestType: info,
						views: views
					}).end();
				})
				.catch(next);
		});
})

module.exports = router;