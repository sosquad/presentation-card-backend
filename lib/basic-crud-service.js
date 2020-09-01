/* eslint-disable no-magic-numbers */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const collation = 'es';

/**
 * Implements basic functionality for CRUD services with MongoDB
 * returns json data, an array of mongoose models or a mongoose model basen on lean property
 * Common models must include _enabled field. If not, please set filterByEnabled to false in order to use this library.
 */
const basicCrudService = {
  // defaults
  populateFields: '',
  filterBy: [],
  defaultSort: '',

  /**
   * Get model primary fields
   */
  getPrimaryKeysFields() {
    const results = [];
    Object.entries(this.Model.prototype.schema.tree).forEach(entry => {
      const [key, value] = entry;
      if (value.primary) {
        results.push(key);
      }
    });

    return results;
  },

  /**
   * Find all records matching criteria
   * @param {Object} criteria Mongo query object
   * @param {String} sort sort space limited string with sort fields -property1 property2
   */
  async findBy(
    criteria,
    select = '',
    sort = '',
    populate = '',
    lean = true,
    filterByEnabled = true
  ) {
    try {
      if (filterByEnabled) {
        criteria._enabled = true;
      }
      const q = this.Model.find(criteria)
        .collation({ locale: collation })
        .populate(populate)
        .select(select)
        .sort(sort);

      if (lean) {
        q.lean();
      }
      const result = await q.exec();
      return result;
    } catch (e) {
      throw new Error(e.message, e);
    }
  },

  /**
   * Find all records for a given mongo query
   * @param {String} sort sort space limited string with sort fields -property1 property2
   * @param {Boolean} lean
   */
  async findAll(select = '', sort = '', populate = '', lean = true, filterByEnabled = true) {
    return this.findBy({}, select, sort, populate, lean, filterByEnabled);
  },

  /**
   * Find Page with a list of objects that match criteria
   * @param {Object} criteria - Query where clause.
   * @param {Object} options - Pagination, populate, select fields options.
   * @param {Number} [options.page = 1] - Page requested. Starts on 1.
   * @param {Number} [options.size = 10] - Size of page.
   * @param {String} [options.sort = ''] - Sort value. Ex: -name,lastName.
   * @param {String} [options.select = ''] - Sort value. Ex: -name,lastName.
   * @param {String} [options.populate = ''] - Sort value. Ex: -name,lastName.
   * @param {Boolean} [options.lean = true] - Returns plain object when true
   * @param {Boolean} [options.filterByEnabled = true] - Includes enabled field in search
   * @returns {Promise} model list
   */
  async findPage(
    criteria,
    {
      page = 1,
      size = 10,
      select = '',
      sort = '',
      populate = '',
      lean = true,
      filterByEnabled = true
    }
  ) {
    const options = {
      select,
      sort,
      populate,
      lean,
      page,
      size
    };

    if (filterByEnabled) {
      criteria._enabled = true;
    }

    try {
      const result = await this.Model.paginate(criteria, options);
      return result;
    } catch (e) {
      throw new Error(e.message, e);
    }
  },

  /**
   * Find Mongoose object by Id for update purposes
   * @param {String} id - object id
   * @returns {Promise} promise with object found
   */
  async findOne(criteria, select = '', populate = '', lean = true, filterByEnabled = true) {
    try {
      if (filterByEnabled) {
        criteria._enabled = true;
      }

      const q = this.Model.findOne(criteria).populate(populate).select(select);

      if (lean) {
        q.lean();
      }
      const result = await q.exec();
      return result;
    } catch (e) {
      throw new Error(e.message, e);
    }
  },

  /**
   * Find object by Id
   * @param {String} id - object id
   * @returns {Promise} promise with object found
   */
  async findById(id, select = '', populate = '', lean = true, filterByEnabled = true) {
    return this.findOne({ _id: id }, select, populate, lean, filterByEnabled);
  },

  /**
   * Create a json object in the database
   * @param {Object} json object to create
   * @returns {Promise} promise with object created
   */
  async create(json) {
    try {
      return await this.Model.create(json);
    } catch (e) {
      throw Error(e);
    }
  },

  /**
   * Creates a json object in the database.
   * If object was previously deleted then updates record
   * @param {Object} json - json object to create
   * @returns {Promise} object created
   */
  async createUpdate(json) {
    try {
      const primaryKeys = this.getPrimaryKeysFields();
      const criteria = {};
      primaryKeys.forEach(pk => {
        criteria[pk] = json[pk];
      });

      criteria._enabled = false;

      // search for a deleted record
      const result = await this.findOne(criteria, '', '', true, false);

      if (result) {
        // in case object exists update
        return await this.Model.findOneAndUpdate(criteria, json, {
          new: true,
          runValidators: true
        });
      }
      // object doesn't exist create
      return await this.create(json);
    } catch (e) {
      throw new Error(e.message, e);
    }
  },

  async inserMany(arr) {
    try {
      const result = await this.Model.insertMany(arr);
      return result;
    } catch (e) {
      throw Error(e);
    }
  },

  async update(id, json) {
    try {
      return await this.Model.findOneAndUpdate({ _id: id, _enabled: true }, json, {
        new: true,
        runValidators: true
      });
    } catch (e) {
      throw Error(e);
    }
  },

  /**
   * Delete a document by criteria.
   * This operation is unrecoverable and can affects referencial integrity
   * @param {Object} criteria
   * @returns {Promise} result
   */
  async removeBy(criteria) {
    try {
      return await this.Model.remove(criteria);
    } catch (e) {
      throw new Error(e.message, e);
    }
  },

  /**
   * Delete a document by id.
   * This operation is unrecoverable and can affects referencial integrity
   * @param {String} id
   * @returns {Promise} object deleted
   */
  async removeById(id) {
    return this.removeBy({ _id: id });
  },

  /**
   * Delete all documents from a collection
   * This operation is unrecoverable and can affects referencial integrity
   * @param {String} id
   * @returns {Promise} object deleted
   */
  async removeAll() {
    return this.removeBy({});
  },

  /**
   * Soft delete a document by id.
   * Soft delete means that object can be recovered
   * @param {String} id
   * @returns {Promise} object deleted
   */
  async delete(id) {
    try {
      return await this.Model.findOneAndUpdate(
        { _id: id, _enabled: true },
        { _enabled: false },
        { new: true }
      );
    } catch (e) {
      throw new Error(e.message, e);
    }
  },

  /**
   * Delete all documents from a collection
   * This operation is unrecoverable and can affects referencial integrity
   * @param {String} id
   * @returns {Promise} object deleted
   */
  async undoDelete(id) {
    try {
      return await this.Model.findByIdAndUpdate(id, { _enabled: true }, { new: true });
    } catch (e) {
      throw new Error(e.message, e);
    }
  },

  /**
   * Insert or update a list of projects
   * @param {Array} projects a projects list to insert or update
   */
  async bulkUpdateOrCreateUnordered(arr) {
    try {
      const primaryKeys = this.getPrimaryKeysFields();
      const bulks = this.Model.collection.initializeUnorderedBulkOp();

      arr.forEach(elem => {
        const criteria = {};
        primaryKeys.forEach(pk => {
          criteria[pk] = elem[pk];
        });

        bulks
          .find(criteria)
          .upsert()
          .replaceOne({
            ...elem
          });
      });

      return await bulks.execute();
    } catch (e) {
      throw Error(e);
    }
  },

  validateModel(json) {
    const model = new this.Model(json);
    const result = model.validateSync();

    if (!result) {
      return result;
    }

    return Error(result);
  }
};

module.exports = basicCrudService;
