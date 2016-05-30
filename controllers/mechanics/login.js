var express   = require('express'),
   	router    = express.Router(),
   	passport  = require('passport'),
   	mongoose  = require('mongoose'),
    User      = mongoose.model('User'),
   	mw 	      = require('../../mw'),
    log       = require('../../utils/logger')(module),
   	HtmlError = require('../../libs/HtmlError');


router.get('/', mw.user.isAnon,
                function(req, res, next) {
                	res.render('mechanics/login');
                });

router.post('/', mw.user.isAnon,
                function(req, res, next) {
                  passport.authenticate('local',
                    function(err, user, info) {
                      if (err) return next(err);
                      if (user) {
                        req.logIn(user, function(err) {
                          return err
                            ? next(err)
                            : res.redirect('/');
                        });
                      } else {
                          next(new HtmlError(400));
                      } 
                    }
                  )(req, res, next);
                });

module.exports = router;