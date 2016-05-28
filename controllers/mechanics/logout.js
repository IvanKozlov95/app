var express = require('express'),
    router  = express.Router();

router.get('/', function(req, res, next) {
	req.logout();
    res.locals.user = null;
	res.redirect('/');
});

module.exports = router;