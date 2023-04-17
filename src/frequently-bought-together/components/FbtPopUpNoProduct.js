import React from 'react';
import Modal from 'react-modal';
import { X } from 'react-feather';
import { FormattedMessage } from 'react-intl';

const FbtPopUpNoProduct = ({ isOpen, setIsOpen, setOpenModalNoProduct }) => {
    return (
        <Modal
            isOpen={isOpen}
            bodyOpenClassName='fbt-pop-up-body'
            portalClassName='fbt-pop-up-portal'
            className={{
                base: 'fbt-pop-up-content',
                afterOpen: 'fbt-pop-up-content-afterOpen',
                beforeClose: 'fbt-pop-up-content-beforeClose'
            }}
            overlayClassName={{
                base: 'fbt-pop-up-overlay',
                afterOpen: 'fbt-pop-up-overlay-afterOpen',
                beforeClose: 'fbt-pop-up-overlay-beforeClose'
            }}
            closeTimeoutMS={500}>
            <div className='fbt-pop-up-no-product'>
                <button onClick={() => {
                    setIsOpen(false)
                    setTimeout(() => {
                        setOpenModalNoProduct(false)
                    }, 500)
                }} className='fbt-pop-up-close-button'>
                    <X size={18}></X>
                </button>
                <p style={{ fontSize: 16, marginTop: 10 }}>
                    <FormattedMessage id='Please select a product' defaultMessage='Please select a product'></FormattedMessage>
                </p>
                <button onClick={() => {
                    setIsOpen(false)
                    setTimeout(() => {
                        setOpenModalNoProduct(false)
                    }, 500)
                }} className='fbt-pop-up-ok-button'>
                    <FormattedMessage id='OK' defaultMessage='OK'></FormattedMessage>
                </button>
            </div>
        </Modal>
    )
}

export default FbtPopUpNoProduct