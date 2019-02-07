import {IState} from '../reducer';

export const SET_CLONED_STATE = 'SET_CLONED_STATE';
export const SET_PATCHED_STATE = 'SET_PATCHED_STATE';

export function setClonedState(newState: IState) {
  return {
    type: SET_CLONED_STATE,
    payload: {
      newState,
    },
  };
}
