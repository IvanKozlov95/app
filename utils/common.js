var mongoose = require('../libs/mongoose'),
	ObjectId = mongoose.Types.ObjectId,
	log 	 = require('./logger');

module.exports = {
	castToObjectId: castToObjectId,
	setDateWithOutTime: setDateWithOutTime
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