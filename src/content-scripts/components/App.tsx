import React from 'react';
import { connect } from 'react-redux';
import Modal from './Modal/Modal';
import StateDisplay from '../../common/StateDisplay';
import { selectTab } from '../../common/store/selectors';

interface AppProps {
  editor: any;
  menuVisible: boolean;
  annotationModeWidgetVisible: boolean;
  requestModeWidgetVisible: boolean;
  notificationVisible: boolean;
}

@connect(
  state => ({
    tab: selectTab(state),
  }),
)
export default class App extends React.Component<Partial<AppProps>, {}> {

  constructor(props: AppProps) {
    super(props);
  }

  renderWidget() {
    return (
      <Modal>
        <div style={{ backgroundColor: 'white', padding: '100px' }}>
          <StateDisplay/>
        </div>
      </Modal>
    );
  }

  render() {
    console.log(this.props);
    return (
      <div>
        {this.props.tab.counter.widgetVisible && this.renderWidget()}
      </div>
    );
  }
}
