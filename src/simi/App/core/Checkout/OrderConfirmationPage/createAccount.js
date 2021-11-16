import React, { useCallback } from 'react';
import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import { useToasts } from '@magento/peregrine';
import { useCreateAccount } from 'src/simi/talons/CheckoutPage/OrderConfirmationPage/useCreateAccount';

import combine from '@magento/venia-ui/lib/util/combineValidators';
import { mergeClasses } from 'src/classify';
import {
    hasLengthAtLeast,
    isRequired as oriIsRequired,
    validatePassword
} from '@magento/venia-ui/lib/util/formValidators';

import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './createAccount.css';

import { CREATE_ACCOUNT as CREATE_ACCOUNT_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { GET_CART_DETAILS as GET_CART_DETAILS_QUERY } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { GET_CUSTOMER as GET_CUSTOMER_QUERY } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { SIGN_IN as SIGN_IN_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import Identify from 'src/simi/Helper/Identify';

const isRequired = value => {
    return Identify.__(oriIsRequired(value));
};

const CreateAccount = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const [, { addToast }] = useToasts();

    const onSubmit = useCallback(() => {
        // TODO: Redirect to account/order page when implemented.
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });

        addToast({
            type: 'info',
            message: 'Account successfully created.',
            timeout: 5000
        });
    }, [addToast]);

    const talonProps = useCreateAccount({
        queries: {
            createAccountQuery: CREATE_ACCOUNT_MUTATION,
            customerQuery: GET_CUSTOMER_QUERY
        },
        mutations: {
            createCartMutation: CREATE_CART_MUTATION,
            getCartDetailsQuery: GET_CART_DETAILS_QUERY,
            signInMutation: SIGN_IN_MUTATION
        },
        initialValues: {
            email: props.email,
            firstName: props.firstname,
            lastName: props.lastname
        },
        onSubmit
    });

    const { errors, handleSubmit, isDisabled, initialValues } = talonProps;

    // Map over any errors we get and display an appropriate error.
    const errorMessage = errors.length
        ? errors.map(({ message }) => message).join('\n')
        : null;

    return (
        <div className={classes.root}>
            <h2>{'Quick Checkout When You Return'}</h2>
            <p>
                {
                    'Set a password and save your information for next time in one easy step!'
                }
            </p>
            <Form
                className={classes.form}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <Field label="First Name">
                    <TextInput
                        field="customer.firstname"
                        autoComplete="given-name"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <Field label="Last Name">
                    <TextInput
                        field="customer.lastname"
                        autoComplete="family-name"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <Field label="Email">
                    <TextInput
                        field="customer.email"
                        autoComplete="email"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <Field label="Password">
                    <TextInput
                        field="password"
                        type="password"
                        autoComplete="new-password"
                        validate={combine([
                            isRequired,
                            [hasLengthAtLeast, 8],
                            validatePassword
                        ])}
                        validateOnBlur
                    />
                </Field>
                <div className={classes.subscribe}>
                    <Checkbox
                        field="subscribe"
                        label="Subscribe to news and updates"
                    />
                </div>
                <div className={classes.error}>{errorMessage}</div>
                <div className={classes.actions}>
                    <Button disabled={isDisabled} type="submit">
                        {'Create Account'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CreateAccount;

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        error: string,
        form: string,
        root: string,
        subscribe: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    onSubmit: func
};
