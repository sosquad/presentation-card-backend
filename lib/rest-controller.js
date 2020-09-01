/* eslint-disable no-underscore-dangle */
const JSON = require('circular-json');
const status = require('./constants/http-status');
const errorBuilder = require('./builders/error-builder');
const logger = require('./logger');
const { safeObject } = require('./utils/object-utils');

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

/**
 * Controller for common operations for CRUD controllers
 */
const restController = {
  async findAll(req, res, fn, sort) {
    try {
      const results = await fn.findAll(req.query, sort);
      res.json({ results });
    } catch (error) {
      logger.error(`Find all error: ${JSON.stringify(error)}`, req.details);
      const [statusError, contentError] = errorBuilder.build(error);
      res.status(statusError).json(contentError);
    }
  },

  async findPaginated(req, res, fn, criteria) {
    try {
      const options = {
        select: req.query.select,
        sort: req.query.sort,
        page: parseInt(req.query.page, 10) || DEFAULT_PAGE,
        size: parseInt(req.query.size, 10) || DEFAULT_PAGE_SIZE,
        populate: fn.populateFields(),
        lean: true
      };

      const results = await fn.findPage({ ...criteria, enabled: true }, options);
      res.json(results);
    } catch (error) {
      logger.error(`Find paginated error: ${JSON.stringify(error)}`, req.details);
      const [statusError, contentError] = errorBuilder.build(error);
      res.status(statusError).json(contentError);
    }
  },

  async findById(req, res, fn) {
    try {
      const result = await fn.findById(req.params.id);
      if (!result) {
        return res.status(status.NOTFOUND).end();
      }
      return res.json(result);
    } catch (error) {
      logger.error(`Find by id error: ${JSON.stringify(error)}`, req.details);
      const [statusError, contentError] = errorBuilder.build(error);
      return res.status(statusError).json(contentError);
    }
  },

  async create(req, res, fn) {
    try {
      const result = await fn.create(req.body);
      const location = req.baseUrl + result.id;
      logger.info(`Created ${JSON.stringify(safeObject(req.body))}`, req.details);
      res.status(status.CREATED).location(location).json(result);
    } catch (error) {
      logger.error(`Create error: ${JSON.stringify(error)}`, req.details);
      const [statusError, contentError] = errorBuilder.build(error);
      res.status(statusError).json(contentError);
    }
  },

  async createUpdate(req, res, fn) {
    try {
      const result = await fn.createUpdate({ ...req.body, enabled: true });
      const location = req.baseUrl + result.id;
      logger.info(`Created ${JSON.stringify(safeObject(req.body))}`, req.details);
      res.status(status.CREATED).location(location).json(result);
    } catch (error) {
      logger.error(`Create update error: ${error}`, req.details);
      const [statusError, contentError] = errorBuilder.build(error);
      res.status(statusError).json(contentError);
    }
  },

  async bulk(req, res, fn) {
    try {
      const result = await fn.bulk(req.body);
      logger.info('Bulk creation', req.details);
      res.status(status.CREATED).json(result);
    } catch (error) {
      logger.error(`Bulk insertion error: ${JSON.stringify(error)}`, req.details);
      const [statusError, contentError] = errorBuilder.build(error);
      res.status(statusError).json(contentError);
    }
  },

  async update(req, res, fn, criteria) {
    try {
      if (criteria) {
        const old = await fn.findOneBy(criteria);

        if (old && old.id) {
          await fn.destroy(old.id);
        }
      }

      const result = await fn.update(req.params.id, req.body);
      if (!result) {
        logger.error('Update error. Not found', req.details);
        return res.status(status.NOTFOUND).end();
      }

      logger.info(
        `Updated id: ${req.params.id} with ${JSON.stringify(safeObject(req.body))}`,
        req.details
      );
      return res.status(status.UPDATED).json(result);
    } catch (error) {
      logger.error(`Update error: ${JSON.stringify(error)}`, req.details);
      const [statusError, contentError] = errorBuilder.build(error);
      return res.status(statusError).json(contentError);
    }
  },

  async delete(req, res, fn) {
    try {
      const result = await fn.delete(req.params.id);
      if (!result) {
        logger.error('Delete error: Not Found', req.details);
        return res.status(status.NOTFOUND).end();
      }
      logger.info(`Deleted with id: ${req.params.id}`, req.details);

      return res.status(status.DELETED).end();
    } catch (error) {
      logger.error(`Delete error: ${JSON.stringify(error)}`, req.details);
      const [statusError, contentError] = errorBuilder.build(error);
      return res.status(statusError).json(contentError);
    }
  },

  async destroyAll(req, res, fn) {
    try {
      const result = await fn.destroyAll();
      logger.info('Destroy all from collection', req.details);
      res.status(result ? status.DELETED : status.NOTFOUND).end();
    } catch (error) {
      logger.error(`Destroy error: ${JSON.stringify(error)}`, req.details);
      const [statusError, contentError] = errorBuilder.build(error);
      res.status(statusError).json(contentError);
    }
  },

  async undo(req, res, fn) {
    try {
      const result = await fn.activate(req.params.id);

      if (!result) {
        return res.status(status.NOTFOUND).end();
      }
      logger.info(`Undo delete id ${req.params.id}`, req.details);
      return res.status(status.UPDATED).json(result);
    } catch (error) {
      logger.error(`Undo error: ${JSON.stringify(error)}`, req.details);
      const [statusError, contentError] = errorBuilder.build(error);
      return res.status(statusError).json(contentError);
    }
  }
};

module.exports = restController;
