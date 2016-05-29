'use strict';

var express 	 = require('express');
var app 		 = express();
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session 	 = require('express-session');
var passport 	 = require('passport');
var log 		 = require('../utils/logger')(module);
var HtmlError	 = require('./HtmlError');
var mongoose  	 = require('./mongoose');

const MongoStore = require('connect-mongo')(session);

class Server {
	constructor(port) {
		this.port = port;
		require('../models');
	}

	_initializeExpress() {
		app.set('view engine', 'jade');
		app.set('views', __dirname + '/../views');
		app.locals.pretty = true;

		app.use(express.static(__dirname + '/../public'));
		app.use(express.static(__dirname + '/../bower_components'));
		app.use(bodyParser.urlencoded({extended: true}));
		app.use(cookieParser()); 
		app.use(session({ 
			secret: "SECRET",
			resave: false,
			saveUninitialized: false,
			store: new MongoStore({mongooseConnection: mongoose.connection})
		}));

		app.use(passport.initialize());
		app.use(passport.session());
		require('./passport');

		app.use(this._RequestTypeMiddleware);

		/*
		* Loading user to res.locals down here
		*/
		app.use(require('../mw/loadUser'));

        this._setRoutes();

		app.use(this._homeMiddleware);
		app.use(this._notFoundMiddleware);
		app.use(this._errorHandlerMiddleware);
	}

	run() {
		this._initializeExpress();
		app.listen(this.port);
		log.info("Сервер запущен на порте: " + this.port);
	}

	_notFoundMiddleware(req, res, next) {
		log.info('Unknown request url ' + req.url);

		next(new HtmlError(404));
	}

	_errorHandlerMiddleware(err, req, res, next) {
		var isAjaxRequest = req.xhr;

		if (err instanceof HtmlError) {
			if (err.code != 404) log.warn(err);

			res.status(err.code);

			if (isAjaxRequest) {
				return res.json(err.message).end();
			} else {
				return res.render('mechanics/error', {
						error: err
				});
			}
		}

		log.error(err);
		res.status(500).send("Ой, что-то отвалилось.");
	}

	_homeMiddleware(req, res, next) {
		req.url == '/'
				? res.render('mechanics/index')
				: next();
	}

	_RequestTypeMiddleware(req, res, next) {
		log.info(req.method + ' ' + req.url);
		if (req.method === 'POST') {
			log.info('Request params: ' + JSON.stringify(req.body));
		}
		next();
	}

    _setRoutes() {
        var Controllers = require('../controllers');
        var models      = require('../models');

        app.use('/request', Controllers.request);
        app.use('/company', Controllers.company);
        app.use('/client', Controllers.client);
        app.use('/login', Controllers.login);
        app.use('/register', Controllers.register);
        app.use('/logout', Controllers.logout);
    }
}

module.exports = Server;