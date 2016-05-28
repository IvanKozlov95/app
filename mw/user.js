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