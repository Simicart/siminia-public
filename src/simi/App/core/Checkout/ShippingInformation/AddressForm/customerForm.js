import React, { Fragment } from 'react';
import { Form, Text } from 'informed';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { useCustomerForm } from 'src/simi/talons/CheckoutPage/ShippingInformation/AddressForm/useCustomerForm';

import { mergeClasses } from 'src/classify';
import { isRequired as oriIsRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from 'src/simi/BaseComponents/CheckboxInformed';
import Country from '@magento/venia-ui/lib/components/Country';
import { Message } from '@magento/venia-ui/lib/components/Field';
import Field from 'src/simi/BaseComponents/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Region from '@magento/venia-ui/lib/components/Region';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './customerForm.css';
import CustomerFormOperations from './customerForm.gql';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { isSimiCIMEnabled, getCIMConf, fullFillAddress } from 'src/simi/Helper/CIM'
import Identify from 'src/simi/Helper/Identify'

const isRequired = value => {
    return Identify.__(oriIsRequired(value));
}

const CustomerForm = props => {
    const { afterSubmit, classes: propClasses, onCancel, shippingData } = props;

    const talonProps = useCustomerForm({
        afterSubmit,
        ...CustomerFormOperations,
        onCancel,
        shippingData
    });
    const {
        formErrors,
        handleCancel,
        handleSubmit,
        hasDefaultShipping,
        initialValues,
        isLoading,
        isSaving,
        isUpdate
    } = talonProps;

    if (isLoading) {
        return (
            <LoadingIndicator>Fetching Customer Details...</LoadingIndicator>
        );
    }

    const classes = mergeClasses(defaultClasses, propClasses);

    const emailRow = !hasDefaultShipping ? (
        <div className={classes.email}>
            <Field id="email" label={Identify.__('Email')}>
                <TextInput
                    disabled={true}
                    field="email"
                    validate={isRequired}
                />
            </Field>
        </div>
    ) : null;

    const formMessageRow = !hasDefaultShipping ? (
        <div className={classes.formMessage}>
            <Message>
                {
                    Identify.__('The shipping address you enter will be saved to your address book and set as your default for future purchases.')
                }
            </Message>
        </div>
    ) : null;

    const cancelButton = isUpdate ? (
        <Button
            classes={{
                root_normalPriority: classes.submit
            }}
            disabled={isSaving}
            onClick={handleCancel}
            priority="normal"
        >
            {Identify.__('Cancel')}
        </Button>
    ) : null;

    const submitButtonText = !hasDefaultShipping
        ? Identify.__('Save and Continue')
        : isUpdate
            ? Identify.__('Update')
            : Identify.__('Add');

    const submitButtonProps = {
        classes: {
            root_normalPriority: classes.submit,
            root_highPriority: classes.submit_update
        },
        disabled: isSaving,
        priority: isUpdate ? 'high' : 'normal',
        type: 'submit'
    };

    const defaultShippingElement = hasDefaultShipping ? (
        <div className={classes.defaultShipping}>
            <Checkbox
                disabled={!!initialValues.default_shipping}
                id="default_shipping"
                field="default_shipping"
                label={Identify.__('Make this my default address')}
            />
        </div>
    ) : (
            <Text type="hidden" field="default_shipping" initialValue={true} />
        );

    const simiCIMenabled = isSimiCIMEnabled()

    return (
        <Fragment>
            <FormError errors={formErrors} />
            <Form
                className={classes.root}
                initialValues={initialValues}
                onSubmit={(values) => {
                    let isRegionTextField = false //by default it'd be select option
                    try {
                        const findInput = window.document
                            .getElementsByClassName(classes.root)[0]
                            .getElementsByClassName(classes.region_root)[0]
                            .getElementsByTagName('input')
                        if (findInput && findInput[0])
                            isRegionTextField = true
                    } catch (err) {
                        console.warn(err)
                    }
                    handleSubmit(fullFillAddress(values), isRegionTextField)
                }
                }
            >
                {formMessageRow}
                {emailRow}
                <div className={classes.firstname}>
                    <Field id="firstname" label={Identify.__('First Name')} required={true}>
                        <TextInput
                            disabled={!hasDefaultShipping}
                            field="firstname"
                            validate={isRequired}
                        />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field id="lastname" label={Identify.__('Last Name')} required={true}>
                        <TextInput
                            disabled={!hasDefaultShipping}
                            field="lastname"
                            validate={isRequired}
                        />
                    </Field>
                </div>
                <div className={classes.country}>
                    <Country validate={isRequired} />
                </div>
                {
                    (!simiCIMenabled || (simiCIMenabled && (getCIMConf('street') !== 3))) &&
                    <>
                        <div className={classes.street0}>
                            <Field id="street0" label={Identify.__('Street Address')}
                                required={!simiCIMenabled || (getCIMConf('street') === 1)}
                                >
                                <TextInput field="street[0]" validate={(!simiCIMenabled || (getCIMConf('street') === 1)) ? isRequired : false} />
                            </Field>
                        </div>
                        <div className={classes.street1}>
                            <Field id="street1" label={Identify.__('Street Address 2')}>
                                <TextInput field="street[1]" />
                            </Field>
                        </div>
                    </>
                }
                {
                    (!simiCIMenabled || (simiCIMenabled && (getCIMConf('city') !== 3))) &&
                    <div className={classes.city}>
                        <Field id="city" label="City"
                            required={!simiCIMenabled || (getCIMConf('city') === 1)}>
                            <TextInput field="city" validate={(!simiCIMenabled || (getCIMConf('city') === 1)) ? isRequired : false} />
                        </Field>
                    </div>
                }
                <div className={classes.region}>
                    <Region validate={isRequired} optionValueKey="id" classes={{ 'root': classes.region_root }} />
                </div>
                {
                    (!simiCIMenabled || (simiCIMenabled && (getCIMConf('zipcode') !== 3))) &&
                    <div className={classes.postcode}>
                        <Field id="postcode" label="ZIP / Postal Code">
                            <TextInput field="postcode" validate={getCIMConf('zipcode') === 1 ? isRequired : false} />
                        </Field>
                    </div>
                }
                {
                    (!simiCIMenabled || (simiCIMenabled && (getCIMConf('telephone') !== 3))) &&
                    <div className={classes.telephone}>
                        <Field id="telephone" label="Phone Number">
                            <TextInput field="telephone" validate={getCIMConf('telephone') === 1 ? isRequired : false} />
                        </Field>
                    </div>
                }
                {
                    (simiCIMenabled && (getCIMConf('company') !== 3)) &&
                    <div>
                        <Field id="company" label={Identify.__('Company')} className={classes.cimfield}>
                            <TextInput field="company" validate={getCIMConf('company') === 1 ? isRequired : false} />
                        </Field>
                    </div>
                }
                {defaultShippingElement}
                <div className={classes.buttons}>
                    {cancelButton}
                    <Button {...submitButtonProps}>{submitButtonText}</Button>
                </div>
            </Form>
        </Fragment>
    );
};

export default CustomerForm;

CustomerForm.defaultProps = {
    shippingData: {
        country: {
            code: 'US'
        },
        region: {
            id: null
        }
    }
};

CustomerForm.propTypes = {
    afterSubmit: func,
    classes: shape({
        root: string,
        field: string,
        email: string,
        firstname: string,
        lastname: string,
        country: string,
        street0: string,
        street1: string,
        city: string,
        region: string,
        postcode: string,
        telephone: string,
        buttons: string,
        submit: string,
        submit_update: string,
        formMessage: string,
        defaultShipping: string
    }),
    onCancel: func,
    shippingData: shape({
        city: string,
        country: shape({
            code: string.isRequired
        }).isRequired,
        default_shipping: bool,
        email: string,
        firstname: string,
        id: number,
        lastname: string,
        postcode: string,
        region: shape({
            id: number
        }).isRequired,
        street: arrayOf(string),
        telephone: string
    })
};
