import React from 'react';
import { default as PPbutons } from './PaypalButtons';

export const PaypalButtons = props => (
    <PPbutons paymentCode="paypal_express" {...props} />
);
