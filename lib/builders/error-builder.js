const status = require('../constants/http-status');
const { DB_ERRORS, VALIDATION_MESSAGE, DEFAULT_ERROR } = require('../constants/errors-name');

const DUPLICATED_ERROR_CODE = 11000;

const isDBError = err => DB_ERRORS[err.name];

const isMongoError = err => err.name === 'MongoError';

const isDuplicatedError = err => err.name === 'MongoError' && err.code === DUPLICATED_ERROR_CODE;

const isCastError = err => err.name === 'CastError';

const isRequired = err => err.kind === 'required';

const isValidationError = err => err.name === 'ValidationError';

const isAddressNormalizationError = err => err.name === 'AddressNormalizationError';

const getMessage = err => {
  if (isCastError(err)) {
    return `${err.path} is not valid`;
  }
  if (isRequired(err)) {
    return `${err.path} is required`;
  }
  return err.message;
};

const getValidationErrorList = err => Object.values(err.errors).map(value => getMessage(value));

const errorBody = err => {
  if (err.errors && err.errors.length > 1) {
    const { message, errors } = err;
    return {
      message,
      errors
    };
  }
  if (isAddressNormalizationError(err)) {
    return {
      message: VALIDATION_MESSAGE,
      errors: err.errors
    };
  }

  if (!isDBError(err)) {
    return DEFAULT_ERROR;
  }

  if (isDuplicatedError(err)) {
    return {
      message: 'DuplicateKeyError',
      errors: [err.errmsg]
    };
  }
  if (isCastError(err)) {
    const errors = DB_ERRORS[err.name];
    return errors;
  }

  if (isValidationError(err)) {
    return {
      message: VALIDATION_MESSAGE,
      errors: getValidationErrorList(err)
    };
  }

  if (err.message && err.errors) {
    return err;
  }

  return {
    message: DEFAULT_ERROR,
    errors: JSON.stringify(err)
  };
};

const statusCode = err => {
  if (
    isDuplicatedError(err) ||
    (isDBError(err) && !isMongoError(err)) ||
    isAddressNormalizationError(err)
  ) {
    return status.BAD_REQUEST;
  }
  return status.INTERNAL_SERVER_ERROR;
};

/**
 * Error builder for http responses
 */
const errorBuilder = {
  /**
   * Making error response
   * @param {Object} err - error object
   */
  build(err) {
    return [statusCode(err), errorBody(err)];
  }
};

module.exports = errorBuilder;
