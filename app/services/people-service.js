const basicCrudService = require('../../lib/basic-crud-service');
const Model = require('../models/person');

const defaults = {
  populateFields: '',
  filterBy: ['name', 'rut'],
  defaultSort: 'rut'
};

const service = { ...basicCrudService, ...defaults, Model };

module.exports = service;
