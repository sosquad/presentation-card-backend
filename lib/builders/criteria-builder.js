/* eslint-disable no-param-reassign */
const moment = require('moment');
const { escapeChars } = require('../regex-utils');
const { isString } = require('../utils/object-utils');

const DATE_FORMAT = 'YYYY-MM-DD';
const DATETIME_FORMAT = 'YYYY-MM-DD hh:mm';

const getFilterFields = value => {
  /*
        Exclude all params for paginations and other issues
    */
  const { select, sort, page, size, filter, ...others } = value;
  return others;
};

const getSearchValueInMultipleFields = (value, ...fields) => {
  const regex = new RegExp(value, 'i');
  const $or = fields.map(field => {
    const statement = {};
    statement[field] = regex;
    return statement;
  });
  return {
    $or
  };
};

const getFilterValueInFields = values => {
  let $and = [];
  if (values) {
    $and = Object.keys(values).map(field => {
      const statement = {};
      const value = values[field];

      if (isString(value)) {
        statement[field] = new RegExp(escapeChars(value), 'i');
      } else {
        statement[field] = value;
      }

      return statement;
    });
  }
  return {
    $and
  };
};

/**
 * Query builder for db operations
 */
const criteriaBuilder = {
  /**
   * Search value in multiple fields
   * @param {String} value - search value
   * @param {Array} fields - field names to search into
   */

  build(value, ...fields) {
    const filter = value.filter ? escapeChars(value.filter) : '';
    value.filter = filter;

    const searchValueInMultipleFields = getSearchValueInMultipleFields(value.filter, ...fields);
    const valueFields = getFilterFields(value);
    const filterValueInFields = getFilterValueInFields(valueFields);
    const query = {
      $and: []
    };
    if (filterValueInFields.$and.length > 0) {
      query.$and.push(filterValueInFields);
    }
    if (searchValueInMultipleFields.$or.length > 0) {
      query.$and.push(searchValueInMultipleFields);
    }

    return query;
  },

  buildDateRange(start, end) {
    let result = null;

    const startDate = moment.utc(start, DATE_FORMAT);
    const endDate = moment.utc(end, DATE_FORMAT);

    if (start && end) {
      result = {
        $gte: new Date(startDate.startOf('day').toISOString()),
        $lte: new Date(endDate.endOf('day').toISOString())
      };
    } else {
      if (start) {
        result = { $gte: startDate.toDate() };
      }

      if (end) {
        result = { $lte: endDate.toDate() };
      }
    }

    return result;
  },

  buildDate(date) {
    const start = moment.utc(date, DATE_FORMAT);
    return this.buildDateRange(start.format(DATE_FORMAT), start.format(DATE_FORMAT));
  },

  buildDatetime(datetime) {
    let result = null;

    const currentDate = moment.utc(datetime, DATETIME_FORMAT);

    result = {
      $gte: new Date(currentDate.startOf('minute').toISOString()),
      $lte: new Date(currentDate.endOf('minute').toISOString())
    };

    return result;
  }
};

module.exports = criteriaBuilder;
