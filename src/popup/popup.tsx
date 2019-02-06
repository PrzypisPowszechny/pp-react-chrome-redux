
console.log('Popup script working!');

import React from 'react';
import ReactDOM from 'react-dom';

import BrowserPopup from './components/BrowserPopup';

window.addEventListener('load', () => {

  ReactDOM.render(
    <BrowserPopup/>,
    document.body,
  );

});
