import React from 'react';
import { connect } from 'react-redux';

import '../css/popup.scss';

@connect(
  state => ({
    tab: state.tab,
  })
)
export default class BrowserPopup extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {
    };
  }

  render() {
    console.log('render');
    const url = (this.props.tab ||{}).currentUrl;
    return (
      <div>
        {this.props.tab &&
          <span> Content script URL: {url} </span>
        }
      </div>
    );
  }
}
