import React, { Fragment } from 'react';
import { Form } from 'informed';
import { func, shape, string, arrayOf } from 'prop-types';
import { useGuestForm } from 'src/simi/talons/CheckoutPage/ShippingInformation/AddressForm/useGuestForm';

import { mergeClasses } from 'src/classify';
import { isRequired as oriIsRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Country from '@magento/venia-ui/lib/components/Country';
import { Message } from '@magento/venia-ui/lib/components/Field';
import Field from 'src/simi/BaseComponents/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Region from '@magento/venia-ui/lib/components/Region';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './guestForm.css';
import GuestFormOperations from './guestForm.gql';
import { isSimiCIMEnabled, getCIMConf, fullFillAddress } from 'src/simi/Helper/CIM';
import Identify from 'src/simi/Helper/Identify';

const isRequired = value => {
    return Identify.__(oriIsRequired(value));
}

const GuestForm = props => {
    const { afterSubmit, classes: propClasses, onCancel, shippingData } = props;

    const talonProps = useGuestForm({
        afterSubmit,
        ...GuestFormOperations,
        onCancel,
        shippingData
    });
    const {
        formErrors,
        handleCancel,
        handleSubmit,
        initialValues,
        isSaving,
        isUpdate
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);

    const guestEmailMessage = !isUpdate ? (
        <Message>
            {
                Identify.__('Set a password at the end of guest checkout to create an account in one easy step.')
            }
        </Message>
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
            {'Cancel'}
        </Button>
    ) : null;

    const submitButtonText = isUpdate
        ? Identify.__('Update')
        : Identify.__('Save Address');

    const submitButtonProps = {
        classes: {
            root_normalPriority: classes.submit,
            root_highPriority: classes.submit_update
        },
        disabled: isSaving,
        priority: isUpdate ? 'high' : 'normal',
        type: 'submit'
    };

    const simiCIMenabled = isSimiCIMEnabled()

    return (
        <Fragment>
            <FormError errors={formErrors} />
            <Form
                className={classes.root}
                initialValues={initialValues}
                onSubmit={(values) => handleSubmit(fullFillAddress(values))}
            >
                <div className={classes.email}>
                    <Field id="email" label={Identify.__('Email')}>
                        <TextInput field="email" validate={isRequired} />
                        {guestEmailMessage}
                    </Field>
                </div>
                <div className={classes.firstname}>
                    <Field id="firstname" label={Identify.__('First Name')}>
                        <TextInput field="firstname" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field id="lastname" label={Identify.__('Last Name')}>
                        <TextInput field="lastname" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.country}>
                    <Country validate={isRequired} />
                </div>
                {
                    (!simiCIMenabled || (simiCIMenabled && (getCIMConf('street') !== 3))) &&
                    <>
                        <div className={classes.street0}>
                            <Field id="street0" label={Identify.__('Street Address')} required={!simiCIMenabled || (getCIMConf('street') === 1)}>
                                <TextInput field="street[0]" validate={(!simiCIMenabled || getCIMConf('street') === 1) ? isRequired : false} />
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
                        <Field id="city" label="City" required={!simiCIMenabled || (getCIMConf('city') === 1)}>
                            <TextInput field="city" validate={(!simiCIMenabled || getCIMConf('city') === 1) ? isRequired : false} />
                        </Field>
                    </div>
                }
                <div className={classes.region}>
                    <Region validate={isRequired} />
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
                    <div className={classes.cimfield}>
                        <Field id="company" label={Identify.__('Company')}>
                            <TextInput field="company" validate={getCIMConf('company') === 1 ? isRequired : false} />
                        </Field>
                    </div>
                }
                <div className={classes.buttons}>
                    {cancelButton}
                    <Button {...submitButtonProps}>{submitButtonText}</Button>
                </div>
            </Form>
        </Fragment>
    );
};

export default GuestForm;

GuestForm.defaultProps = {
    shippingData: {
        country: {
            code: 'US'
        },
        region: {
            code: ''
        }
    }
};

GuestForm.propTypes = {
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
        submit_update: string
    }),
    onCancel: func,
    shippingData: shape({
        city: string,
        country: shape({
            code: string.isRequired
        }).isRequired,
        email: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region: shape({
            code: string.isRequired
        }).isRequired,
        street: arrayOf(string),
        telephone: string
    })
};
