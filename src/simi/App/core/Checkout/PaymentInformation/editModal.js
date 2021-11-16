import React from 'react';
import { func, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';

import { useEditModal } from 'src/simi/talons/CheckoutPage/PaymentInformation/useEditModal';

import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import CreditCard from './creditCard';
import Identify from 'src/simi/Helper/Identify'
import Modal from 'react-responsive-modal'

import editModalOperations from './editModal.gql';

import defaultClasses from './editModal.css';

const EditModal = props => {
    const { classes: propClasses, onClose } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useEditModal({ onClose, ...editModalOperations });

    const {
        selectedPaymentMethod,
        isLoading,
        handleUpdate,
        handleClose,
        handlePaymentSuccess,
        handleDropinReady,
        updateButtonClicked,
        resetUpdateButtonClicked,
        handlePaymentError
    } = talonProps;

    const actionButtons = !isLoading ? (
        <div className={classes.actions_container}>
            <Button
                className={classes.cancel_button}
                onClick={handleClose}
                priority="normal"
                disabled={updateButtonClicked}
            >
                {'Cancel'}
            </Button>
            <Button
                className={classes.update_button}
                onClick={handleUpdate}
                priority="high"
                disabled={updateButtonClicked}
            >
                {'Update'}
            </Button>
        </div>
    ) : null;

    const paymentMethod =
        selectedPaymentMethod === 'braintree' ? (
            <div className={classes.body}>
                <CreditCard
                    onDropinReady={handleDropinReady}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    resetShouldSubmit={resetUpdateButtonClicked}
                    shouldSubmit={updateButtonClicked}
                />
                {actionButtons}
            </div>
        ) : (
            <div>{`${selectedPaymentMethod} is not supported for editing.`}</div>
        );

    return (
        <Portal>
            <Modal
                modalId="modal-editpayment"
                overlayId="modal-editpayment-overlay"
                open={true}
                onClose={handleClose}
                classNames={{ overlay: Identify.isRtl() ? "rtl-root-modal" : "" }}
            >
                <div className={classes.header}>
                    <span className={classes.header_text}>
                        {Identify.__('Edit Payment Information')}
                    </span>
                </div>
                {paymentMethod}
            </Modal>
        </Portal>
    );
};

export default EditModal;

EditModal.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        body: string,
        header: string,
        header_text: string,
        actions_container: string,
        cancel_button: string,
        update_button: string,
        close_button: string
    }),
    onClose: func.isRequired
};
