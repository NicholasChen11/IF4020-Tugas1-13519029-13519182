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

const App = () => {
  const fileInputPlainRef = useRef(null);
  const fileInputCipherRef = useRef(null);
  
  const [cipherMode, setCipherMode] = useState('vigenere');

  const [inputPlainText, setInputPlainText] = useState('');
  const [inputCipherKey, setInputCipherKey] = useState('');
  const [affineCipherM, setAffineCipherM] = useState(0);
  const [affineCipherB, setAffineCipherB] = useState(0);
  const [isShowPerFiveLetters, setIsShowPerFiveLetters] = useState(false);

  const [inputCipherText, setInputCipherText] = useState('');
  const [inputDecipherKey, setInputDecipherKey] = useState('');
  const [affineDecipherM, setAffineDecipherM] = useState(0);
  const [affineDecipherB, setAffineDecipherB] = useState(0);

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
    } else if (cipherMode === 'affine') {
      result = cipher({
        text: inputPlainText,
        m: parseInt(affineCipherM),
        b: parseInt(affineCipherB),
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
    } else if (cipherMode === 'affine') {
      return decipher({
        text: inputCipherText,
        m: parseInt(affineDecipherM),
        b: parseInt(affineDecipherB),
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

  return (
    <div className="App">
      <select
        id="dropdown"
        onChange={(e) => setCipherMode(e.target.value)}
      >
        <option value="vigenere">Vigenere</option>
        <option value="autoVigenere">Auto Vigenere</option>
        <option value="affine">Affine</option>
        <option value="playfair">Playfair</option>
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
      

      {/* Cipher Text */}
      <div>
        Ciphered Text:  
      </div>
      <div id='resultTextContainer'>
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
