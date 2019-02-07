import {Store} from 'redux';
import {setClonedState} from './sync/actions';
import deepDiff from './sync/deepDiff/diff';
import patch from './sync/deepDiff/patch';
import _ from 'lodash';

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

  // Fields to overwrite in child class
  protected identity: string;
  protected patchedKeys: string[];

  constructor(store: Store<any>) {
    this.store = store;
    this.isSyncing = false;
    this.prevState = store.getState();
  }

  init() {
    chrome.runtime.onMessage.addListener(this.onMessage);
    this.unsubscribe = this.store.subscribe(this.onStoreChanged);
    this.cloneStore();
  }

  syncStore(newState) {
    this.isSyncing = true;
    this.store.dispatch(setClonedState(newState));
    this.isSyncing = false;
  }

  protected getPatchedKeys() {
    if (!this.patchedKeys) {
      throw new Error('patchedKeys not initialized');
    }
    return this.patchedKeys;
  }

  filterForApplicablePatch(diff: any[]) {
    const patchedKeys = this.getPatchedKeys();
    return diff.filter(item => _.includes(patchedKeys, item.key));
  }

  onMessage = (request, sender, sendResponse) => {
    switch (request.action) {
      case STORE_PATCH_PROPAGATE:
        if (request.initiator !== this.identity) {
          console.debug(`Received ${request.action} message from ${request.initiator}`);
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
      initiator: this.identity,
    };
  }

  handlePatch(request) {
    const filteredPatch = this.filterForApplicablePatch(request.patch);
    console.debug(filteredPatch);
    const newState = patch(this.store.getState(), filteredPatch);
    this.syncStore(newState);
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
  identity = CONTENT_SCRIPT_INITIATOR;
  patchedKeys = ['tab', 'runtime', 'storage'];

  cloneStore() {
    // TODO
  }

  propagateStoreChange(diff: any) {
    const message = this.getPatchMessage(diff);
    console.log(message);
    chrome.runtime.sendMessage(message);
  }
}


export class PopupStoreSync extends StoreSync {
  identity = POPUP_INITIATOR;
  patchedKeys = ['tab', 'runtime', 'storage'];

  cloneStore() {
    console.debug('Initiating store by cloning');
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id,
        {
          action: STORE_CLONE_REQUEST,
        }, ((response) => {
          Promise.resolve(response).then((response) => {
            if (response) {
              this.syncStore(response.state);
            } else {
              console.error(`Received no response for ${STORE_CLONE_REQUEST} message`);
            }
          });
        }));
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
  identity = BACKGROUND_INITIATOR;
  patchedKeys = ['runtime', 'storage'];

  cloneStore() {
  }

  propagateStoreChange(diff: any) {
  }


}
