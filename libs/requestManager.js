'use strict';

var mongoose   = require('mongoose'),
	commonUtil = require('../utils/common'),
	log 	   = require('../utils/logger')(module),
	statuses   = require('../utils/status');

class RequestManager {
	constructor() {
		this.date = commonUtil.setDateWithOutTime(new Date());
		this._checkExpiredRequests();
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
				.where('status', statuses.accepted)
				.sort('time')
				.populate('client company')
				.lean()
				.exec((err, requests) => {
					if (err) reject(err);

					for (var i in requests) {
						queue.push({
							request: requests[i]._id.toString(),
							time: requests[i].time,
							client: requests[i].client.email,
							company: requests[i].company.email
						})
					}

					log.info('Сформирована очередь из '+queue.length+' заявок на сегодня - ' + this.date);
					log.info('Ближайшая заявка на ' + (queue[0] == undefined ? '---' : queue[0].time));
					resolve(queue)
				});
			});
	}

	_sendNotifications() {
		var currentTime = new Date();
		currentTime = currentTime.getHours()+':'+currentTime.getMinutes();
		var i = 0;
		while (this.queue 
				&& this.queue.length > 0 
				&& currentTime >= this.queue[0].time) {
			this._archiveRequest({ 
				request: this.queue.shift().request, 
				status: statuses.done
			});
			i++;
		}
	
		log.info('Послал '+i+' уведомлений');			
	}

	run() {	
		this.timer = setInterval(this._sendNotifications.bind(this), 60000)
	}

	_archiveRequest(info) {
		var Request = mongoose.model('Request');
		var promise = Request.archive(info.request, info.status);
		promise
			.then(() => {
				Request
					.findById(info.request)
					.remove()
					.exec((err) => {
						if (err) throw err;

						log.info('Менджер заархивировал 1 заявку. id: ' + info.request + '. Статус: ' + info.status);
					});
			})
			.catch((err) => {
				throw err;
			})
		// todo: send mail
	}

	deleteRequest(options) {
		for (var i = 0; i < this.queue.length; i++) {
			if (this.queue[i].request == options.request) {
				this.queue.splice(i, 1);

				log.info('Менджер удалил 1 заявку из очереди. id: ' + options.request);
				return;
			}
		}
	}

	addRequest(id) {
		var Request = mongoose.model('Request');

		Request
				.findById(id)
				.where('date').equals(this.date.toString())
				.populate('client company')
				.lean()
				.exec((err, request) => {
					if (err) throw err;
					if (request) {
						var ind = findInsertionPoint(this.queue, request.time, myComparator);
						this.queue.splice(ind, 0, {
							request: request._id.toString(),
							time: request.time,
							client: request.client.email,
							company: request.company.email
						});
						log.info('Менеджер добавил новую завку в очередь. id: ' + id);
					} else {
						log.info('Новая заявка не на сегодня. id: ' + id);
					}
				});
	}

	_checkExpiredRequests() {
		var Request = mongoose.model('Request');
		var currentTime = new Date();
		currentTime = currentTime.getHours()+':'+currentTime.getMinutes();
		var currentDate = commonUtil.setDateWithOutTime(new Date());

		Request
			.find({})
			.where('date').lt(currentDate)
			.lean()
			.exec((err, requests) => {
				if (err) throw err;
				log.info('Менеджер нашел ' + requests.length + ' просроченных заявок');

				requests.forEach((el) => {
					this._archiveRequest({
						request: el._id.toString(), 
						status: el.status == statuses.new ? statuses.overdue : statuses.done
					});
				})
			})
	}
}

module.exports = RequestManager;

/**
 * Find insertion point for a value val, as specified by the comparator 
 * (a function)
 * @param sortedArr The sorted array
 * @param val The value for which to find an insertion point (index) in the array
 * @param comparator The comparator function to compare two values
 */
function findInsertionPoint(sortedArr, val, comparator) {   
   var low = 0, high = sortedArr.length;
   var mid = -1, c = 0;
   while(low < high)   {
      mid = parseInt((low + high)/2);
      c = comparator(sortedArr[mid], val);
      if(c < 0)   {
         low = mid + 1;
      }else if(c > 0) {
         high = mid;
      }else {
         return mid;
      }
   }
   return low;
}

function myComparator(el1, el2)  {
   return el1.time.localeCompare(el2.time);
}