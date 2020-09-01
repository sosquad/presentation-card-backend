const winston = require('winston');
const database = require('./conf/database');
const appConfig = require('./conf/config');
const logger = require('./logger');

require('winston-mongodb');

const spec = {
  onconfig: async (config, next) => {
    try {
      const databaseConfig = config.get('databaseConfig');
      const dbConfig = databaseConfig;
      const options = {
        db: dbConfig.connectionUrl,
        collection: 'logs',
        decolorize: false
      };

      logger.add(new winston.transports.MongoDB(options));
      appConfig.config(config);
      database.config(databaseConfig);

      next(null, config);
    } catch (err) {
      logger.error(`onconfig - ${err}`);
      throw new Error(err);
    }
  }
};

module.exports = spec;
