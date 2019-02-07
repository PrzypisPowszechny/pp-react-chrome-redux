import {IState} from '../reducer';

export const SET_CLONED_STATE = 'SET_CLONED_STATE';
export const SET_PATCHED_STATE = 'SET_PATCHED_STATE';

// Different action names (though functionally the same) to highlight the differences in logs, Redux panels etc...
export function setClonedState(newState: IState) {
  return {
    type: SET_CLONED_STATE,
    payload: {
      newState,
    },
  };
}

export function setPatchedState(newState: IState) {
  return {
    type: SET_PATCHED_STATE,
    payload: {
      newState,
    },
  };
}
