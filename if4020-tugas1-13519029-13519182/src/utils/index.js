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

export const gcd = (a, b) => {
  if (a == 0 || b == 0)
    return 0;
    
  if (a == b)
    return a;
    
  if (a > b)
    return gcd(a - b, b);
            
  return gcd(a, b - a);
};

export const coprime = (a, b) => {
  if (gcd(a, b) == 1)
    return true;
  else
    return false;    
};

export const modInverse = (a, m) => {
  for(let x = 1; x < m; x++) {
    if (((a % m) * (x % m)) % m == 1) {
      return x;
    };
  };
};