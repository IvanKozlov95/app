var mongoose  = require('../libs/mongoose'),
	HtmlError = require('../libs/HtmlError');

exports.isAuthentificated = function (req, res, next){
  req.isAuthenticated()
    ? next()
    : res.redirect('/login');
};

exports.isCompany = function(req, res, next) {
	(req.isAuthenticated() && req.user.__t == 'Company')
		? next()
		: res.redirect('/');
}

exports.isClient = function(req, res, next) {
	(req.isAuthenticated() && req.user.__t == 'Client')
		? next()
		: res.redirect('/');
}

exports.isAnon = function(req, res, next) {
	req.isAuthenticated()
		? res.redirect('/')
		: next();
}

exports.isClientOrAnon = function(req, res, next) {
	(req.isAuthenticated() && req.user.__t == 'Company')
		? res.redirect('/')
		: next();
}

exports.haveRights = (req, res, next) => {
	req.isAuthenticated()
		? (req.query.id == req.user.id)
			? next()
			: res.redirect('/')
		: res.redirect('/');
}


exports.ownRequest = (req, res, next) => {
	var Request = mongoose.model('Request');
	var id = req.query.id || req.body.request;

	Request
		.findById(id)
		.lean()
		.exec((err, request) => {
			if (err) return next(err);

			if (request) {
				return next();
			} else {
				return next(new HtmlError(404, 'Заявка не найдена'))
			}
		})
}