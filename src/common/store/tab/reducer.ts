import {UPDATE_TAB_INFO} from './actions';
import counter from './counter';
import {combineReducers} from 'redux';

export interface ITabState {
  currentUrl: string;
}

const initialState = {
};

function tabInfo(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TAB_INFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default combineReducers({
  tabInfo,
  counter,
});
