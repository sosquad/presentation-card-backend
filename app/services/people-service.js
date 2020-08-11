const basicCrudService = require('@23people/moonbase-mongoose-utils/basic-crud-service');
const Model = require('../models/person');

const defaults = {
  populateFields: '',
  filterBy: ['name', 'rut'],
  defaultSort: 'rut'
};

const service = { ...basicCrudService, ...defaults, Model };

module.exports = service;
