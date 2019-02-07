import React from 'react';
import classNames from 'classnames';

interface ModalProps {
  onCloseModal: (e) => void;
}

import styles from './Modal.scss';

export default class Modal extends React.PureComponent<ModalProps> {
    handleContentClick = (e) => {
        e.stopPropagation();
    }

    render() {
        return (
            <div className={classNames(styles.modal)} onClick={this.props.onCloseModal}>
                <div className={styles.modalContent} onClick={this.handleContentClick}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
