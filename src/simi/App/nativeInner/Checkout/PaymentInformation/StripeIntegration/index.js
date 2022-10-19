import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useStripeIntegration } from './useStripeIntegration';
import defaultClasses from './stripeIntegration.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import { useIntl, FormattedMessage } from 'react-intl';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Country from '@magento/venia-ui/lib/components/Country';
import Region from '@magento/venia-ui/lib/components/Region';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Identify from 'src/simi/Helper/Identify';
import { GET_SAVED_CARDS } from './stripeIntegration.gql';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { simiUseQuery as useQuery } from 'src/simi/Network/Query';
import Add from 'src/simi/BaseComponents/Icon/Add';
import Loading from 'src/simi/BaseComponents/Loading';
import Button from '@magento/venia-ui/lib/components/Button';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';

import CardSection from './CardSection';

const StripeIntegration = props => {

    const {
        classes: propClasses,
        onPaymentSuccess: onSuccess,
        onPaymentReady: onReady,
        onPaymentError: onError,
        resetShouldSubmit,
        shouldSubmit,
        paymentCode,
        placeOrderDisabled, // for stripe payment btn
        handleProceedOrder, // for stripe payment btn
        handleSavePaymentDone, // for stripe payment btn
    } = props;

    console.log(paymentCode)

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = useStripeIntegration({
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit,
        paymentCode,
        placeOrderDisabled,
        handleProceedOrder,
        handleSavePaymentDone
    });

    const {
        errors,
        isVirtual,
        isBillingAddressSame,
        /**
         * `stepNumber` depicts the state of the process flow in credit card
         * payment flow.
         *
         * `0` No call made yet
         * `1` Billing address mutation intiated
         * `2` Braintree nonce requsted
         * `3` Payment information mutation intiated
         * `4` All mutations done
         */
        stepNumber,
        initialValues,
        shippingAddressCountry,
        updatePaymentDetailsOnCart,
        ccMutationLoading
    } = talonProps;

    const creditCardComponentClassName = classes.credit_card_root;

    const billingAddressFieldsClassName = isBillingAddressSame
        ? classes.billing_address_fields_root_hidden
        : classes.billing_address_fields_root;

    /**
     * Instead of defining classes={root: classes.FIELD_NAME}
     * we are using useMemo to only do it once (hopefully).
     */
    const fieldClasses = useMemo(() => {
        return [
            'first_name',
            'last_name',
            'country',
            'street1',
            'street2',
            'city',
            'region',
            'postal_code',
            'phone_number'
        ].reduce((acc, fieldName) => {
            acc[fieldName] = { root: classes[fieldName] };

            return acc;
        }, {});
    }, [classes]);

     /**
     * These 2 functions are wrappers around the `isRequired` function
     * of `formValidators`. They perform validations only if the
     * billing address is different from shipping address.
     *
     * We write this function in `venia-ui` and not in the `peregrine` talon
     * because it references `isRequired` which is a `venia-ui` function.
     */
      const isFieldRequired = useCallback((value, { isBillingAddressSame }) => {
        if (isBillingAddressSame) {
            /**
             * Informed validator functions return `undefined` if
             * validation is `true`
             */
            return undefined;
        } else {
            return isRequired(value);
        }
    }, []);



    const [{ isSignedIn }] = useUserContext();
    const [selectedCard, setSelectedCard] = useState(0);

    let savedCards = [];
    const { data } = useQuery(GET_SAVED_CARDS, {
        fetchPolicy: 'no-cache',
        skip: !isSignedIn
    });

    if (data && data.simistripesavedcards) {
        savedCards = data.simistripesavedcards;
    }

    useEffect(() => {
        const originalCheckoutBtn = document.getElementById('place-order-btn');
        if (originalCheckoutBtn) {
            originalCheckoutBtn.style.display = "none";
        }
        return () => {
            hideFogLoading();
            const originalCheckoutBtn = document.getElementById('place-order-btn');
            if (originalCheckoutBtn) {
                originalCheckoutBtn.style.display = "block";
            }
        }
    })

    const cardOptions = useMemo(() => {
        const options = [];
        savedCards.map(savedCard => {
            const { brand, exp_month, exp_year, last4 } = savedCard;
            options.push(
                <div
                    key={savedCard.id}
                    role="presentation"
                    className={`${classes.stripe_saved_card_option} ${selectedCard === savedCard.id
                        ? classes.stripe_cardselected
                        : ''
                        }`}
                    onClick={() => {
                        setSelectedCard(savedCard.id);
                        Identify.storeDataToStoreage(
                            Identify.SESSION_STOREAGE,
                            'simi_stripe_js_integration_customer_data',
                            {
                                isSavedCard: true,
                                id: savedCard.id,
                                card: {
                                    brand,
                                    last4
                                }
                            }
                        );
                    }}
                >
                    <img src={require(`../Images/${brand}.svg`)} alt={brand} />
                    <span className={classes.stripe_card_brand}>
                        {formatMessage({
                            id: brand,
                            defaultMessage: brand
                        })}
                    </span>
                    <span className={classes.stripe_card_last4}>{last4}</span>
                    <div className={classes.stripe_card_exp}>
                        {formatMessage({
                            id: 'Ext.',
                            defaultMessage: 'Ext.'
                        })}{' '}
                        {exp_month}/{exp_year}
                    </div>
                </div>
            );
        });
        options.push(
            <div
                key={0}
                role="presentation"
                className={`${classes.stripe_saved_card_option} ${selectedCard === 0 ? classes.stripe_cardselected : ''
                    }`}
                onClick={() => setSelectedCard(0)}
            >
                <span className={classes.stripe_new_card_label}>
                    {formatMessage({
                        id: 'Use a new card',
                        defaultMessage: 'Use a new card'
                    })}
                </span>
                <Add className={classes.stripe_new_card_plus} />
            </div>
        );
        return (
            <div className={classes.stripe_saved_card_options}>{options}</div>
        );
    }, [savedCards, classes, selectedCard]);

    return (
        <div className={classes.root}>
            <div className={`${classes.stripe_element}`}>
                <div className={classes.stripe_checkout_form}>
                    {savedCards && savedCards.length ? (
                        cardOptions
                    ) : (
                        <div
                            className={classes.stripe_card_section}
                            style={{
                                display:
                                    selectedCard === 0 ? 'block' : 'none'
                            }}
                        >
                            <CardSection onBlur={() => { }} />
                            {/*
                            <div
                                style={{
                                    marginTop: 15,
                                    display: isSignedIn ? 'block' : 'none'
                                }}
                            >
                                <Checkbox
                                    label={formatMessage({
                                        id:
                                            ' Save card for future purchases',
                                        defaultMessage:
                                            ' Save card for future purchases'
                                    })}
                                    field="stripe_save_new_card"
                                />
                            </div>
                                */}
                        </div>
                    )}
                    {ccMutationLoading ? (
                        <div className={classes.savingData}>
                            <Loading />
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
            <div className={creditCardComponentClassName}>
                <FormError
                    classes={{ root: classes.formErrorContainer }}
                    errors={Array.from(errors.values())}
                />
                {!isVirtual && <div className={classes.address_check}>
                    <Checkbox
                        field="isBillingAddressSame"
                        label={formatMessage({
                            id: 'checkoutPage.billingAddressSame',
                            defaultMessage:
                                'Billing address same as shipping address'
                        })}
                        initialValue={initialValues.isBillingAddressSame}
                    />
                </div>}
                <div className={billingAddressFieldsClassName}>
                    <Field
                        id="firstName"
                        classes={fieldClasses.first_name}
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput
                            id="firstName"
                            field="firstName"
                            validate={isFieldRequired}
                            initialValue={initialValues.firstName}
                        />
                    </Field>
                    <Field
                        id="lastName"
                        classes={fieldClasses.last_name}
                        label={formatMessage({
                            id: 'global.lastName',
                            defaultMessage: 'Last Name'
                        })}
                    >
                        <TextInput
                            id="lastName"
                            field="lastName"
                            validate={isFieldRequired}
                            initialValue={initialValues.lastName}
                        />
                    </Field>
                    <Country
                        classes={fieldClasses.country}
                        validate={isFieldRequired}
                        initialValue={
                            /**
                             * If there is no initial value to start with
                             * use the country from shipping address.
                             */
                            initialValues.country || shippingAddressCountry
                        }
                    />
                    <Field
                        id="street1"
                        classes={fieldClasses.street1}
                        label={formatMessage({
                            id: 'global.streetAddress',
                            defaultMessage: 'Street Address'
                        })}
                    >
                        <TextInput
                            id="street1"
                            field="street1"
                            validate={isFieldRequired}
                            initialValue={initialValues.street1}
                        />
                    </Field>
                    <Field
                        id="street2"
                        classes={fieldClasses.street2}
                        label={formatMessage({
                            id: 'global.streetAddress2',
                            defaultMessage: 'Street Address 2'
                        })}
                        optional={true}
                    >
                        <TextInput
                            id="street2"
                            field="street2"
                            initialValue={initialValues.street2}
                        />
                    </Field>
                    <Field
                        id="city"
                        classes={fieldClasses.city}
                        label={formatMessage({
                            id: 'global.city',
                            defaultMessage: 'City'
                        })}
                    >
                        <TextInput
                            id="city"
                            field="city"
                            validate={isFieldRequired}
                            initialValue={initialValues.city}
                        />
                    </Field>
                    <Region
                        classes={fieldClasses.region}
                        initialValue={initialValues.region}
                        validate={isFieldRequired}
                        fieldInput={'region[label]'}
                        fieldSelect={'region[region_id]'}
                        optionValueKey={'id'}
                    />
                    <Postcode
                        classes={fieldClasses.postal_code}
                        validate={isFieldRequired}
                        initialValue={initialValues.postcode}
                    />
                    <Field
                        id="phoneNumber"
                        classes={fieldClasses.phone_number}
                        label={formatMessage({
                            id: 'global.phoneNumber',
                            defaultMessage: 'Phone Number'
                        })}
                    >
                        <TextInput
                            id="phoneNumber"
                            field="phoneNumber"
                            validate={isFieldRequired}
                            initialValue={initialValues.phoneNumber}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
};

StripeIntegration.defaultProps = {
    paymentCode: 'stripe_payments'
}


export default StripeIntegration;
