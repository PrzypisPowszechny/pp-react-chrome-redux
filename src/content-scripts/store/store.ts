import { applyMiddleware, compose, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import {IState, syncContentScriptReducer} from '../../common/store/reducer';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import {ContentScriptStoreSync} from '../../common/store/store-sync';

// TS override
declare global {
  interface Window { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any; }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [thunk, promise];

if (PPSettings.DEV) {
  const logger = createLogger();
  middlewares.push(logger);
}
const store: Store<IState> = createStore(
  syncContentScriptReducer,
  composeEnhancers(
    applyMiddleware(...middlewares),
  ),
);

export const storeSync = new ContentScriptStoreSync(store);

export default store;
