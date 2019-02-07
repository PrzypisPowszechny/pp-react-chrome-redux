import { combineReducers } from 'redux';
import {SET_CLONED_STATE} from './sync/actions';
import rootSyncReducer from './sync/root-reducer';
import tab, {ITabState} from './tab/reducer';

export interface IState {
  tab: ITabState;
}

const appReducer = combineReducers<ITabState>({
  tab,
});

export default rootSyncReducer(appReducer);
