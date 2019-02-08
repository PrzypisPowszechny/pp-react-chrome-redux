import { combineReducers } from 'redux';
import tab, { ITabState } from './tabs/tab/reducer';
import tabs from './tabs/reducer';
import runtime, { IRuntimeState } from './runtime';

export interface IState {
  tabs: {
    [tabId: number]: ITabState,
  };
  runtime: IRuntimeState;
}

export default combineReducers<IState>({
  tabs,
  runtime,
});
