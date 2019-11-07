import React from 'react';
import { shape, string } from 'prop-types';
import { Form } from 'informed';
import Checkbox from 'src/components/Checkbox';
import Field from 'src/components/Field';
import TextInput from 'src/components/TextInput';
import { validators } from './validators';
import {configColor} from 'src/simi/Config'
import Identify from 'src/simi/Helper/Identify'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import { createAccount } from 'src/simi/Model/Customer'
import {showToastMessage} from 'src/simi/Helper/Message';
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading';
require('./createAccount.scss')

const CreateAccount = props => {
    const { createAccountError } = props;
    const errorMessage = createAccountError && (Object.keys(createAccountError).length !== 0) ? Identify.__('An error occurred. Please try again.'):null
    let registeringEmail = null
    let registeringPassword = null

    const initialValues = () => {
        const { initialValues } = props;
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }

    const handleSubmit = values => {
        let params = {
            password : values.password,
            confirm_password : values.confirm,
            ...values.customer,
            news_letter : values.subscribe ? 1 : 0
        }
        showFogLoading()
        registeringEmail = values.customer.email
        registeringPassword = values.password
        createAccount(registerDone, params)
    };

    const registerDone = (data) => {
        hideFogLoading()
        if (data.errors) {
            console.log('nooo')
            let errorMsg = ''
            if (data.errors.length) {
                data.errors.map(error => {
                    errorMsg += error.message
                })
                showToastMessage(errorMsg)
            }
        } else {
            props.onSignIn(registeringEmail, registeringPassword)
        }
    }


    return (
        <React.Fragment>
            {TitleHelper.renderMetaHeader({
                title:Identify.__('Create Account')
            })}
            <Form
                className='root create-acc-form'
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <h3 className='lead'>
                    {`Check out faster, use multiple addresses, track
                            orders and more by creating an account!`}
                </h3>
                <Field label={Identify.__("First Name")} required={true}>
                    <TextInput
                        field="customer.firstname"
                        autoComplete="given-name"
                        validate={validators.get('firstName')}
                        validateOnBlur
                    />
                </Field>
                <Field label={Identify.__("Last Name")} required={true}>
                    <TextInput
                        field="customer.lastname"
                        autoComplete="family-name"
                        validate={validators.get('lastName')}
                        validateOnBlur
                    />
                </Field>
                <Field label={Identify.__("Email")} required={true}>
                    <TextInput
                        field="customer.email"
                        autoComplete="email"
                        validate={validators.get('email')}
                        validateOnBlur
                    />
                </Field>
                <Field label={Identify.__("Password")}>
                    <TextInput
                        field="password"
                        type="password"
                        autoComplete="new-password"
                        validate={validators.get('password')}
                        validateOnBlur
                    />
                </Field>
                <Field label={Identify.__("Confirm Password")}>
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
                        style={{backgroundColor: configColor.button_background, color: configColor.button_text_color}}>
                        {Identify.__('Submit')}
                    </button>
                </div>
            </Form>
        </React.Fragment>
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
