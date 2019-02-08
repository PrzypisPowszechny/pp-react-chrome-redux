
let tabId;

function initializeTabId() {
  if (tabId !== undefined) {
    return Promise.resolve(tabId);
  }
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      action: 'GET_TAB_ID',
    }, (response) => {
      if (!response) {
        throw Error('Tab id not retrieved');
      }
      tabId = response;
      console.log('retrieved tab Id', tabId);
      resolve(tabId);
    });
  });
}

function getTabId() {
  return tabId;
}

export {
  getTabId,
  initializeTabId,
};
