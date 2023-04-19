import React from 'react';
import Modal from 'react-modal';
import { X } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { removeAllProductsFromComparisonList, removeProductFromComparisonList } from "../functions";

const RemovePopUp = ({ isOpen, setIsOpen, setOpenRemovePopUp, removeType, index }) => {
    return (
        <Modal
            isOpen={isOpen}
            bodyOpenClassName='remove-pop-up-body'
            portalClassName='remove-pop-up-portal'
            className={{
                base: 'remove-pop-up-content',
                afterOpen: 'remove-pop-up-content-afterOpen',
                beforeClose: 'remove-pop-up-content-beforeClose'
            }}
            overlayClassName={{
                base: 'remove-pop-up-overlay',
                afterOpen: 'remove-pop-up-overlay-afterOpen',
                beforeClose: 'remove-pop-up-overlay-beforeClose'
            }}
            closeTimeoutMS={500}>
            <div className='remove-pop-up-wrapper'>
                <button onClick={() => {
                    setIsOpen(false)
                    setTimeout(() => {
                        setOpenRemovePopUp(false)
                    }, 500)
                }} className='remove-pop-up-close-button'>
                    <X size={18}></X>
                </button>
                <p style={{ fontSize: 16, marginTop: 10 }}>
                    {removeType === 'single' ? (<FormattedMessage id='Are you sure you want to remove this item from your Compare Products List?'
                        defaultMessage='Are you sure you want to remove this item from your Compare Products List?'></FormattedMessage>)
                        : (<FormattedMessage id='Are you sure you want to remove all items from your Compare Products List?'
                            defaultMessage='Are you sure you want to remove all items from your Compare Products List?'></FormattedMessage>)}
                </p>
                <div className='remove-pop-up-btn'>
                    <button onClick={() => {
                        setIsOpen(false)
                        setTimeout(() => {
                            setOpenRemovePopUp(false)
                        }, 500)
                    }} className='remove-pop-up-cancel-button'>
                        <FormattedMessage id='Cancel' defaultMessage='Cancel'></FormattedMessage>
                    </button>
                    <button onClick={() => {
                        setIsOpen(false)
                        setTimeout(() => {
                            setOpenRemovePopUp(false)
                        }, 500)
                        if (removeType === 'single') {
                            removeProductFromComparisonList(index)
                        }
                        else {
                            removeAllProductsFromComparisonList()
                        }
                    }} className='remove-pop-up-ok-button'>
                        <FormattedMessage id='OK' defaultMessage='OK'></FormattedMessage>
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default RemovePopUp