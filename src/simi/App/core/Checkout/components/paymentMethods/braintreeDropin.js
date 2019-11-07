/**
 * @fileoverview This component uses the BrainTree Web Drop In to hook into Web
 * Payments and the Payment Request API to submit payments via BrainTree.
 *
 * @see
 *   https://github.com/braintree/braintree-web-drop-in
 *   https://braintree.github.io/braintree-web-drop-in/docs/current/index.html
 *   https://developers.braintreepayments.com/guides/drop-in/overview/javascript/v3
 *   https://developers.braintreepayments.com/guides/payment-method-nonce.
 *   https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#requestPaymentMethod.
 */

import React, { useEffect, useState } from 'react';
import { bool, func } from 'prop-types';
import { Util } from '@magento/peregrine';

import dropIn from 'braintree-web-drop-in';

require('./braintreeDropin.scss')

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();
const authorization = process.env.BRAINTREE_TOKEN;
const CONTAINER_ID = 'braintree-dropin-container';


/**
 * This BraintreeDropin component has two purposes which lend to its
 * implementation:
 *
 * 1) Mount and asynchronously create the dropin via the braintree api.
 * 2) On submission (triggered by a parent), request the payment nonce.
 */

const BraintreeDropin = props => {
    const { onError, onSuccess, shouldRequestPaymentNonce } = props;
    const [isError, setIsError] = useState(false);
    const [dropinInstance, setDropinInstance] = useState();

    useEffect(() => {
        let didClose = false;
        async function createDropinInstance() {
            try {
                const dropinInstance = await dropIn.create({
                    authorization,
                    container: `#${CONTAINER_ID}`,
                    card: {
                        overrides: {
                            fields: {
                                number: {
                                    maskInput: {
                                        // Only show last four digits on blur.
                                        showLastFour: true
                                    }
                                }
                            }
                        }
                    }
                });

                if (didClose) {
                    // If we get here but the form is closed we should teardown
                    // instead of trying to use the instance.
                    dropinInstance.teardown();
                } else {
                    setDropinInstance(dropinInstance);
                }
            } catch (err) {
                console.error(
                    `Unable to initialize Credit Card form (Braintree). \n${err}`
                );

                if (!didClose) {
                    // Error state used to render error view. If we got an error
                    // but we are closing the form we shouldn't try to update
                    // state.
                    setIsError(true);
                }
            }
        }

        // Initialize the dropin with a reference to the container mounted in
        // this component. We do this via onmount because we have to be sure
        // the container id has mounted per braintree's API.
        createDropinInstance();

        // If we close the form quickly after opening we may end up in a
        // semi-mounted state so we need a local variable to make sure we
        // behave correctly.
        return () => {
            didClose = true;
        };
    }, []);

    useEffect(() => {
        async function requestPaymentNonce() {
            try {
                const paymentNonce = await dropinInstance.requestPaymentMethod();
                onSuccess(paymentNonce);
            } catch (e) {
                // If payment details were missing or invalid but we have data
                // from a previous successful submission, use the previous data.
                const storedPayment = storage.getItem('paymentMethod');
                if (storedPayment) {
                    onSuccess(storedPayment.data);
                    return;
                }

                // An error occurred and we have no stored data.
                // BrainTree will update the UI with error messaging,
                // but signal that there was an error.
                console.error(`Invalid Payment Details. \n${e}`);
                onError();
            }
        }

        if (shouldRequestPaymentNonce) {
            requestPaymentNonce();
        }
    }, [dropinInstance, onError, onSuccess, shouldRequestPaymentNonce]);

    if (isError) {
        return (
            <span className='error'>
                There was an error loading payment options. Please try again
                later.
            </span>
        );
    }

    return (
        <div className='root'>
            <div id={CONTAINER_ID} />
        </div>
    );
};

BraintreeDropin.propTypes = {
    onError: func.isRequired,
    onSuccess: func.isRequired,
    shouldRequestPaymentNonce: bool
};

export default BraintreeDropin;
