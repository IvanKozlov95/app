var Server = require('./libs/server');
var RequestManager = require('./libs/requestManager');
var config = require('./config');

var server = new Server(config.get('port'));
var requestManager = new RequestManager();

server.run();
requestManager.run();