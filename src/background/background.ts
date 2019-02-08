// NOTE: This page is also used for hot reloading in webpack-chrome-extension-reloader
// (so it must be present at least in development)
console.log('Background script!');

import './store/store';

chrome.runtime.onMessage.addListener(returnTabId);

let currentTabId;

function returnTabId(request, sender, sendResponse) {
  if (request.action === 'GET_TAB_ID') {
    if (sender.tab) {
      // content script
      console.log('content script');
      sendResponse(sender.tab.id);
    } else {
      // popup
      console.log('popup');
      sendResponse(currentTabId);
    }
  }
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  currentTabId = tabs[0].id;
  console.log('initial tab: ', currentTabId);
});

chrome.tabs.onActivated.addListener(setCurrentTabId);

function setCurrentTabId({ tabId, windowId }) {
  currentTabId = tabId;
  console.log('new tab: ', currentTabId);
}

function getCurrentTabId() {
  return currentTabId;
}

export {
  getCurrentTabId,
};
