/**
 * Split an array in chunks of a given size
 * @param {Array} arr array list
 * @param {Integer} size chunk size
 */
const splitInChunks = (arr, size) => {
  if (!arr) {
    return [];
  }
  const list = [...arr];

  const result = [];

  while (list.length > 0) {
    result.push(list.splice(0, size));
  }

  return result;
};

module.exports = {
  splitInChunks
};
