var mongoose = require('../libs/mongoose'),
	ObjectId = mongoose.Types.ObjectId,
	log 	 = require('./logger')(module);

module.exports = {
	castToObjectId: castToObjectId,
	setDateWithOutTime: setDateWithOutTime,
	isDateValid: isDateValid
}

function castToObjectId(id) {
	var objectId;
	
	try {
		objectId = new ObjectId(id)
	} catch (e) {
		return objectId;
	}

	return objectId;
}

function setDateWithOutTime(date) {
	var d = new Date(date);
	d.setHours(0, 0, 0, 0, 0);
	return d;
}

function isDateValid(date, time) {
	date = setDateWithOutTime(date);
	var now = new Date();
	var _date = setDateWithOutTime(now);
	var _time = now.getHours() + ':' + now.getMinutes();

	// log.info(date == _date)
	// log.info(time >= _time)
	// log.info(date.getTime());
	// log.info(_date);

	if (date > _date || ((date.getTime() == _date.getTime()) && time >= _time)) {
		return true;
	} 

	log.warn('отказ')
	return false;
}