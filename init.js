const logger = require('@23people/moonbase-mongo-logger');
const database = require('@23people/moonbase-mongoose-utils/database');

/**
 * configure all services and utilities that need
 * data from config/config.js
 * This execute at application initialization
 */
const startConfiguration = {
  onconfig: async (config, next) => {
    const databaseConfig = config.get('databaseConfig');
    await logger.addMongo(config.get('logger'));
    await database.config(databaseConfig);

    next(null, config);
  }
};

module.exports = startConfiguration;
