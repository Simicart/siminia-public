import React from 'react';
import {paypalExpressStart, paypalPlaceOrder} from 'src/simi/Model/Payment';
import Loading from 'src/simi/BaseComponents/Loading';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify'
import {  getCartDetails, clearCartId } from 'src/actions/cart';

const PaypalExpress = props => {
    const setData = (data) => {
        if (data.errors) {
            if (data.errors.length) {
                data.errors.map(error => {
                    alert(error.message)
                });
                props.history.push('/')
            }
        } else {
            if (data.ppexpressapi &&
                data.ppexpressapi.url) {
                window.location.replace(data.ppexpressapi.url);
            }
        }
    }

    const placeOrderCallback = data => {
        if (data && data.order && data.order.invoice_number) {
            clearCartId()
            getCartDetails()
            props.history.push('/thankyou.html?order_increment_id='+data.order.invoice_number)
        } else {
            if (data.errors && data.errors.length) {
                data.errors.map(error => {
                    alert(error.message)
                });
            }
            props.toggleMessages([{ type: 'error', message: Identify.__('Payment Failed'), auto_dismiss: true }])
            props.history.push('/')
        }
    }

    if (props.cartId) {
        const token = Identify.findGetParameter('token')
        if (Identify.findGetParameter('placeOrder') && token) {
            paypalPlaceOrder(placeOrderCallback, {quote_id: props.cartId, token, simiSessId: ''})
        } else if (Identify.findGetParameter('paymentFaled')) {
            props.toggleMessages([{ type: 'error', message: Identify.__('Payment Failed'), auto_dismiss: true }])
            props.history.push('/')
        } else 
            paypalExpressStart(setData, {quote_id: props.cartId, simiSessId: ''})
    }
    return <Loading />
}


const mapDispatchToProps = {
    toggleMessages,
    getCartDetails
};

const mapStateToProps = ({ cart }) => {
    const { cartId } = cart
    return {
        cartId
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaypalExpress);
