import React, { Fragment } from 'react';
import Country from '@magento/venia-ui/lib/components/Country';
import Region from '@magento/venia-ui/lib/components/Region';
import { FieldIcons } from '@magento/venia-ui/lib/components/Field';
import Field from 'src/simi/BaseComponents/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Select from '@magento/venia-ui/lib/components/Select';
import Identify from 'src/simi/Helper/Identify';
import { useSimiBillingAddress } from 'src/simi/talons/CheckoutPage/PaymentInformation/SimiPayments/useSimiBillingAddress';
import {
    GET_CUSTOMER_ADDRESSES,
    GET_CUSTOMER_CART_ADDRESS,
    SET_GUEST_EMAIL_ON_CART_BILLING
} from './SimiBillingAddress.gql';
import { isSimiCIMEnabled, getCIMConf } from 'src/simi/Helper/CIM';
import { validateEmail } from 'src/simi/Helper/Validation';
import { hasLengthAtLeast } from '@magento/venia-ui/lib/util/formValidators';

const SimiBillingAddress = props => {
    const {
        billingAddressFieldsClassName,
        initialValues,
        fieldClasses,
        shippingAddressCountry,
        isBillingAddressSame,
        isVirtual
    } = props;

    const talonProps = useSimiBillingAddress({
        queries: {
            getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES,
            getCustomerCartAddressQuery: GET_CUSTOMER_CART_ADDRESS
        },
        mutation: {
            setGuestEmailOnCartBilling: SET_GUEST_EMAIL_ON_CART_BILLING
        },
        initialValues,
        isBillingAddressSame
    });

    const {
        customerAddresses,
        isLoading,
        handleSelectAddress,
        selectedAddress,
        isSignedIn,
        handleSetGuestEmailOnCart,
        cartEmail
    } = talonProps;

    const savedAddressOptions = [{ label: 'New Address', value: -1 }];

    if (customerAddresses && customerAddresses.length) {
        customerAddresses.map(customerAddressItem => {
            const {
                id,
                firstname,
                lastname,
                street,
                postcode,
                city,
                country_code
            } = customerAddressItem;
            const addressLabel = `${firstname} ${lastname}, ${
                street[0]
            }, ${postcode}, ${city}, ${country_code}`;
            savedAddressOptions.push({ label: addressLabel, value: id });
        });
    }
    const simiCIMenabled = isSimiCIMEnabled();
    const isFieldRequired = value => {
        const FAILURE = { id: Identify.__('Is required.') };
        if (isBillingAddressSame) return;
        if (!value) return FAILURE;
        const stringValue = String(value).trim();
        const measureResult = hasLengthAtLeast(stringValue, null, 1);
        if (measureResult) return FAILURE;
    };

    const classes = fieldClasses;

    return (
        <div className={billingAddressFieldsClassName}>
            {isSignedIn && (
                <Field
                    classes={fieldClasses.saved_address_for_billing}
                    id="saved_address_for_billing"
                    label={Identify.__('Saved Address')}
                >
                    <Select
                        key={
                            'saved_address_for_billing' +
                            savedAddressOptions.length
                        }
                        classes={{}}
                        field="saved_address_for_billing"
                        items={savedAddressOptions}
                        onChange={e => handleSelectAddress(e.target.value)}
                        initialValue={selectedAddress}
                    />
                </Field>
            )}
            {//to save email to cart when cart is virtual (no shipping address with email before)
            isVirtual && !isSignedIn ? (
                <Field
                    classes={fieldClasses.simi_guest_email}
                    label={Identify.__('Email')}
                    required={true}
                >
                    <TextInput
                        field="simi_guest_email"
                        validate={value => {
                            if (value && validateEmail(value)) return;
                            return {
                                id: Identify.__('Your email is not valid')
                            };
                        }}
                        onBlur={e => handleSetGuestEmailOnCart(e.target.value)}
                        initialValue={cartEmail}
                    />
                </Field>
            ) : (
                ''
            )}
            {!isSignedIn ||
            (selectedAddress && parseInt(selectedAddress) === -1) ? (
                <Fragment>
                    <Field
                        classes={fieldClasses.first_name}
                        label={Identify.__('First Name')}
                        required={true}
                    >
                        <TextInput
                            field="firstName"
                            validate={isFieldRequired}
                            initialValue={initialValues.firstName}
                        />
                    </Field>
                    <Field
                        classes={fieldClasses.last_name}
                        label={Identify.__('Last Name')}
                        required={true}
                    >
                        <TextInput
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
                    {(!simiCIMenabled ||
                        (simiCIMenabled && getCIMConf('street') !== 3)) && (
                        <>
                            <Field
                                classes={fieldClasses.street1}
                                label={Identify.__('Street Address')}
                                required={
                                    !simiCIMenabled ||
                                    getCIMConf('street') === 1
                                }
                            >
                                <TextInput
                                    field="street1"
                                    validate={
                                        !simiCIMenabled ||
                                        getCIMConf('street') === 1
                                            ? isFieldRequired
                                            : false
                                    }
                                    initialValue={initialValues.street1}
                                />
                            </Field>
                            <Field
                                classes={fieldClasses.street2}
                                label={Identify.__('Street Address 2')}
                            >
                                <TextInput
                                    field="street2"
                                    initialValue={initialValues.street2}
                                />
                            </Field>
                        </>
                    )}
                    {(!simiCIMenabled ||
                        (simiCIMenabled && getCIMConf('city') !== 3)) && (
                        <Field
                            classes={fieldClasses.city}
                            label={Identify.__('City')}
                            required={
                                !simiCIMenabled || getCIMConf('city') === 1
                            }
                        >
                            <TextInput
                                field="city"
                                validate={
                                    !simiCIMenabled || getCIMConf('city') === 1
                                        ? isFieldRequired
                                        : false
                                }
                                initialValue={initialValues.city}
                            />
                        </Field>
                    )}
                    <Region
                        fieldInput="state"
                        fieldSelect="state"
                        classes={fieldClasses.state}
                        initialValue={initialValues.state}
                        validate={isFieldRequired}
                    />
                    {(!simiCIMenabled ||
                        (simiCIMenabled && getCIMConf('zipcode') !== 3)) && (
                        <Field
                            classes={fieldClasses.postal_code}
                            label={Identify.__('ZIP / Postal Code')}
                        >
                            <TextInput
                                field="postalCode"
                                validate={
                                    getCIMConf('zipcode') === 1
                                        ? isFieldRequired
                                        : false
                                }
                                initialValue={initialValues.postalCode}
                            />
                        </Field>
                    )}
                    {(!simiCIMenabled ||
                        (simiCIMenabled && getCIMConf('telephone') !== 3)) && (
                        <Field
                            classes={fieldClasses.phone_number}
                            label={Identify.__('Phone Number')}
                            required={getCIMConf('telephone') === 1}
                        >
                            <TextInput
                                field="phoneNumber"
                                validate={
                                    getCIMConf('telephone') === 1
                                        ? isFieldRequired
                                        : false
                                }
                                initialValue={initialValues.phoneNumber}
                            />
                        </Field>
                    )}
                    {simiCIMenabled && getCIMConf('company') !== 3 && (
                        <div className={classes.cimfield}>
                            <Field
                                id="company"
                                label={Identify.__('Company')}
                                required={getCIMConf('company') === 1}
                            >
                                <TextInput
                                    field="company"
                                    validate={
                                        getCIMConf('company') === 1
                                            ? isFieldRequired
                                            : false
                                    }
                                    initialValue={initialValues.company}
                                />
                            </Field>
                        </div>
                    )}
                </Fragment>
            ) : (
                ''
            )}
        </div>
    );
};
export default SimiBillingAddress;
