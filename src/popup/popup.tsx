import store from './store/store';

console.log('Popup script working!');

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import BrowserPopup from './components/BrowserPopup';

window.addEventListener('load', () => {

  ReactDOM.render(
    <Provider store={store}>
      <BrowserPopup/>
    </Provider>,
    document.body,
  );

});
