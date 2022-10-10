import React from 'react';
import CheckoutPage from './checkoutPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_dV96xrwkjOs0VMecmhtn0QWS00Fr2jJc3F'); //change to configuration field in the future

const CheckoutPageContainer = props => (
    <Elements stripe={stripePromise}>
        <CheckoutPage {...props} />
    </Elements>
);
export default CheckoutPageContainer;
