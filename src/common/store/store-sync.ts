import {Store} from 'redux';
import {setClonedState} from './sync/actions';
import deepDiff from './sync/deepDiff/diff';
import patch from './sync/deepDiff/patch';

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

  onMessage = (request, sender, sendResponse) => {
    throw new Error('not implemented');
  }

  cloneStore() {
    throw new Error('not implemented');
  }

  propagateStoreChange(diff: any) {
    throw new Error('not implemented');
  }

  onStoreChanged = () => {
    if (this.isSyncing) {
      console.debug('Redux state modified while patching; not propagating changes to other stores');
    } else {
      console.debug('Redux state modified; propagating changes to other stores');
      const state = this.store.getState();
      const diff = deepDiff(this.prevState, state);
      this.prevState = this.store.getState();
      this.propagateStoreChange(diff);
    }
  }

  destroy() {
    chrome.runtime.onMessage.removeListener(this.onMessage);
    this.unsubscribe();
  }
}

export class ContentScriptStoreSync extends StoreSync {
  cloneStore() {
    // TODO
  }

  propagateStoreChange(diff: any) {
    // TODO
  }

  onMessage = (request, sender, sendResponse) => {
    switch (request.action) {
      case STORE_PATCH_PROPAGATE:
        console.debug(`Received ${request.action} message from ${request.initiator}`);
        console.log(request.patch)
        const newState = patch(this.store.getState(), request.patch);
        this.syncStore(newState);
        break;
      case STORE_CLONE_REQUEST:
        sendResponse({
          state: this.store.getState(),
        });
        break;
    }
  }
}

export class PopupStoreSync extends StoreSync {
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
    const message = {
      action: STORE_PATCH_PROPAGATE,
      patch: diff,
      initiator: POPUP_INITIATOR,
    };

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });

    chrome.runtime.sendMessage(message);
  }

  onMessage = (request, sender, sendResponse) => {
    switch (request.action) {
      case STORE_PATCH_PROPAGATE:
        // TODO
        break;
      case STORE_CLONE_REQUEST:
        // TODO
    }
  }
}

export class BackgroundStoreSync extends StoreSync {

  cloneStore() {}

  propagateStoreChange(diff: any) {}

  onMessage = (request, sender, sendResponse) => {
    // switch (request.action) {
    //   case STORE_PATCH_PROPAGATE:
    //     console.debug(`Received a ${STORE_PATCH_PROPAGATE} message from ${request.initiator}`);
    //     if (request.initiator === POPUP_INITIATOR)
    //     chrome.runtime.sendMessage()
    //     break;
    //   case STORE_CLONE_REQUEST:
    //     // TODO
    // }
  }

}
