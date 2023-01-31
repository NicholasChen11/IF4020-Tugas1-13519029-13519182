import React, { useRef, useState } from 'react';

import emptyCheckbox from './images/checkbox-inactive-yellow.png';
import filledCheckbox from './images/checkbox-active-yellow.png';

import {
  useCipher,
  useDecipher,
} from './cipher';

import {
  removeNonalphabet,
  separatePerFiveLetters,
} from './utils';

import './App.css';

const dummyHillKey2 = [
  [0,0],
  [0,0],
];

const dummyHillKey3 = [
  [0,0,0],
  [0,0,0],
  [0,0,0],
];

const App = () => {
  const fileInputPlainRef = useRef(null);
  const cipherResultRef = useRef(null);
  const fileInputCipherRef = useRef(null);
  
  const [cipherMode, setCipherMode] = useState('vigenere');

  const [inputPlainText, setInputPlainText] = useState('');
  const [inputCipherKey, setInputCipherKey] = useState('');
  const [affineCipherM, setAffineCipherM] = useState(0);
  const [affineCipherB, setAffineCipherB] = useState(0);
  const [hillKeySize, setHillKeySize] = useState(2);
  const [hillKey, setHillKey] = useState(dummyHillKey2);
  const [isShowPerFiveLetters, setIsShowPerFiveLetters] = useState(false);

  const [inputCipherText, setInputCipherText] = useState('');
  const [inputDecipherKey, setInputDecipherKey] = useState('');
  const [affineDecipherM, setAffineDecipherM] = useState(0);
  const [affineDecipherB, setAffineDecipherB] = useState(0);
  const [decipherHillKeySize, setDecipherHillKeySize] = useState(2);
  const [decipherHillKey, setDecipherHillKey] = useState(dummyHillKey2);

  const cipher = useCipher(cipherMode);
  const decipher = useDecipher(cipherMode);
  
  const cipherResult = () => {
    let result = '';

    if (
      cipherMode === 'vigenere'
      || cipherMode === 'autoVigenere'
      || cipherMode === 'playfair'
    ) {
      result = cipher({
        text: removeNonalphabet(inputPlainText),
        key: inputCipherKey || 'a',
      });
    } else if (cipherMode === 'extendedVigenere') {
      result = cipher({
        text: inputPlainText,
        key: inputCipherKey || 'a',
      });
    } else if (cipherMode === 'affine') {
      result = cipher({
        text: inputPlainText,
        m: parseInt(affineCipherM),
        b: parseInt(affineCipherB),
      });
    } else if (cipherMode === 'hill') {
      result = cipher({
        text: inputPlainText,
        key: hillKey,
      });
    }

    if (isShowPerFiveLetters) {
      return separatePerFiveLetters(result);
    } else {
      return result;
    }
  };

  const decipherResult = () => {
    if (
      cipherMode === 'vigenere'
      || cipherMode === 'autoVigenere'
      || cipherMode === 'playfair'
    ) {
      return decipher({
        text: removeNonalphabet(inputCipherText),
        key: inputDecipherKey || 'a',
      });
    } else if (cipherMode === 'extendedVigenere') {
      return decipher({
        text: inputCipherText,
        key: inputDecipherKey || 'a',
      });
    } else if (cipherMode === 'affine') {
      return decipher({
        text: inputCipherText,
        m: parseInt(affineDecipherM),
        b: parseInt(affineDecipherB),
      });
    } else if (cipherMode === 'hill') {
      return decipher({
        text: inputCipherText,
        key: decipherHillKey,
      });
    }
  };

  const readPlainFile = (e) => {
    if (e.target.value === '') {
      console.log('No file selected');
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
      const result = event.target.result;
      setInputPlainText(result);
    });

    reader.readAsBinaryString(e.target.files[0]);
  };

  const readCipherFile = (e) => {
    if (e.target.value === '') {
      console.log('No file selected');
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
      const result = event.target.result;
      setInputCipherText(result);
    });

    reader.readAsBinaryString(e.target.files[0]);
  };

  const loadTxt = () => {
    const messsage = cipherResultRef.current.innerHTML;

    const element = document.createElement("a");
    const file = new Blob([messsage], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "cipherFile.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="App">
      <select
        id="dropdown"
        onChange={(e) => setCipherMode(e.target.value)}
      >
        <option value="vigenere">Vigenere</option>
        <option value="extendedVigenere">Extended Vigenere</option>
        <option value="autoVigenere">Auto Vigenere</option>
        <option value="affine">Affine</option>
        <option value="playfair">Playfair</option>
        <option value="hill">Hill</option>
      </select>

      <div id='title'>
        Cipher Part
      </div>

      {/* Plain Text */}
      <div>
        Plain Text:
      </div>
      <textarea
        id='inputContainer'
        value={inputPlainText}
        onChange={(e) => {
          setInputPlainText(e.target.value);
          if (fileInputPlainRef.current) {
            fileInputPlainRef.current.value = '';
          }
        }}
      />
      <input
        ref={fileInputPlainRef}
        type='file'
        onChange={readPlainFile}
      />

      {/* Key Text */}
      {(
        cipherMode === 'vigenere' 
        || cipherMode === 'extendedVigenere'
        || cipherMode === 'autoVigenere'
        || cipherMode === 'playfair'
      ) && (
        <React.Fragment>
          <div>
            Key:
          </div>
          <textarea
            id='inputContainer'
            value={inputCipherKey}
            onChange={(e) => {
              setInputCipherKey(e.target.value);
            }}
          />
        </React.Fragment>
      )}

      {(cipherMode === 'affine') && (
        <React.Fragment>
          <div>
            m:
          </div>
          <input
            value={affineCipherM}
            type='number'
            onChange={(e) => setAffineCipherM(e.target.value)}
          />
          <div>
            b:
          </div>
          <input
            value={affineCipherB}
            type='number'
            onChange={(e) => setAffineCipherB(e.target.value)}
          />
        </React.Fragment>
      )}

      {(cipherMode === 'hill') && (
        <React.Fragment>
          <div>
            key:
          </div>
          <div id={hillKeySize === 2 ? "grid-container-2" : "grid-container-3"}>
            {[...Array(hillKeySize*hillKeySize)].map((_, idx) => {
              const x = Math.floor(idx / hillKeySize);
              const y = idx % hillKeySize;
              const changeKey = (newValue) => {
                let key = JSON.parse(JSON.stringify(hillKey));
                key[x][y] = newValue;
                return key;
              }

              return (
                <input
                  key={`grid-idx-${idx + 1}`}
                  value={hillKey[x][y]}
                  type='number'
                  onChange={(e) => setHillKey(changeKey(parseInt(e.target.value)))}
                />
              );
            })}
          </div>
          

          <button
            id='checkboxButton'
            onClick={() => {
              hillKeySize === 3 && setHillKey(dummyHillKey2);
              setHillKeySize(2);
            }}
          >
            <div id='checkboxContainer'>
              <img
                id='checkboxIcon'
                src={hillKeySize === 2 ? filledCheckbox : emptyCheckbox}
                alt='checkbox icon'
              />

              <div>
                Use key of size 2x2
              </div>
            </div>
          </button>
          <button
            id='checkboxButton'
            onClick={() => {
              hillKeySize === 2 && setHillKey(dummyHillKey3);
              setHillKeySize(3);
            }}
          >
            <div id='checkboxContainer'>
              <img
                id='checkboxIcon'
                src={hillKeySize === 3 ? filledCheckbox : emptyCheckbox}
                alt='checkbox icon'
              />

              <div>
                Use key of size 3x3
              </div>
            </div>
          </button>
        </React.Fragment>
      )}
      

      {/* Cipher Text */}
      <div>
        Ciphered Text:  
      </div>
      <div id='resultTextContainer' ref={cipherResultRef}>
        {cipherResult()}
      </div>

      <button
        id='checkboxButton'
        onClick={() => setIsShowPerFiveLetters(!isShowPerFiveLetters)}
      >
        <div id='checkboxContainer'>
          <img
            id='checkboxIcon'
            src={isShowPerFiveLetters ? filledCheckbox : emptyCheckbox}
            alt='checkbox icon'
          />

          <div>
            Show cipher per 5 letters
          </div>
        </div>
      </button>

      <button
        onClick={() => loadTxt()}
      >
        Load Result to txt
      </button>

      {/* ========================================================== */}

      <div id='title'>
        Decipher Part
      </div>

      {/* Cipher Text */}
      <div>
        Cipher Text:
      </div>
      <textarea
        id='inputContainer'
        value={inputCipherText}
        onChange={(e) => {
          setInputCipherText(e.target.value);
          if (fileInputCipherRef.current) {
            fileInputCipherRef.current.value = '';
          }
        }}
      />
      <input
        ref={fileInputCipherRef}
        type='file'
        onChange={readCipherFile}
      />

      {/* Key Text */}
      {(
        cipherMode === 'vigenere' 
        || cipherMode === 'extendedVigenere'
        || cipherMode === 'autoVigenere'
        || cipherMode === 'playfair'
      ) && (
        <React.Fragment>
          <div>
            Key:
          </div>
          <textarea
            id='inputContainer'
            value={inputDecipherKey}
            onChange={(e) => {
              setInputDecipherKey(e.target.value);
            }}
          />
        </React.Fragment>
      )}

      {(cipherMode === 'affine') && (
        <React.Fragment>
          <div>
            m:
          </div>
          <input
            value={affineDecipherM}
            type='number'
            onChange={(e) => setAffineDecipherM(e.target.value)}
          />
          <div>
            b:
          </div>
          <input
            value={affineDecipherB}
            type='number'
            onChange={(e) => setAffineDecipherB(e.target.value)}
          />
        </React.Fragment>
      )}

      {(cipherMode === 'hill') && (
        <React.Fragment>
          <div>
            key:
          </div>
          <div id={decipherHillKeySize === 2 ? "grid-container-2" : "grid-container-3"}>
            {[...Array(decipherHillKeySize*decipherHillKeySize)].map((_, idx) => {
              const x = Math.floor(idx / decipherHillKeySize);
              const y = idx % decipherHillKeySize;
              const changeKey = (newValue) => {
                let key = JSON.parse(JSON.stringify(decipherHillKey));
                key[x][y] = newValue;
                return key;
              }

              return (
                <input
                  key={`grid-idx-${idx + 1}`}
                  value={decipherHillKey[x][y]}
                  type='number'
                  onChange={(e) => setDecipherHillKey(changeKey(parseInt(e.target.value)))}
                />
              );
            })}
          </div>

          <button
            id='checkboxButton'
            onClick={() => {
              decipherHillKeySize === 3 && setDecipherHillKey(dummyHillKey2);
              setDecipherHillKeySize(2);
            }}
          >
            <div id='checkboxContainer'>
              <img
                id='checkboxIcon'
                src={decipherHillKeySize === 2 ? filledCheckbox : emptyCheckbox}
                alt='checkbox icon'
              />

              <div>
                Use key of size 2x2
              </div>
            </div>
          </button>
          <button
            id='checkboxButton'
            onClick={() => {
              decipherHillKeySize === 2 && setDecipherHillKey(dummyHillKey3);
              setDecipherHillKeySize(3);
            }}
          >
            <div id='checkboxContainer'>
              <img
                id='checkboxIcon'
                src={decipherHillKeySize === 3 ? filledCheckbox : emptyCheckbox}
                alt='checkbox icon'
              />

              <div>
                Use key of size 3x3
              </div>
            </div>
          </button>
        </React.Fragment>
      )}

      {/* Cipher Text */}
      <div>
        Deciphered Text:  
      </div>
      <div id='resultTextContainer'>
        {decipherResult()}
      </div>
    </div>
  );
}

export default App;
