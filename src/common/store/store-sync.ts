import {Store} from 'redux';
import {setClonedState, setPatchedState} from './sync/actions';
import deepDiff from './sync/deepDiff/diff';
import patch from './sync/deepDiff/patch';
import _ from 'lodash';
import {promisify} from 'util';

export const STORE_PATCH_PROPAGATE = 'STORE_PATCH_PROPAGATE';
export const STORE_CLONE_REQUEST = 'STORE_CLONE_REQUEST';

export const CONTENT_SCRIPT_INITIATOR = 'CONTENT_SCRIPT_INITIATOR';
export const POPUP_INITIATOR = 'POPUP_INITIATOR';
export const BACKGROUND_INITIATOR = 'BACKGROUND_INITIATOR';

export default abstract class StoreSync {

  protected store: Store<any>;
  protected unsubscribe: () => void;
  protected isSyncing: boolean;
  protected prevState: any;
  protected id: any;

  // Fields to overwrite in child class
  protected identityType: string;
  protected patchedKeys: string[];

  constructor(store: Store<any>) {
    this.store = store;
    this.isSyncing = false;
    this.prevState = store.getState();
  }

  init() {
    chrome.runtime.onMessage.addListener(this.onMessage);
    this.unsubscribe = this.store.subscribe(this.onStoreChanged);

    return this.getTabId()
      .then((tabId) => {
        console.log('ID', tabId);
      this.id = `${this.identityType}: ${tabId || 0}`;
    })
      .then(() => this.cloneStore());
  }

  getTabId() {
    // meaningful only for content scripts; 0 otherwise
    if (this.identityType !== CONTENT_SCRIPT_INITIATOR) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({action: 'GET_TAB_ID'}, (response) => resolve(response));
    });
  }

  syncStore(newState, patchAction = false) {
    this.isSyncing = true;
    if (patchAction) {
      this.store.dispatch(setPatchedState(newState));
    } else {
      this.store.dispatch(setClonedState(newState));
    }
    this.isSyncing = false;
  }

  protected getPatchedKeys() {
    if (!this.patchedKeys) {
      throw new Error('patchedKeys not initialized');
    }
    return this.patchedKeys;
  }

  filterForApplicablePatch(diff: any[]): any[] {
    const patchedKeys = this.getPatchedKeys();
    return diff.filter(item => _.includes(patchedKeys, item.key));
  }

  onMessage = (request, sender, sendResponse) => {
    console.debug(`Received ${request.action} message from ${request.initiatorId}`);
    switch (request.action) {
      case STORE_PATCH_PROPAGATE:
        if (request.initiatorId !== this.id) {
          console.debug(request.patch);
          this.handlePatch(request);
        }
        break;
      case STORE_CLONE_REQUEST:
        sendResponse({
          state: this.store.getState(),
        });
        break;
    }
  }

  cloneStore() {
    throw new Error('not implemented');
  }

  propagateStoreChange(diff: any) {
    throw new Error('not implemented');
  }

  getPatchMessage(diff: any) {
    return {
      action: STORE_PATCH_PROPAGATE,
      patch: diff,
      initiatorId: this.id,
      initiatorType: this.identityType,
    };
  }

  getCloneMessage() {
    return {
      action: STORE_CLONE_REQUEST,
      initiatorId: this.id,
      identityType: this.identityType,
    };
  }

  handleCloneResponse = (response) => {
    if (response) {
      this.syncStore(response.state);
    } else {
      throw new Error(`Received no response for ${STORE_CLONE_REQUEST} message`);
    }
  }

  handlePatch(request) {
    const filteredPatch = this.filterForApplicablePatch(request.patch);
    console.debug('Filtered patch: ', filteredPatch);
    const newState = patch(this.store.getState(), filteredPatch);
    this.syncStore(newState, true);
  }

  onStoreChanged = () => {
    if (this.isSyncing) {
      console.debug('Redux state modified while patching; not propagating changes to other stores');
    } else {
      console.debug('Redux state modified; propagating changes to other stores');
      const state = this.store.getState();
      const diff = deepDiff(this.prevState, state);
      console.debug('propagating diff: ', diff);
      this.propagateStoreChange(diff);
    }
    this.prevState = this.store.getState();
  }

  destroy() {
    chrome.runtime.onMessage.removeListener(this.onMessage);
    this.unsubscribe();
  }
}

export class ContentScriptStoreSync extends StoreSync {
  identityType = CONTENT_SCRIPT_INITIATOR;
  patchedKeys = ['tab', 'runtime', 'storage'];

  cloneStore() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        this.getCloneMessage(),
        (response) => {
          this.handleCloneResponse(response);
          resolve();
        },
      );
    });
  }

  propagateStoreChange(diff: any) {
    const message = this.getPatchMessage(diff);
    console.log(message);
    chrome.runtime.sendMessage(message);
  }
}

export class PopupStoreSync extends StoreSync {
  identityType = POPUP_INITIATOR;
  patchedKeys = ['tab', 'runtime', 'storage'];

  cloneStore() {
    console.debug('Initiating store by cloning');
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        this.getCloneMessage(),
        this.handleCloneResponse,
      );
    });
  }

  propagateStoreChange(diff: any) {
    const message = this.getPatchMessage(diff);

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });

    chrome.runtime.sendMessage(message);
  }
}

export class BackgroundStoreSync extends StoreSync {
  identityType = BACKGROUND_INITIATOR;
  patchedKeys = ['runtime', 'storage'];

  init() {
    super.init();
    chrome.runtime.onMessage.addListener(this.passMessage);
  }

  destroy() {
    super.destroy();
    chrome.runtime.onMessage.removeListener(this.passMessage);
  }

  passMessage = (request, sender, sendResponse) => {
    // pass messages from content script to other content scripts
    switch (request.action) {
      case STORE_PATCH_PROPAGATE:
        console.debug(`Received a ${STORE_PATCH_PROPAGATE} message from ${request.initiatorId}`);
        if (request.initiatorType === CONTENT_SCRIPT_INITIATOR) {
          chrome.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
              chrome.tabs.sendMessage(tab.id, request);
            }
          });
        }
        break;
    }
  }


  cloneStore() {

  }

  propagateStoreChange(diff: any) {
    const message = this.getPatchMessage(diff);
    console.log(message);
    chrome.runtime.sendMessage(message);
  }

}
