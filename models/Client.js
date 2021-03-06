var mongoose 	 = require('../libs/mongoose'),
    Schema   	 = mongoose.Schema,
    User     	 = mongoose.model('User'),
    async 	 	 = require('async'),
    crypto     = require('crypto'),
    commonUtil = require('../utils/common'),
    HtmlError  = require('../libs/HtmlError'),
    log        = require('../utils/logger')(module);

var ClientSchema = new Schema({
});

ClientSchema.methods.toJSON = function () {
	return {
		id: this._id,
		email: this.email,
		avatar: this.avatar
	}
}

User.discriminator('Client', ClientSchema);