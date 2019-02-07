import React from 'react';
import {connect} from 'react-redux';
import {
  increment,
  decrement,
  showWidget,
  hideWidget,
} from 'common/store/tab/counter';

import '../css/popup.scss';

@connect(
  state => ({
    tab: state.tab,
  }), {
    increment,
    decrement,
    showWidget,
    hideWidget,
  },
)
export default class BrowserPopup extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  render() {
    console.log('render');
    let currentUrl = '';
    let amount = '';

    const tab = this.props.tab;
    if (tab) {
      const {
        tabInfo,
        counter,
      } = tab;
      if (tabInfo) {
        currentUrl = tabInfo.currentUrl;
      }
      if (counter) {
        amount = counter.amount;
      }
    }
    return (
      <div>
        <span> Content script URL: {currentUrl} </span>
        <span> Counter amount: {amount} </span>
        <button onClick={() => this.props.increment()}>increment</button>
        <button onClick={() => this.props.decrement()}>decrement</button>
        <button onClick={() => this.props.showWidget()}>show counter in cs</button>
        <button onClick={() => this.props.hideWidget()}>hide counter in cs</button>
      </div>
    );
  }
}
