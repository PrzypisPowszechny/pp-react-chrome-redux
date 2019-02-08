import React from 'react';
import ReactDOM from 'react-dom';
import store from '../../common/store/index';
import { Provider } from 'react-redux';
import App from '../components/App';

export default {
  init,
  deinit,
};

function init() {
  const documentContainer = document.createElement('div');
  documentContainer.id = 'pp-document-container';
  window.document.body.appendChild(documentContainer);

  console.log('state:', store.getState());

  // Wait until the store is connected to the background page before rendering
  console.debug('Store hydrated; rendering components');
  console.log('state:', store.getState());
  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    documentContainer,
  );
}

export function deinit() {
  // (todo) remove App component
}
