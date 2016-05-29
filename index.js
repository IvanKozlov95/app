var Server = require('./libs/server');
var RequestManager = require('./libs/requestManager');
var config = require('./config');

var server = new Server(config.get('port'));
global.requestManager = new RequestManager();

server.run();
global.requestManager.run();