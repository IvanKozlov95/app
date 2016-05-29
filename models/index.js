var log = require('../utils/logger')(module);

require('./User');
require('./Client');
require('./Company');
require('./Request');
require('./Archive');

log.info('Загрузка моделей завершена.');