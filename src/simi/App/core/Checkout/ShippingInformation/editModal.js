import React from 'react';
import { object, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';
import { useEditModal } from 'src/simi/talons/CheckoutPage/ShippingInformation/useEditModal';

import { mergeClasses } from 'src/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import AddressForm from './AddressForm';
import defaultClasses from './editModal.css';
import Modal from 'react-responsive-modal';
import Identify from 'src/simi/Helper/Identify'

const EditModal = props => {
    const { classes: propClasses, shippingData } = props;
    const talonProps = useEditModal();
    const { handleClose, isOpen } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);

    // Unmount the form to force a reset back to original values on close
    const bodyElement = isOpen ? (
        <AddressForm
            afterSubmit={handleClose}
            onCancel={handleClose}
            shippingData={shippingData}
        />
    ) : null;

    return (
        <Portal>
            <Modal
                modalId="modal-editaddress"
                overlayId="modal-editaddress-overlay"
                open={isOpen}
                onClose={handleClose}
                classNames={{ overlay: Identify.isRtl() ? "rtl-root-modal" : "" }}
            >
                <div className={classes.header}>
                    <span className={classes.headerText}>
                        {Identify.__('Edit Shipping Address')}
                    </span>
                </div>
                <div className={classes.body} style={{direction: Identify.isRtl() ? 'rtl' : 'ltr'}}>{bodyElement}</div>
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
        headerText: string
    }),
    shippingData: object
};
