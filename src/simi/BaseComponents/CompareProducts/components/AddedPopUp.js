import Modal from 'react-modal';
import React from "react";
import { Check } from 'react-feather'
import '../styles.scss'

const AddedPopUp = ({ isOpen, setIsOpen }) => {
      Modal.setAppElement('#root')
      
      /*if(isOpen) {
          setTimeout(() => {
          setIsOpen(false)
        }, 3000)
      }*/

      return (
        <Modal
          isOpen={isOpen}
          portalClassName='added-pop-up-portal'
          className={{
            base: 'added-pop-up-content',
            afterOpen: 'added-pop-up-content-afterOpen',
            beforeClose: 'added-pop-up-content-beforeClose'
          }}
          overlayClassName={{
            base: 'added-pop-up-overlay',
            afterOpen: 'added-pop-up-overlay-afterOpen',
            beforeClose: 'added-pop-up-overlay-beforeClose'
          }}
          closeTimeoutMS={1000}
        >
          <div className='added-pop-up-success'>
            <div style={{width: '10%', marginRight: '10%'}}>
                <Check style={{color: 'green'}}></Check>
            </div>
            <div style={{width: '80%'}}>
                <p style={{textAlign: 'left'}}>Hello</p>
            </div>
          </div>
        </Modal>
      )
}

export default AddedPopUp