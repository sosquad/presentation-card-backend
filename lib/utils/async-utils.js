const arrayUtils = require('./array-utils');

/**
 * Execute all async functions in parallel limited by concurrency
 * @param {Array} arr an array of async functions
 * @param {Integer} limit of concurrent execution
 */
const parallelLimited = async (arr, limit) => {
  if (!limit) {
    const result = await Promise.all(arr);
    return result;
  }

  const promiseGroup = arrayUtils.splitInChunks(arr, limit);

  const result = [];

  // We cannot use forEach because is not promise aware. So use for loop
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < promiseGroup.length; i++) {
    const group = promiseGroup[i];
    // eslint-disable-next-line no-await-in-loop
    const groupResult = await Promise.all(group); // execute all promises
    result.push(...groupResult);
  }

  return result;
};

module.exports = {
  parallelLimited
};
