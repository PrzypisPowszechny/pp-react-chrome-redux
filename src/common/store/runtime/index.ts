import {createActions, handleActions} from 'redux-actions';

export interface IRuntimeState {
  userName: string;
}

const initialState = {
  userName: null,
};

const {updateUserName} = createActions({
  UPDATE_USER_NAME: (userName) => ({userName}),
});

const reducer = handleActions(
  {
    [updateUserName]: (state, {payload: {userName}}) => {
      console.log(userName);
      return {...state, userName};
    },
  },
  initialState,
);

export {
  updateUserName,
};

export default reducer;
