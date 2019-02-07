import React from 'react';
import {connect} from 'react-redux';
import {
  increment,
  decrement,
  showWidget,
  hideWidget,
} from 'common/store/tab/counter';
import {updateUserName} from 'common/store/runtime';

@connect(
  state => ({
    tab: state.tab,
    runtime: state.runtime,
  }), {
    increment,
    decrement,
    showWidget,
    hideWidget,
    updateUserName,
  },
)
export default class StateDisplay extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  render() {
    let currentUrl = '';
    let amount = '';
    let userName = '';

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
    const runtime = this.props.runtime;
    if (runtime) {
      userName = runtime.userName;
    }
    return (
      <div>
        <span> Content script URL: {currentUrl} </span> <br/>
        <span> Counter amount: {amount} </span> <br/>
        <button onClick={() => this.props.increment()}>increment</button>
        <button onClick={() => this.props.decrement()}>decrement</button>
        <br/>
        <button onClick={() => this.props.showWidget()}>show counter in cs</button>
        <button onClick={() => this.props.hideWidget()}>hide counter in cs</button>
        <h3> runtime username </h3>
        <input type="text" value={userName} onChange={(e) => this.props.updateUserName(e.target.value)} />
      </div>
    );
  }
}
