import store from './store/store';

console.log('Popup script working!');

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import BrowserPopup from './components/BrowserPopup';

// import so selectors are initialised before first use
import 'common/store/selectors';
import { initializeTabId } from '../common/tab-init';

const waitUntilFirstUpdate = new Promise((resolve) => {
  const unsubscribe = store.subscribe(() => {
    unsubscribe(); // make sure to only fire once
    resolve();
  });
});

const waitUntilPageLoaded = new Promise((resolve) => {
  window.addEventListener('load', () => {
    resolve();
  });
});

Promise.all([
  waitUntilFirstUpdate,
  waitUntilPageLoaded,
  initializeTabId(),
]).then(() => {
  console.debug('Store hydrated; rendering components');
  ReactDOM.render(
    <Provider store={store}>
      <BrowserPopup/>
    </Provider>,
    document.body,
  );
});


// window.addEventListener('load', () => {

// Wait until the store is connected to the background page before rendering

// const unsubscribe = store.subscribe(() => {
//   unsubscribe(); // make sure to only fire once
//   console.debug('Store hydrated; rendering components');
//   ReactDOM.render(
//     <Provider store={store}>
//       <BrowserPopup/>
//     </Provider>,
//     document.body,
//   );
// });

// });
