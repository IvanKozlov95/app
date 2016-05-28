var mongoose = require('../libs/mongoose'),
	ObjectId = mongoose.Types.ObjectId,
	log 	 = require('./logger');

module.exports = {
	castToObjectId: (id) => {
		var objectId;
		
		try {
			objectId = new ObjectId(id)
		} catch (e) {
			return objectId;
		}

		return objectId;
	}
}