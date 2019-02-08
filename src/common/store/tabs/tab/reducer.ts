import { UPDATE_TAB_INFO } from './actions';
import counter from './counter/index';
import { combineReducers } from 'redux';

export interface ITabState {
  currentUrl: string;
}

const initialState = {
  currentUrl: '',
};

function tabInfo(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TAB_INFO:
      console.log('tab info updated');
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

const combined = combineReducers({
  tabInfo,
  counter,
});

export default function(state, action) {
  const ret = combined(state, action);
  console.log('tab: ', ret);
  return ret;
}
