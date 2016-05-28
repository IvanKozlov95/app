var log = require('../utils/logger')(module);

require('./User');
require('./Client');
require('./Company');
require('./View');
require('./Request');
require('./RequestType');

log.info('Загрузка моделей завершена.');