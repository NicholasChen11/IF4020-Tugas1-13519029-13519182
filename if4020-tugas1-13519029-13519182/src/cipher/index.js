import {
  coprime,
  modInverse,
} from '../utils';

const alphabetToNum = {
  'a': 0,
  'b': 1,
  'c': 2,
  'd': 3,
  'e': 4,
  'f': 5,
  'g': 6,
  'h': 7,
  'i': 8,
  'j': 9,
  'k': 10,
  'l': 11,
  'm': 12,
  'n': 13,
  'o': 14,
  'p': 15,
  'q': 16,
  'r': 17,
  's': 18,
  't': 19,
  'u': 20,
  'v': 21,
  'w': 22,
  'x': 23,
  'y': 24,
  'z': 25,
};

const numToAlphabet = {
  0: 'a',
  1: 'b',
  2: 'c',
  3: 'd',
  4: 'e',
  5: 'f',
  6: 'g',
  7: 'h',
  8: 'i',
  9: 'j',
  10: 'k',
  11: 'l',
  12: 'm',
  13: 'n',
  14: 'o',
  15: 'p',
  16: 'q',
  17: 'r',
  18: 's',
  19: 't',
  20: 'u',
  21: 'v',
  22: 'w',
  23: 'x',
  24: 'y',
  25: 'z',
};

// Vigenere Part
// =============
const vigenereCipher = ({text, key}) => {
  const lowercasedText = text.toLowerCase();
  const lowercasedKey = key.toLowerCase();
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const keyIdx = i % key.length;

    result = result.concat(numToAlphabet[
      (alphabetToNum[lowercasedText[i]] + alphabetToNum[lowercasedKey[keyIdx]]) % 26
    ]);
  }

  return result;
}

const vigenereDecipher = ({text, key}) => {
  const lowercasedText = text.toLowerCase();
  const lowercasedKey = key.toLowerCase();
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const keyIdx = i % key.length;

    result = result.concat(numToAlphabet[
      // '+ 26' to prevent negative value
      ((alphabetToNum[lowercasedText[i]] - alphabetToNum[lowercasedKey[keyIdx]]) + 26) % 26
    ]);
  }

  return result;
};

// Auto Vigenere Part
// ==================
const autoVigenereCipher = ({text, key}) => {
  const lowercasedText = text.toLowerCase();
  const lowercasedKey = key.concat(text).toLowerCase();
  let result = '';

  for (let i = 0; i < text.length; i++) {
    result = result.concat(numToAlphabet[
      (alphabetToNum[lowercasedText[i]] + alphabetToNum[lowercasedKey[i]]) % 26
    ]);
  }

  return result;
};

const autoVigenereDecipher = ({text, key}) => {
  const lowercasedText = text.toLowerCase();
  let lowercasedKey = key.toLowerCase();
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const currentLetter = numToAlphabet[
      // '+ 26' to prevent negative value
      ((alphabetToNum[lowercasedText[i]] - alphabetToNum[lowercasedKey[i]]) + 26) % 26
    ];
    lowercasedKey = lowercasedKey.concat(currentLetter);
    result = result.concat(currentLetter);
  }

  return result;
};

// Affine Part
// ===========
const affineCipher = ({text, m, b}) => {
  let result = '';

  try {
    if (
      typeof m !== 'number'
      || Number.isNaN(m)
      || m <= 0
      || !coprime(m, 256)
    ) {
      throw 'm value must be positive number and coprime with 256';
    }
    
    if (typeof b !== 'number' || Number.isNaN(b)) {
      throw 'b value must be number';
    }

    for (let i = 0; i < text.length; i++) {
      const P = text.charCodeAt(i);
      const C = (m * P + b) % 256; 
      result = result.concat(String.fromCharCode(C));
    };

    return result;
  } catch (err) {
    console.log("Error: ", err);
  };
};

const affineDecipher = ({text, m, b}) => {
  let result = '';

  try {
    if (
      typeof m !== 'number'
      || Number.isNaN(m)
      || m <= 0
      || !coprime(m, 256)
    ) {
      throw 'm value must be positive number and coprime with 256';
    }
    
    if (typeof b !== 'number' || Number.isNaN(b)) {
      throw 'b value must be number';
    }

    const mInverse = modInverse(m, 256);

    for (let i = 0; i < text.length; i++) {
      const C = text.charCodeAt(i);
      const P = (mInverse * (C - b)) % 256; 
      result = result.concat(String.fromCharCode(P));
    };

    return result;
  } catch (err) {
    console.log("Error: ", err);
  };
};

