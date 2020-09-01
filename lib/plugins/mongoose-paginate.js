const logger = require('../logger');

const defaultOptions = {
  select: '',
  sort: '',
  populate: '',
  page: 1,
  size: 10,
  lean: true
};

const collation = 'es';

async function paginate(criteria, options) {
  const opts = { ...defaultOptions, ...options };
  const skipFrom = (parseInt(opts.page, 10) - 1) * parseInt(opts.size, 10);
  const query = this.find(criteria)
    .collation({ locale: collation })
    .skip(skipFrom)
    .limit(parseInt(opts.size, 10))
    .sort(opts.sort)
    .populate(opts.populate)
    .select(opts.select);

  if (opts.lean) {
    query.lean();
  }

  try {
    const [results, count] = await Promise.all([
      query.exec(),
      this.countDocuments(criteria).exec()
    ]);
    const page = {
      results,
      count,
      pageSize: opts.size,
      currentPage: opts.page,
      pageCount: Math.ceil(count / opts.size) || 1
    };

    page.hasPrevious = page.currentPage > 1;
    page.hasNext = page.currentPage < page.pageCount;

    return Promise.resolve(page);
  } catch (err) {
    logger.error('Error paginate => ', err);
    return Promise.reject(err);
  }
}

module.exports = schema => {
  // eslint-disable-next-line no-param-reassign
  schema.statics.paginate = paginate;
};
