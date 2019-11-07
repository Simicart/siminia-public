import React from 'react';
import {  func, shape, string } from 'prop-types';
import Button from 'src/components/Button';
import { getOrderInformation, getAccountInformation } from 'src/selectors/checkoutReceipt';
import { connect } from 'src/drivers';
import actions from 'src/actions/checkoutReceipt';
import { hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import Identify from 'src/simi/Helper/Identify';
import TitleHelper from 'src/simi/Helper/TitleHelper'

require('./thankyou.scss')

const Thankyou = props => {
    hideFogLoading()
    const {  history, order } = props;


    const hasOrderId = () => {
        return (order && order.id) ||  Identify.findGetParameter('order_increment_id');
    }

    const handleViewOrderDetails = () => {
        if (!hasOrderId()) {
            history.push('/');
            return;
        }
        const padOrderId = (order && order.id) ? Identify.PadWithZeroes(order.id, 9) : Identify.findGetParameter('order_increment_id')
        const orderId = '/orderdetails.html/' + padOrderId;
        const orderLocate = {
            pathname: orderId,
            state: {
                orderData: {
                    increment_id: padOrderId
                }
            }
        }
        history.push(orderLocate);
    }

    return (
        <div className="container" style={{ marginTop: 40 }}>
            {TitleHelper.renderMetaHeader({
                title:Identify.__('Thank you for your purchase!')
            })}
            <div className="root">
                <div className="body">
                    <h2 className='header'>{Identify.__('Thank you for your purchase!')}</h2>
                    <div className='textBlock'>{Identify.__('You will receive an order confirmation email with order status and other details.')}</div>
                    <div className='textBlock'>{Identify.__('You can also visit your account page for more information.')}</div>
                    <Button onClick={handleViewOrderDetails}>
                        {Identify.__('View Order Details')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

Thankyou.propTypes = {
    order: shape({
        id: string
    }).isRequired,
    createAccount: func.isRequired,
    reset: func.isRequired,
    user: shape({
        /* isSignedIn: bool */
        email: string
    })
};

Thankyou.defaultProps = {
    order: {},
    reset: () => { },
    createAccount: () => { }
};

const { reset } = actions;

const mapStateToProps = state => ({
    order: getOrderInformation(state),
    user: getAccountInformation(state)
});

const mapDispatchToProps = {
    reset
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Thankyou);
