const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

module.exports = function mongo(settings) {
  // eslint-disable-next-line no-param-reassign
  settings.store = new MongoStore({
    mongooseConnection: mongoose.connection
  });
  return session(settings);
};
