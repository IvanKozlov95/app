var mongoose = require('mongoose');
var config = require('../config');
var log = require('../utils/logger')(module);

mongoose.connect(config.get('mongoose:uri'), (err) => {
	if (err) return log.error(err);

	log.info("Подключился к бд. Uri: " + config.get('mongoose:uri'));	
});

module.exports = mongoose;