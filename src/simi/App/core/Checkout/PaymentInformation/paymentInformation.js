import React from 'react';
import { shape, func, string, bool, instanceOf } from 'prop-types';

import { usePaymentInformation } from 'src/simi/talons/CheckoutPage/PaymentInformation/usePaymentInformation';
import CheckoutError from 'src/simi/talons/CheckoutPage/CheckoutError';
import Identify from 'src/simi/Helper/Identify'

import PaymentMethods from './paymentMethods';
import Summary from './summary';
import { mergeClasses } from 'src/classify';
import EditModal from './editModal';

import paymentInformationOperations from './paymentInformation.gql';

import defaultClasses from './paymentInformation.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import { CHECKOUT_STEP } from 'src/simi/talons/CheckoutPage/useCheckoutPage'

const PaymentInformation = props => {
    const {
        classes: propClasses,
        onSave,
        resetShouldSubmit,
        setCheckoutStep,
        shouldSubmit,
        checkoutError
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = usePaymentInformation({
        onSave,
        checkoutError,
        resetShouldSubmit,
        setCheckoutStep,
        shouldSubmit,
        ...paymentInformationOperations
    });

    const {
        doneEditing,
        handlePaymentError,
        handlePaymentSuccess,
        hideEditModal,
        isEditModalActive,
        isLoading,
        setDoneEditing,
        showEditModal
    } = talonProps;

    const editModal = isEditModalActive ? (
        <EditModal onClose={hideEditModal} />
    ) : null;

    //return payment methods Node to avoid rerender PaymentMethods (causes error on payment form)
    return (
        <React.Fragment>
            {isLoading ?
                <LoadingIndicator classes={{ root: classes.loading }}>
                    {Identify.__('Fetching Payment Information')}
                </LoadingIndicator> : ''}
            <div className={classes.root} style={{ display: isLoading ? 'none' : 'block' }}>
                <div className={classes.payment_info_container}>
                    <div style={{ display: doneEditing ? 'block' : 'none' }}>
                        <Summary onEdit={() => {
                            setCheckoutStep(CHECKOUT_STEP.PAYMENT);
                            resetShouldSubmit();
                            setDoneEditing();
                        }
                        } />
                    </div>
                    <div style={{ display: doneEditing ? 'none' : 'block' }}>
                        <PaymentMethods
                            onPaymentError={handlePaymentError}
                            onPaymentSuccess={handlePaymentSuccess}
                            resetShouldSubmit={resetShouldSubmit}
                            shouldSubmit={shouldSubmit}
                        />
                    </div>
                </div>
                {editModal}
            </div>
        </React.Fragment>
    );
};

export default PaymentInformation;

PaymentInformation.propTypes = {
    classes: shape({
        container: string,
        payment_info_container: string,
        review_order_button: string
    }),
    onSave: func.isRequired,
    checkoutError: instanceOf(CheckoutError),
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool
};
