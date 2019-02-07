import { combineReducers } from 'redux';
import makeSyncReducer from './sync/root-reducer';
import tab, {ITabState} from './tab/reducer';
import runtime, {IRuntimeState} from './runtime';

export interface IState {
  tab: ITabState;
  runtime: IRuntimeState;
}

const contentScriptReducer = combineReducers<IState>({
  tab,
  runtime,
});

const popupReducer = combineReducers<IState>({
  tab,
  runtime,
});

export interface IBackgroundState {
  runtime: IRuntimeState;
}

const backgroundReducer = combineReducers<IBackgroundState>({
  runtime,
});

export const syncContentScriptReducer = makeSyncReducer(contentScriptReducer);
export const syncPopupReducer = makeSyncReducer(popupReducer);
export const syncBackgroundReducer = makeSyncReducer(backgroundReducer);
