import { useRef, useState } from 'react';

import emptyCheckbox from './images/checkbox-inactive-yellow.png';
import filledCheckbox from './images/checkbox-active-yellow.png';

import {
  vigenereCipher,
  vigenereDecipher,
} from './cipher';

import {
  removeNonalphabet,
  separatePerFiveLetters,
} from './utils';

import './App.css';

const App = () => {
  const fileInputPlainRef = useRef(null);
  const fileInputCipherRef = useRef(null);

  const [inputPlainText, setInputPlainText] = useState('');
  const [inputCipherKey, setInputCipherKey] = useState('');
  const [isShowPerFiveLetters, setIsShowPerFiveLetters] = useState(false);

  const [inputCipherText, setInputCipherText] = useState('');
  const [inputDecipherKey, setInputDecipherKey] = useState('');

  const readPlainFile = (e) => {
    if(e.target.value === '') {
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
    if(e.target.value === '') {
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

      {/* Cipher Text */}
      <div>
        Ciphered Text:  
      </div>
      <div id='resultTextContainer'>
        {isShowPerFiveLetters && (
          separatePerFiveLetters(vigenereCipher({
            text: removeNonalphabet(inputPlainText),
            key: inputCipherKey || 'a',
          }))
        )}
        {!isShowPerFiveLetters && (
          vigenereCipher({
            text: removeNonalphabet(inputPlainText),
            key: inputCipherKey || 'a',
          })
        )}
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

      {/* Cipher Text */}
      <div>
        Deciphered Text:  
      </div>
      <div id='resultTextContainer'>
        {vigenereDecipher({
          text: removeNonalphabet(inputCipherText),
          key: inputDecipherKey || 'a',
        })}
      </div>
    </div>
  );
}

export default App;
