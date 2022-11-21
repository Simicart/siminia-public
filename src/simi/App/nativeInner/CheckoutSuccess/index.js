import React from 'react';
import { mergeClasses } from 'src/classify';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Identify from 'src/simi/Helper/Identify';
import defaultClasses from './checkoutSuccess.module.css';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import ThankYouImage from 'src/simi/App/nativeInner/BaseComponents/Images/thank_you_image.png'
import { useWindowSize } from '@magento/peregrine';
import { ChevronRight } from 'react-feather'
import Icon from '@magento/venia-ui/lib/components/Icon';

const CheckoutSuccess = props => {

    const { formatMessage } = useIntl();

    // for 2 ways to get here
    let orderNumber =
        Identify.findGetParameter('lastOrderId') ||
        Identify.findGetParameter('orderNumber');
    const lastOrderId = Identify.getDataFromStoreage(
        Identify.LOCAL_STOREAGE,
        'simi_last_success_order_data_id'
    );
    if (!orderNumber && lastOrderId) {
        orderNumber = lastOrderId;
    }
    const classes = mergeClasses(defaultClasses, props.classes);
    const [{ isSignedIn }] = useUserContext();

    return (
        <div className={classes.root}>
            {TitleHelper.renderMetaHeader({
                title: formatMessage({ id: 'Thank you for your purchase' })
            })}
            <div className="container">
                <div className={classes.mainContainer}>
                    <h2 className={classes.heading}>
                        {formatMessage({ id: 'Thank you for your purchase' })}
                    </h2>
                    <div className={classes.orderNumber}>
                        {formatMessage({ id: 'Your order number is:' })}{' '}
                        {orderNumber}
                    </div>
                    <div className={classes.additionalText}>
                        {formatMessage({
                            id:
                                'You will also receive an email with the details and we will let you know when your order has shipped.'
                        })}
                    </div>
                </div>
                <div className={classes.actionsToolbar}>
                    <Link className={classes.continue} to="/">
                        <span>{formatMessage({ id: 'Continue Shopping' })}</span>
                    </Link>
                </div>
                {!isSignedIn ? (
                    <div className={classes.guest}>
                        <p>
                            {formatMessage({
                                id:
                                    'You can track your order status by creating an account.'
                            })}
                        </p>
                        <Link
                            className={
                                classes.continue + ' ' + classes.createAccount
                            }
                            to="/create-account"
                        >
                            <span>
                                {formatMessage({ id: 'Create an account' })}
                            </span>
                        </Link>
                    </div>
                ) : (
                    <div className={classes.actionsToolbar}>
                        <Link className={classes.continue} to={`/order-history/${orderNumber}`}>
                            <span>{formatMessage({ id: 'See order details' })}</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutSuccess;
