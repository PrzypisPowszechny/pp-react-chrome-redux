import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal/Modal';
import StateDisplay from '../../common/StateDisplay';

interface AppProps {
  editor: any;
  menuVisible: boolean;
  annotationModeWidgetVisible: boolean;
  requestModeWidgetVisible: boolean;
  notificationVisible: boolean;
}

@connect(
  state => ({
    tab: state.tab,
  }),
)
export default class App extends React.Component<Partial<AppProps>, {}> {

  constructor(props: AppProps) {
    super(props);
  }

  renderWidget() {
    return (
      <Modal>
        <div style={{backgroundColor: 'white', padding: '100px'}}>
          <StateDisplay/>
        </div>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        {this.props.tab.counter.widgetVisible && this.renderWidget()}
      </div>
    );
  }
}
