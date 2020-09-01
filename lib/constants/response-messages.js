const status = require('./http-status');

const NOT_FOUND_MESSAGE = { status: status.NOTFOUND, message: 'Data not found' };

module.exports = {
  NOT_FOUND_MESSAGE
};
