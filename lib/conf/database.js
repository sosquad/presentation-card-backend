const mongoose = require('mongoose');
const logger = require('../logger');

const defaultConnection = 'mongodb://localhost:27017/control-visita';

const dbInstance = {
  config: ({ connectionUrl }) => {
    mongoose.connect(connectionUrl || defaultConnection, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const db = mongoose.connection;
    db.on('error', err => {
      logger.error(`connection error: ${err}`);
    });
    db.once('open', () => {
      logger.info('MongoDb', !connectionUrl ? defaultConnection : connectionUrl);
    });
  }
};

module.exports = dbInstance;
