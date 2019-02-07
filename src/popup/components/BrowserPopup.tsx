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
    let url = '';
    if (this.props.tab && this.props.tab.tabInfo) {
      url = this.props.tab.tabInfo.currentUrl;
    }
    return (
      <div>
        <span> Content script URL: {url} </span>
        <button onClick={this.props.increment}>increment</button>
      </div>
    );
  }
}
