var mongoose   = require('mongoose');
var HtmlError   = require('../libs/HtmlError');
var commonUtils = require('../utils/common');
var statuses   	= require('../utils/status');

module.exports = {
	requestById: loadRequestById,
	requestsByQuery: loadRequestsByQuery,
	archiveByQueryForUser: loadArchiveByQueryForUser
}

function loadRequestById(populate) {
	return function(req, res, next) {
		var Request = mongoose.model('Request');
		var id = req.query.id || req.body.request;
		
		Request
			.findById(id)
			.populate(populate)
			.exec((err, request) => {
				if (err) return next(err);

				if (request) {
					req.request = request;
					next();
				} else {
					next(new HtmlError(404, 'Заявка не найдена'));
				}
			});
	}
}

function loadRequestsByQuery(req, res, next) {
	var Request = mongoose.model('Request');
	var query = Request.find({});

	if (req.query && req.query.date) {
		req.query.date = commonUtils.setDateWithOutTime(req.query.date)
	}

	for (condition in req.query) {
		query.where(condition, req.query[condition]);
	}

	query.where('status', statuses.accepted);

	query
		.lean()
		.populate('client company')
		.exec((err, requests) => {
			if (err) return next(err);

			if (requests) {
				req.requests = requests;
				next();
			} else {
				next(new HtmlError(404));
			}
		})
}

function loadArchiveByQueryForUser(req, res, next) {
	var Request = mongoose.model('Archive');
	var query = Request.find({});

	if (req.query && req.query.date) {
		req.query.date = commonUtils.setDateWithOutTime(req.query.date)
	}

	for (condition in req.query) {
		query.where(condition, req.query[condition]);
	}

	query.where('company', req.user.id);

	query
		.lean()
		.populate('client')
		.exec((err, archives) => {
			if (err) return next(err);

			if (archives) {
				req.archives = archives;
				next();
			} else {
				next(new HtmlError(404));
			}
		})
}