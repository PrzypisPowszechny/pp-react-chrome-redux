import {Store} from 'redux';
// import deepDiff from 'react-chrome-redux/strategies/deepDiff/diff';
import {setClonedState} from './sync/actions';
import {updateTabInfo} from './tab/actions';

export const STORE_PATCH_PROPAGATE = 'STORE_PATCH_PROPAGATE';
export const STORE_CLONE_REQUEST = 'STORE_CLONE_REQUEST';

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
      //TODO
      const diff = {};
      // const diff = deepDiff(this.prevState, state);
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
        // TODO
        sendResponse(null);
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
            this.isSyncing = true;
            if (response) {
              this.store.dispatch(setClonedState(response.state));
            } else {
              console.error(`Received no response for ${STORE_CLONE_REQUEST} message`);
            }
            // this.store.dispatch(updateTabInfo({currentUrl: 'sdfdssdf'}));
            this.isSyncing = false;
          });
        }));
    });
  }

  propagateStoreChange(diff: any) {
    // TODO
  }

  onMessage = (request, sender, sendResponse) => {
    switch (request.action) {
      case STORE_PATCH_PROPAGATE:
        // TODO
        sendResponse(null);
        break;
      case STORE_CLONE_REQUEST:
        // TODO
    }
  }
}

export class BackgroundStoreSync extends StoreSync {
  cloneStore() {}

  propagateStoreChange(diff: any) {}
}