// Playfair Part
// =============
const playfairPreprocess = (inputText) => {
  let text = inputText;
  let result = '';

  for (let idx = 0; idx < text.length; idx = idx + 2) {
    if (idx + 1 === text.length) { // odd length text case
      if (text[idx] === 'j') {
        result = result.concat('ix');
      }

      result = result.concat(text[idx] + 'x');
      break;
    }
    if (text[idx] === text[idx+1]) { // pair char case
      if (text[idx] === 'j') {
        result = result.concat('ix');
      }

      result = result.concat(text[idx] + 'x');
      idx = idx - 1;
      continue;
    }
    if (text[idx] === 'j') {
      result = result.concat('i' + text[idx + 1]);
      continue;
    }
    if (text[idx+1] === 'j') {
      result = result.concat(text[idx + 1] + 'i');
      continue;
    }
    result = result.concat(text[idx] + text[idx+1]);
  }

  return result;
};

const generateKeyTable = (inputKey) => {
  let keyTable = [[], [], [], [], []];
  let frequencyArray = new Array(26).fill(0); // to keep track of used alphabet
  const key = inputKey.toLowerCase();
  
  let i = 0;
  let j = 0;
  for (let idx = 0; idx < key.length; idx++) {
    if (key[idx] !== 'j' && frequencyArray[alphabetToNum[key[idx]]] === 0) {
      frequencyArray[alphabetToNum[key[idx]]] = 1;
      keyTable[j][i] = alphabetToNum[key[idx]]

      if (i === 4) {
        i = 0;
        j = j + 1;
      } else {
        i = i + 1;
      }
    };
  };

  for (let idx = 0; idx < frequencyArray.length; idx++) {
    if (idx !== alphabetToNum['j'] && frequencyArray[idx] === 0) {
      keyTable[j][i] = idx

      if (i === 4) {
        i = 0;
        j = j + 1;
      } else {
        i = i + 1;
      }
    };
  };

  return keyTable;
};

const searchInTable = (key, keyTable) => {
  for (let i = 0; i < keyTable.length; i++) {
    for (let j = 0; j < keyTable.length; j++) {
      if (keyTable[i][j] === key) {
        return [i, j];
      }
    }
  }
  console.log('search error for key:', key);
}

const playfairRule = (firstChar, secondChar, keyTable) => {
  // search coordinate for each char in keyTable
  const firstCharPoint = searchInTable(alphabetToNum[firstChar], keyTable);
  const secondCharPoint = searchInTable(alphabetToNum[secondChar], keyTable);
  let firstResultPoint = [];
  let secondResultPoint = [];

  // apply rules
  if (firstCharPoint[0] === secondCharPoint[0]) {
    firstResultPoint = [
      firstCharPoint[0], 
      (firstCharPoint[1] === 4) ? 0 : firstCharPoint[1] + 1
    ];
    secondResultPoint = [
      secondCharPoint[0], 
      (secondCharPoint[1] === 4) ? 0 : secondCharPoint[1] + 1
    ];
  } else if (firstCharPoint[1] === secondCharPoint[1]) {
    firstResultPoint = [
      (firstCharPoint[0] === 4) ? 0 : firstCharPoint[0] + 1, 
      firstCharPoint[1]
    ];
    secondResultPoint = [
      (secondCharPoint[0] === 4) ? 0 : secondCharPoint[0] + 1,
      secondCharPoint[1]
    ];
  } else {
    firstResultPoint = [
      firstCharPoint[0], 
      secondCharPoint[1]
    ];
    secondResultPoint = [
      secondCharPoint[0],
      firstCharPoint[1]
    ];
  };

  // convert back to alphabet
  const firstCipher = numToAlphabet[
    keyTable[firstResultPoint[0]][firstResultPoint[1]]
  ];
  const secondCipher = numToAlphabet[
    keyTable[secondResultPoint[0]][secondResultPoint[1]]
  ];

  return firstCipher + secondCipher;
};

