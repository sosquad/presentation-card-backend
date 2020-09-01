/* eslint-disable no-plusplus */
const isString = obj => Object.prototype.toString.call(obj) === '[object String]';

const safeObject = obj => {
  const copyObj = JSON.parse(JSON.stringify(obj));
  delete copyObj.password;
  delete copyObj.confirmPassword;
  delete copyObj.newPassword;
  delete copyObj.oldPassword;

  return copyObj;
};

const safeValue = (obj, path, defaultValue = '') => {
  try {
    const paths = path.split('.');
    let current = obj;

    for (let i = 0; i < paths.length; ++i) {
      if (current[paths[i]] === undefined) {
        return defaultValue;
      }

      current = current[paths[i]];
    }

    return current;
  } catch (error) {
    return defaultValue;
  }
};

const transformDiacritic = value =>
  value
    .replace(/[aàáâãäå]/gi, '[aàáâãäå]')
    .replace(/[eèéêë]/gi, '[eèéêë]')
    .replace(/[iìíîï]/gi, '[iìíîï]')
    .replace(/[oòóôõö]/gi, '[oòóôõö]')
    .replace(/[uùúûü]/gi, '[uùúûü]')
    .replace(/[nñ]/gi, '[nñ]');

const escapeSpecialChars = value =>
  value && isString(value) ? value.replace(/[.*?^${}()|[\]\\]/g, '\\$&') : '';

const escapeChars = value =>
  value && isString(value) ? transformDiacritic(escapeSpecialChars(value)) : value;

const dateFormat = {
  getDate(date) {
    const months = [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic'
    ];
    const strFullDate = `${date.getDate()} ${months[date.getMonth()]}. ${date.getFullYear()}`;
    return strFullDate;
  },
  getTime(date) {
    const midDay = 12;
    const tenMinutes = 10;

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= midDay ? 'pm' : 'am';
    hours %= midDay;
    hours = hours || midDay;
    minutes = minutes < tenMinutes ? `0${minutes}` : minutes;
    const strFullDate = `${hours}:${minutes} ${ampm}`;
    return strFullDate;
  }
};

module.exports = {
  isString,
  safeValue,
  safeObject,
  escapeChars,
  dateFormat
};
