var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var mongoose       = require('./mongoose');
var User           = mongoose.model('User');
var log            = require('../utils/logger')(module);

module.exports = passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
  }, function(login, password, done){
    log.info("Authentification request. Login: " + login + ', pass: ' + password);
    User.findOne({ login : login},function(err, user){
      if (err) return done(err);

      if (user && user.checkPassword(password)) {
        done(null, user);
      } else {
        log.warn('Authentification request failed.');
        done(null, false, { message: 'Cannot find user like that.'})
      };
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    err 
      ? done(err)
      : done(null, user);
  });
});