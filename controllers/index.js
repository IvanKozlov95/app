module.exports = {
	request: require('./models/request'),
	archive: require('./models/archive'),
	company: require('./users/company'),
	client: require('./users/client'),
	about: require('./mechanics/about'),
	login: require('./mechanics/login'),
	logout: require('./mechanics/logout'),
	register: require('./mechanics/register')
}