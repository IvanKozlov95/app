var mongoose   = require('mongoose');
var HtmlError   = require('../libs/HtmlError');
var commonUtils = require('../utils/common');
var statuses   	= require('../utils/status');

module.exports = {
	aggregateByField: aggregateByField,
	getActiveClients: getActiveClients
}

function aggregateByField(field) {
	return function (req, res, next) {
		var Archive = mongoose.model('Archive');
		var query = Archive.find({});

		query.where('company', req.user.id);
		if (field == 'time')
			query.where('status', statuses.done);
		query
			.lean()
			.exec((err, archives) => {
				if (err) return next(err);

				switch(field) {
					case 'dayOfWeek':
						req.results = aggregateByDaysOfWeek(archives);
						break;
					case 'status':
						req.results = aggregateByStatus(archives);
						break;
					case 'time':
						req.results = aggregateByTime(archives);
						break;
				}
				next();
			});
	}
}

function aggregateByDaysOfWeek(requests) {
	var result = [0,0,0,0,0,0,0];
	requests.forEach((el) => {
		result[el.date.getDay()]++;
	});
	return result;
}

function aggregateByStatus(requests) {
	var result = {};
	requests.forEach((el) => {
		if (result.hasOwnProperty(el.status)) {
			result[el.status]++;
		} else {
			result[el.status] = 1;
		}
	});
	return result;
}

function aggregateByTime(requests) {
	var result = {};
	requests.forEach((el) => {
		var ours = el.time.substring(0,2);
		if (result.hasOwnProperty(ours)) {
			result[ours]++;
		} else {
			result[ours] = 1;
		}
	});
	return result;
}

function aggregateByClient(requests) {
	var result = {};
	requests.forEach((el) => {
		if (result.hasOwnProperty(el.client._id)) {
			result[el.client._id].count++;
		} else {
			result[el.client._id] = {
				id: el.client._id,
				name: el.client.name,
				count: 1
			};
		}
	});
	return result;
}

function getActiveClients(count) {
	return function(req, res, next) {
		var Archive = mongoose.model('Archive');
		var query = Archive.find({});

		query.where('company', req.user.id);
		query.sort('client');
		query.populate('client');
		query.exec((err, archives) => {
			if (err) return next(err);
			req.results = aggregateByClient(archives);
			next();
		})
	}
}