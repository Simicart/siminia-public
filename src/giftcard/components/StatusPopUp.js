import Modal from 'react-modal';
import React from "react";
import { Check, AlertCircle } from 'react-feather'

const StatusPopUp = ({status, showStatus, setShowStatus}) => {
      Modal.setAppElement('#root')
      
      if(showStatus) {
          setTimeout(() => {
          setShowStatus(false)
        }, 3000)
      }

      return (
        <Modal
          isOpen={showStatus}
          portalClassName='status-pop-up-portal'
          className={{
            base: 'status-pop-up-content',
            afterOpen: 'status-pop-up-content-afterOpen',
            beforeClose: 'status-pop-up-content-beforeClose'
          }}
          overlayClassName={{
            base: 'status-pop-up-overlay',
            afterOpen: 'status-pop-up-overlay-afterOpen',
            beforeClose: 'status-pop-up-overlay-beforeClose'
          }}
          closeTimeoutMS={1000}
        >
          <div className={status.includes('was added') ? 'status-pop-up-success' : 'status-pop-up-error'}>
            <div style={{width: '10%', marginRight: '10%'}}>
                {status.includes('was added') ? (<Check style={{color: 'green'}}></Check>) : (<AlertCircle style={{color: 'red'}}></AlertCircle>)}
            </div>
            <div style={{width: '80%'}}>
                <p style={{textAlign: 'left'}}>{status}</p>
            </div>
          </div>
        </Modal>
      )
}

export default StatusPopUp