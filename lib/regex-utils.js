const isString = obj => Object.prototype.toString.call(obj) === '[object String]';

const transformDiacritic = value =>
  value
    .replace(/[aàáâãäå]/gi, '[aàáâãäå]')
    .replace(/[eèéêë]/gi, '[eèéêë]')
    .replace(/[iìíîï]/gi, '[iìíîï]')
    .replace(/[oòóôõö]/gi, '[oòóôõö]')
    .replace(/[uùúûü]/gi, '[uùúûü]')
    .replace(/[nñ]/gi, '[nñ]');

const escapeSpecialChars = value =>
  value && isString(value) ? value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';

const escapeChars = value =>
  value && isString(value) ? transformDiacritic(escapeSpecialChars(value)) : value;

module.exports = { transformDiacritic, escapeSpecialChars, escapeChars };
