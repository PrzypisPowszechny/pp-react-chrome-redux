import {createActions, handleActions} from 'redux-actions';

const initialState = {
  amount: 0,
  widgetVisible: true,
};

const {increment, decrement, showWidget, hideWidget} = createActions({
  INCREMENT: (amount = 1) => ({amount}),
  DECREMENT: (amount = 1) => ({amount: -amount}),
  SHOW_WIDGET: () => ({widgetVisible: true}),
  HIDE_WIDGET: () => ({widgetVisible: false}),
});

const reducer = handleActions(
  {
    [increment]: (state, {payload: {amount}}) => {
      return {...state, amount: state.amount + amount};
    },
    [decrement]: (state, {payload: {amount}}) => {
      return {...state, amount: state.amount + amount};
    },
    [showWidget]: (state, {payload: {widgetVisible}}) => {
      return {...state, widgetVisible};
    },
    [hideWidget]: (state, {payload: {widgetVisible}}) => {
      return {...state, widgetVisible};
    },
  },
  initialState,
);

export {
  increment,
  decrement,
  showWidget,
  hideWidget,
};

export default reducer;
