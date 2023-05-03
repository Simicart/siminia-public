import Modal from 'react-modal';
import React from "react";
import { Check } from 'react-feather'
import '../styles/styles.scss'

const MessagePopUp = ({ isOpen }) => {
  Modal.setAppElement('#root')

  const showInfo = JSON.parse(localStorage.getItem("changeList"))

  return (
    <Modal
      isOpen={isOpen}
      portalClassName='message-pop-up-portal'
      className={{
        base: 'message-pop-up-content',
        afterOpen: 'message-pop-up-content-afterOpen',
        beforeClose: 'message-pop-up-content-beforeClose'
      }}
      overlayClassName={{
        base: 'message-pop-up-overlay',
        afterOpen: 'message-pop-up-overlay-afterOpen',
        beforeClose: 'message-pop-up-overlay-beforeClose'
      }}
      closeTimeoutMS={1000}
    >
      <div className='message-pop-up-success'>
        <div style={{ width: '10%', marginRight: '5%' }}>
          <Check style={{ color: 'green' }}></Check>
        </div>
        <div style={{ width: '85%' }}>
          <p style={{ textAlign: 'left' }}>{showInfo.type === 'add' ? (`You have add ${showInfo.value} to Comparison List`) :
            (showInfo.type === 'remove' ? `You have remove ${showInfo.value} from Comparison List` :
              'You have remove all products from Comparison List')}</p>
        </div>
      </div>
    </Modal>
  )
}

export default MessagePopUp