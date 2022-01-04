import React from 'react';
import PlainOffline from './PlainOffline';

export const CheckMo = props => (
    <PlainOffline paymentCode="checkmo" {...props} />
);

export const COD = props => (
    <PlainOffline paymentCode="cashondelivery" {...props} />
);

export const BankTransfer = props => (
    <PlainOffline paymentCode="banktransfer" {...props} />
);

export const PaypalExpress = props => (
    <PlainOffline paymentCode="paypal_express" {...props} />
);
