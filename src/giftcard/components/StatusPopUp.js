import Modal from 'react-modal';
import React from "react";
import '../styles/status-pop-up.css'
import { Check } from 'react-feather'
import { AlertCircle } from 'react-feather';

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
          portalClassName='status-portal'
          className={{
            base: 'status-content',
            afterOpen: 'status-content-afterOpen',
            beforeClose: 'status-content-beforeClose'
          }}
          overlayClassName={{
            base: 'status-overlay',
            afterOpen: 'status-overlay-afterOpen',
            beforeClose: 'status-overlay-beforeClose'
          }}
          closeTimeoutMS={1000}
        >
          <div className={status.includes('was added') ? 'successPopUp' : 'errorPopUp'}>
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