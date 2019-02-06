import React from 'react';
import { connect } from 'react-redux';

interface AppProps {
  editor: any;
  menuVisible: boolean;
  annotationModeWidgetVisible: boolean;
  requestModeWidgetVisible: boolean;
  notificationVisible: boolean;
}

@connect(
  state => ({
  }),
)
export default class App extends React.Component<Partial<AppProps>, {}> {

  constructor(props: AppProps) {
    super(props);
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}
