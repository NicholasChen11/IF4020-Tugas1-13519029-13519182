export const removeNonalphabet = (string) => (
  string.replace(/((?![A-Za-z]+).)/g, "")
);

export const separatePerFiveLetters = (string) => {
  let i = 0;
  let result = '';

  for (let index = 0; index < string.length; index++) {
    if (i !== 0 && i % 5 === 0) {
      result = result.concat(' ');
    }
    result = result.concat(string[index]);
    i++;
  };

  return result;
};