import { combineReducers } from 'redux';
import rootSyncReducer from './sync/root-reducer';
import tab, {ITabState} from './tab/reducer';

export interface IState {
  tab: ITabState;
}

const appReducer = combineReducers<IState>({
  tab,
});

export default rootSyncReducer(appReducer);
