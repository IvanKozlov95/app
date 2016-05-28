module.exports = {
	request: require('./models/request'),
	RequestType: require('./models/RequestType'),
	company: require('./users/company'),
	about: require('./mechanics/about'),
	login: require('./mechanics/login'),
	logout: require('./mechanics/logout'),
	register: require('./mechanics/register')
}