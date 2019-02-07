import React from 'react';
import {Provider} from 'react-redux';

import IPPSettings from 'common/PPSettings';
import appComponent from './modules/app-component';

// Declared in webpack.config through DefinePlugin
declare global {
  const PPSettings: IPPSettings;
}

import store from './store/store';
import {updateTabInfo} from '../common/store/tab/actions';

console.log('Content script working!');

/*
 * APPLICATION STATE POLICY
 * The application state is populated both from browser storage (appModes) and from the API (all other reducers)
 *
 * While API data changes are not listened to (no need),
 * browser storage is the communication channel between browser extension popup and the content script(s)
 * running on all open tabs, so beside loading data from browser storage we listen to changes to react to
 * popup settings changes in real time.
 * Browser storage is the source of truth for Redux store; we do not change state.appModes directly;
 * we commit changes to browser storage and recalculate state.appMode on storage change.
 */

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  store.dispatch(updateTabInfo({
    currentUrl: window.location.href,
  }));

  window.addEventListener('load', () => {
    /*
     * Modules hooked to Redux store
     */
    // Injecting React components into DOM
    appComponent.init();
  });
}
