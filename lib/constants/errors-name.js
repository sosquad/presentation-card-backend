const DB_ERRORS = {
  CastError: {
    message: 'Validation Error',
    errors: ['there was validation error']
  },
  MongoError: {
    message: 'DuplicateKeyError',
    errors: ['There was a duplicate key error']
  },
  ValidationError: {
    message: 'Validation Error',
    errors: []
  }
};

const ERROR_EXCEPTION_CODE = {
  MongoError: 11000
};

const DEFAULT_MESSAGE = 'Internal Server Error';

const VALIDATION_MESSAGE = 'Validation Error';

const DEFAULT_ERROR = {
  message: DEFAULT_MESSAGE,
  errors: []
};

const ErrorNameCte = {
  DB_ERRORS,
  ERROR_EXCEPTION_CODE,
  VALIDATION_MESSAGE,
  DEFAULT_ERROR
};

module.exports = ErrorNameCte;
