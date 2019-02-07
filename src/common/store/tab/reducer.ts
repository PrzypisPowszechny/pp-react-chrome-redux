import {UPDATE_TAB_INFO} from './actions';

export interface ITabState {
  currentUrl: string;
}

const initialState = {
};

function reducer(state = initialState, action) {
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

export default reducer;