const playfairCipher = ({text, key}) => {
  const rawText = text.toLowerCase();
  const lowercasedKey = key.toLowerCase();
  const keyTable = generateKeyTable(lowercasedKey);
  console.log('Nicho table:', keyTable);
  let result = '';

  const preprocessedText = playfairPreprocess(rawText);
  console.log("Nicho preprocessed", preprocessedText);

  for (let idx = 0; idx < preprocessedText.length; idx = idx + 2) {
    const firstChar = preprocessedText[idx];
    const secondChar = preprocessedText[idx+1];
    
    result = result.concat(playfairRule(firstChar, secondChar, keyTable));
  }

  return result;
};

const playfairReverseRule = (firstChar, secondChar, keyTable) => {
  // search coordinate for each char in keyTable
  const firstCharPoint = searchInTable(alphabetToNum[firstChar], keyTable);
  const secondCharPoint = searchInTable(alphabetToNum[secondChar], keyTable);
  let firstResultPoint = [];
  let secondResultPoint = [];

  // apply rules
  if (firstCharPoint[0] === secondCharPoint[0]) {
    firstResultPoint = [
      firstCharPoint[0], 
      (firstCharPoint[1] === 0) ? 4 : firstCharPoint[1] - 1
    ];
    secondResultPoint = [
      secondCharPoint[0], 
      (secondCharPoint[1] === 0) ? 4 : secondCharPoint[1] - 1
    ];
  } else if (firstCharPoint[1] === secondCharPoint[1]) {
    firstResultPoint = [
      (firstCharPoint[0] === 0) ? 4 : firstCharPoint[0] - 1, 
      firstCharPoint[1]
    ];
    secondResultPoint = [
      (secondCharPoint[0] === 0) ? 4 : secondCharPoint[0] - 1,
      secondCharPoint[1]
    ];
  } else {
    firstResultPoint = [
      firstCharPoint[0], 
      secondCharPoint[1]
    ];
    secondResultPoint = [
      secondCharPoint[0],
      firstCharPoint[1]
    ];
  };

  // convert back to alphabet
  const firstCipher = numToAlphabet[
    keyTable[firstResultPoint[0]][firstResultPoint[1]]
  ];
  const secondCipher = numToAlphabet[
    keyTable[secondResultPoint[0]][secondResultPoint[1]]
  ];

  return firstCipher + secondCipher;
};

const removeDummyX = (text) => {
  let result = '';

  for (let idx = 0; idx < text.length; idx++) {
    if (text[idx] === 'x') {
      if (idx === 0) {
        result = result.concat(text[idx]);
      } else if (idx === text.length - 1 || text[idx-1] === text[idx-1]) {
        continue;
      } else {
        result = result.concat(text[idx]);
      }
    } else {
      result = result.concat(text[idx]);
    }
  }

  return result;
};

const playfairDecipher = ({text, key}) => {
  const lowercasedText = text.toLowerCase();
  const lowercasedKey = key.toLowerCase();
  const keyTable = generateKeyTable(lowercasedKey);
  let result = '';

  for (let idx = 0; idx < lowercasedText.length; idx = idx + 2) {
    const firstChar = lowercasedText[idx];
    const secondChar = lowercasedText[idx+1];
    
    result = result.concat(playfairReverseRule(firstChar, secondChar, keyTable));
  }

  result = removeDummyX(result);

  return result;
};

export const useCipher = (cipherMode) => {
  if (cipherMode === 'vigenere') {
    return vigenereCipher;
  } else if (cipherMode === 'autoVigenere') {
    return autoVigenereCipher;
  } else if (cipherMode === 'affine') {
    return affineCipher;
  } else if (cipherMode === 'playfair') {
    return playfairCipher;
  } else {
    console.log("Cipher Mode is not recognised");
    return () => {};
  }
};

export const useDecipher = (cipherMode) => {
  if (cipherMode === 'vigenere') {
    return vigenereDecipher;
  } else if (cipherMode === 'autoVigenere') {
    return autoVigenereDecipher;
  } else if (cipherMode === 'affine') {
    return affineDecipher;
  } else if (cipherMode === 'playfair') {
    return playfairDecipher;
  } else {
    console.log("Decipher Mode is not recognised");
    return () => {};
  }
};