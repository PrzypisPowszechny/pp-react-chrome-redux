// NOTE: This page is also used for hot reloading in webpack-chrome-extension-reloader
// (so it must be present at least in development)
import {storeSync} from './store/store';

console.log('Background script!');

chrome.runtime.onMessage.addListener(returnTabId);

export function returnTabId(request, sender, sendResponse) {
  if (request.action === 'GET_TAB_ID') {
    sendResponse(sender.tab.id);
  }
}

storeSync.init();
