'use strict';

var mongoose   = require('mongoose'),
	commonUtil = require('../utils/common'),
	log 	   = require('../utils/logger')(module);

class RequestManager {
	constructor() {
		this.date = commonUtil.setDateWithOutTime(new Date());
		this
			._formQueue()
			.then((queue) => {
				this.queue = queue;
			});
	}

	_formQueue() {
		var Request = mongoose.model('Request');
		var queue = [];

		return new Promise((resolve, reject) => {
			Request
				.find({})
				.where('date').equals(this.date.toString())
				.sort('time')
				.populate('client company')
				.lean()
				.exec((err, reuqests) => {
					if (err) reject(err);

					for (var i in reuqests) {
						queue.push({
							request: reuqests[i]._id,
							time: reuqests[i].time,
							client: reuqests[i].client.email,
							company: reuqests[i].company.email
						})
					}

					log.info('Сформирована очередь '+queue.length+' заявок на сегодня - ' + this.date);
					resolve(queue)
				});
			});
	}

	_sendNotifications() {
		var currentTime = new Date();
		currentTime = currentTime.getHours()+':'+currentTime.getMinutes();
		var i = 0;
		while (this.queue.length > 0 && currentTime >= this.queue[0].time) {
			this._archiveRequest(this.queue.shift());
			i++;
		}
	
		log.info('Послал '+i+' уведомлений');			

	}

	run() {	
		this.timer = setInterval(this._sendNotifications.bind(this), 60000)
	}

	_archiveRequest(info) {
		var Request = mongoose.model('Request');
		var promise = Request.archive(info.request, 'Выполнена');
		promise
			.then(() => {
				Request
					.findById(info.request)
					.remove()
					.exec((err) => {
						if (err) throw err;
					});
			})
			.catch((err) => {
				throw err;
			})
		// send mail
	}
}

module.exports = RequestManager;