import React from 'react';
import { Provider } from 'react-redux';

import IPPSettings from 'common/PPSettings';
import appComponent from './modules/app-component';

// Declared in webpack.config through DefinePlugin
declare global {
  const PPSettings: IPPSettings;
}

import { updateTabInfo } from '../common/store/tabs/tab/actions';
import ReactDOM from 'react-dom';
import store from '../common/store';
// import so selectors are initialised before first use
import 'common/store/selectors';
import { initializeTabId } from '../common/tab-init';

console.log('Content script working!');

const waitUntilStoreSynced = new Promise((resolve) => {
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

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  // Wait until the store is connected to the background page before rendering

  Promise.all([
    waitUntilStoreSynced,
    waitUntilPageLoaded,
    initializeTabId(),
  ]).then(() => {
    return store.dispatch(updateTabInfo({
      currentUrl: window.location.href,
    }));
  }).then(appComponent.init);

}
