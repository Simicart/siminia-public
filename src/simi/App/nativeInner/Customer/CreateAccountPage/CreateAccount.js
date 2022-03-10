import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import { useCreateAccount } from '@magento/peregrine/lib/talons/CreateAccount/useCreateAccount';

import { useStyle } from '@magento/venia-ui/lib/classify';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import {
    hasLengthAtLeast,
    isRequired,
    validatePassword
} from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '../../Field';
import TextInput from '../../TextInput';
import defaultClasses from './createAccount.module.css';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Password from '../../Password';
import Identify from 'src/simi/Helper/Identify';
import { useWindowSize } from '@magento/peregrine';


const CreateAccount = props => {
    const talonProps = useCreateAccount({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });
    const lastOrderData = Identify.getDataFromStoreage(
        Identify.SESSION_STOREAGE,
        'simi_last_success_order_data'
    );
    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 450;
    const {
        errors,
        handleCancel,
        handleSubmit,
        isDisabled,
        initialValues
    } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const cancelButton = props.isCancelButtonHidden ? null : (
        <Button
            className={classes.cancelButton}
            disabled={isDisabled}
            type="button"
            priority="low"
            onClick={handleCancel}
        >
            <FormattedMessage
                id={'createAccount.cancelText'}
                defaultMessage={'Cancel'}
            />
        </Button>
    );

    const submitButton = (
        <Button
            className={classes.submitButton}
            disabled={isDisabled}
            type="submit"
            priority="high"
        >
            <FormattedMessage
                id={'createAccount.createAccountText'}
                defaultMessage={'Create an Account'}
            />
        </Button>
    );

    return (
        <Form
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {!isMobile ? <h2 className={classes.title}>
                <FormattedMessage
                    id={'createAccount.createAccountText'}
                    defaultMessage={'Create an Account'}
                />
            </h2> : null}
            <FormError errors={Array.from(errors.values())} />
            <Field
                label={!isMobile ? formatMessage({
                    id: 'createAccount.firstNameText',
                    defaultMessage: 'First Name'
                }): null}
            >
                <TextInput
                    field="customer.firstname"
                    autoComplete="given-name"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    initialValue={
                        lastOrderData &&
                        lastOrderData.cart &&
                        lastOrderData.cart.shipping_addresses &&
                        lastOrderData.cart.shipping_addresses[0] &&
                        lastOrderData.cart.shipping_addresses[0].firstname
                            ? lastOrderData.cart.shipping_addresses[0].firstname
                            : ''
                    }
                    placeholder="First Name"
                />
            </Field>
            <Field
                label={!isMobile ? formatMessage({
                    id: 'createAccount.lastNameText',
                    defaultMessage: 'Last Name'
                }): null}
            >
                <TextInput
                    field="customer.lastname"
                    autoComplete="family-name"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    initialValue={
                        lastOrderData &&
                        lastOrderData.cart &&
                        lastOrderData.cart.shipping_addresses &&
                        lastOrderData.cart.shipping_addresses[0] &&
                        lastOrderData.cart.shipping_addresses[0].lastname
                            ? lastOrderData.cart.shipping_addresses[0].lastname
                            : ''
                    }
                    placeholder="Last Name"
                />
            </Field>
            <Field
                label={!isMobile ? formatMessage({
                    id: 'createAccount.emailText',
                    defaultMessage: 'Email'
                }): null}
            >
                <TextInput
                    field="customer.email"
                    autoComplete="email"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    initialValue={
                        lastOrderData &&
                        lastOrderData.cart &&
                        lastOrderData.cart.email
                            ? lastOrderData.cart.email
                            : ''
                    }
                    placeholder="Email"

                />
            </Field>
            <Password
                autoComplete="new-password"
                fieldName="password"
                isToggleButtonHidden={false}
                label={!isMobile ? formatMessage({
                    id: 'createAccount.passwordText',
                    defaultMessage: 'Password'
                }): null}
                validate={combine([
                    isRequired,
                    [hasLengthAtLeast, 8],
                    validatePassword
                ])}
                validateOnBlur
                mask={value => value && value.trim()}
                maskOnBlur={true}
                placeholder="Password"

            />
            <div className={classes.subscribe}>
                <Checkbox
                    field="subscribe"
                    id="subscribe"
                    label={formatMessage({
                        id: 'createAccount.subscribeText',
                        defaultMessage: 'Subscribe to news and updates'
                    })}
                />
            </div>
            <div className={classes.actions}>
                {submitButton}
                {cancelButton}
            </div>
        </Form>
    );
};

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        lead: string,
        root: string,
        subscribe: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    isCancelButtonHidden: bool,
    onSubmit: func,
    onCancel: func
};

CreateAccount.defaultProps = {
    onCancel: () => {},
    isCancelButtonHidden: true
};

export default CreateAccount;
