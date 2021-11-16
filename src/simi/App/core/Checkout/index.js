import React from 'react'
import CheckoutPage from './checkoutPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe("pk_test_Z3X36vfqOKCKaA2ebWBMEz1Z00mTu55m4w"); //change to configuration field in the future

const CheckoutPageContainer = props => (
    <Elements stripe={stripePromise}>
        <CheckoutPage {...props} />
    </Elements>
)
export default CheckoutPageContainer