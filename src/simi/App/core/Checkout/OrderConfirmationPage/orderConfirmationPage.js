import React, { useEffect } from 'react';
import { object, shape, string } from 'prop-types';
import { useOrderConfirmationPage } from 'src/simi/talons/CheckoutPage/OrderConfirmationPage/useOrderConfirmationPage';

import { mergeClasses } from 'src/classify';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Identify from 'src/simi/Helper/Identify';
import CreateAccount from './createAccount';
import ItemsReview from '../ItemsReview';
import defaultClasses from './orderConfirmationPage.css';

const OrderConfirmationPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { data, orderNumber } = props;

    const talonProps = useOrderConfirmationPage({
        data
    });

    const { flatData, isSignedIn } = talonProps;

    const {
        city,
        country,
        email,
        firstname,
        lastname,
        postcode,
        region,
        shippingMethod,
        street
    } = flatData;

    const streetRows =
        street && street.length
            ? street.map((row, index) => {
                  return (
                      <span key={index} className={classes.addressStreet}>
                          {row}
                      </span>
                  );
              })
            : [];

    useEffect(() => {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const createAccountForm = !isSignedIn ? (
        <CreateAccount
            firstname={firstname}
            lastname={lastname}
            email={email}
        />
    ) : null;

    return (
        <div className={classes.root}>
            {TitleHelper.renderMetaHeader({
                title: Identify.__('Thank you for your purchase!')
            })}
            <div className={classes.mainContainer}>
                <h2 className={classes.heading}>
                    {Identify.__('Thank you for your purchase!')}
                </h2>
                <div
                    className={classes.orderNumber}
                >{`Order Number: ${orderNumber}`}</div>
                {city && (
                    <>
                        <div className={classes.shippingInfoHeading}>
                            {Identify.__('Shipping Information')}
                        </div>
                        <div className={classes.shippingInfo}>
                            <span className={classes.email}>{email}</span>
                            <span
                                className={classes.name}
                            >{`${firstname} ${lastname}`}</span>
                            {streetRows}
                            <span
                                className={classes.addressAdditional}
                            >{`${city}, ${region} ${postcode} ${country}`}</span>
                        </div>
                        <div className={classes.shippingMethodHeading}>
                            {Identify.__('Shipping Method')}
                        </div>
                        <div className={classes.shippingMethod}>
                            {shippingMethod}
                        </div>
                        <div className={classes.itemsReview}>
                            <ItemsReview data={data} />
                        </div>
                    </>
                )}
                <div className={classes.additionalText}>
                    {Identify.__(
                        'You will also receive an email with the details and we will let you know when your order has shipped.'
                    )}
                </div>
            </div>
            {/** error on css also not on any design - so remove temporarily
            <div className={classes.sidebarContainer}>{createAccountForm}</div> 
            */}
        </div>
    );
};

export default OrderConfirmationPage;

OrderConfirmationPage.propTypes = {
    classes: shape({
        addressStreet: string,
        mainContainer: string,
        heading: string,
        orderNumber: string,
        shippingInfoHeading: string,
        shippingInfo: string,
        email: string,
        name: string,
        addressAdditional: string,
        shippingMethodHeading: string,
        shippingMethod: string,
        itemsReview: string,
        additionalText: string,
        sidebarContainer: string
    }),
    data: object,
    orderNumber: string
};
