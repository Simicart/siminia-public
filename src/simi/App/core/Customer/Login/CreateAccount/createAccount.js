import React from 'react';
import { shape, string } from 'prop-types';
import { Form } from 'informed';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { validators } from './validators';
import { configColor } from 'src/simi/Config';
import Identify from 'src/simi/Helper/Identify';

import { Redirect } from 'src/drivers';
import { useCreateAccount } from 'src/simi/talons/CreateAccount/useCreateAccount';
import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';

import { CREATE_ACCOUNT as CREATE_ACCOUNT_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { GET_CART_DETAILS as GET_CART_DETAILS_QUERY } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { GET_CUSTOMER as GET_CUSTOMER_QUERY } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { SIGN_IN as SIGN_IN_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { MERGE_CARTS as mergeCartsMutation } from '@magento/peregrine/lib/talons/SignIn/signIn.gql';

require('./createAccount.scss');

const CreateAccount = props => {
    const createAccountPageProps = useCreateAccountPage();

    const talonProps = useCreateAccount({
        queries: {
            createAccountQuery: CREATE_ACCOUNT_MUTATION,
            customerQuery: GET_CUSTOMER_QUERY
        },
        mutations: {
            createCartMutation: CREATE_CART_MUTATION,
            getCartDetailsQuery: GET_CART_DETAILS_QUERY,
            signInMutation: SIGN_IN_MUTATION,
            mergeCartsMutation
        },
        initialValues: createAccountPageProps.initialValues,
        onSubmit: createAccountPageProps.handleCreateAccount
    });

    const {
        errors,
        handleSubmit,
        isDisabled,
        isSignedIn,
        initialValues
    } = talonProps;

    const errorMessage = errors.length
        ? errors
            .map(({ message }) => message)
            .reduce((acc, msg) => msg + '\n' + acc, '')
        : null;

    if (isSignedIn) {
        return <Redirect to="/" />;
    }


    return (
        <Form
            className='root create-acc-form'
            initialValues={initialValues}
            onSubmit={handleSubmit}>
            <h3 className='lead'>{Identify.__('Check out faster, use multiple addresses, track orders and more by creating an account!')}</h3>
            <Field label={Identify.__("First Name")} required={false} after={'*'}>
                <TextInput
                    field="customer.firstname"
                    autoComplete="given-name"
                    validate={validators.get('firstName')}
                    validateOnBlur
                />
            </Field>
            <Field label={Identify.__("Last Name")} required={false} after={'*'} >
                <TextInput
                    field="customer.lastname"
                    autoComplete="family-name"
                    validate={validators.get('lastName')}
                    validateOnBlur
                />
            </Field>
            <Field label={Identify.__("Email")} required={false} after={'*'} >
                <TextInput
                    field="customer.email"
                    autoComplete="email"
                    validate={validators.get('email')}
                    validateOnBlur
                />
            </Field>
            <Field label={Identify.__("Password")} required={false} after={'*'} >
                <TextInput
                    field="password"
                    type="password"
                    autoComplete="new-password"
                    validate={validators.get('password')}
                    validateOnBlur
                />
            </Field>
            <Field label={Identify.__("Confirm Password")} required={false} after={'*'} >
                <TextInput
                    field="confirm"
                    type="password"
                    validate={validators.get('confirm')}
                    validateOnBlur
                />
            </Field>
            <div className='subscribe'>
                <Checkbox
                    field="subscribe"
                    label={Identify.__("Subscribe to news and updates")}
                />
            </div>
            <div className='error'>{errorMessage}</div>
            <div className='actions'>
                <button
                    priority="high" className='submitButton' type="submit"
                    style={{ backgroundColor: configColor.button_background, color: configColor.button_text_color }}>
                    {Identify.__('Submit')}
                </button>
            </div>
        </Form>
    );
}

CreateAccount.propTypes = {
    createAccountError: shape({
        message: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    })
}

CreateAccount.defaultProps = {
    initialValues: {}
};

export default CreateAccount;
