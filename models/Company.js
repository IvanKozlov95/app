var mongoose = require('../libs/mongoose'),
    Schema   = mongoose.Schema,
    User     = mongoose.model('User'),
    log 	 = require('../utils/logger')(module),
    async 	 = require('async');

var CompanySchema = new Schema({
  address: String,
  description: String,
});

CompanySchema.methods.toJSON = function() {
  return {
    _id: this.id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    address: this.address,
    _avatar: this.avatar, 
    _description: this.description
  }
}

User.discriminator('Company', CompanySchema);