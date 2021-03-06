const isAtleast = (str, limit) => {
  return str.length >= limit;
};

const hasLetter = str => {
  return /[a-z]/i.test(str);
};

const hasOnlyLetters = str => {
  return !/[^a-z]/i.test(str);
};

const hasNumber = str => {
  return /\d/.test(str);
};

const isValidEmail = str => {
  return /^([a-zA-Z0-9!#$%&'*+-/=?^_`{|}~]+)@([a-zA-Z0-9!#$%&'*+-/=?^_`{|}~]+)\.([a-zA-Z]{2,5})$/.test(
    str,
  );
};

const capitalizeFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getFirstUpper = str => {
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === str.charAt(i).toUpperCase()) {
      return i;
    }
  }
  return -1;
};

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatDate = date => {
  return `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
};

const formatSceneDate = date => {
  const zSplit = date.split('Z');
  const tSplit = zSplit[0].split('T');
  const colonSplit = tSplit[1].split(':');
  return `${tSplit[0]} @${colonSplit[0]}:${colonSplit[1]}`;
};

const parsePathName = path => {
  return capitalizeFirstLetter(path.split('/')[1]);
};

const appStateToNumber = appState => {
  return appState === 'inactive' ? 0 : appState === 'live' ? 1 : 2;
};

const randomArrayValue = array => {
  return array[Math.floor(Math.random() * array.length)];
};

const arrangeArrByDate = array => {
  const sortedByDate = [];

  for (let i = 2018; i <= new Date().getFullYear(); i++) {
    array.forEach(date => {
      if (date.includes(i)) sortedByDate.push(date);
    });
  }

  return sortedByDate;
};

const parseSize = size => {
  if (size < 50) return 'small';
  if (size < 100) return 'medium';
  return 'large';
};

export default {
  isAtleast,
  hasLetter,
  hasOnlyLetters,
  hasNumber,
  isValidEmail,
  capitalizeFirstLetter,
  getFirstUpper,
  numberWithCommas,
  formatDate,
  formatSceneDate,
  parsePathName,
  appStateToNumber,
  randomArrayValue,
  arrangeArrByDate,
  parseSize,
};
