import React from 'react';
import {Provider} from 'react-redux';

import IPPSettings from 'common/PPSettings';
import appComponent from './modules/app-component';

// Declared in webpack.config through DefinePlugin
declare global {
  const PPSettings: IPPSettings;
}

import store, {storeSync} from './store/store';
import {updateTabInfo} from '../common/store/tab/actions';

console.log('Content script working!');

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {

  // update no sooner than the store has been hydrated first
  storeSync.init()
    .then(() => {
    store.dispatch(updateTabInfo({
      currentUrl: window.location.href,
    }));
  });

  window.addEventListener('load', () => {
    // Injecting React components into DOM
    appComponent.init();
  });
}
