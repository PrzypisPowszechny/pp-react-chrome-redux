import React from 'react';
import {connect} from 'react-redux';

import '../css/popup.scss';
import StateDisplay from '../../common/StateDisplay';

export default class BrowserPopup extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  render() {
    console.log('render');
    return (
      <div>
        <StateDisplay/>
      </div>
    );
  }
}
