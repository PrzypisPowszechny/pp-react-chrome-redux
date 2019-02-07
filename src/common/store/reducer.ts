import { combineReducers } from 'redux';
import makeSyncReducer from './sync/root-reducer';
import tab, {ITabState} from './tab/reducer';

export interface IState {
  tab: ITabState;
}

const contentScriptReducer = combineReducers<IState>({
  tab,
});

const popupReducer = combineReducers<IState>({
  tab,
});

const backgroundReducer = combineReducers<IState>({
});

export const syncContentScriptReducer = makeSyncReducer(contentScriptReducer);
export const syncPopupReducer = makeSyncReducer(popupReducer);
export const syncBackgroundReducer = makeSyncReducer(backgroundReducer);
