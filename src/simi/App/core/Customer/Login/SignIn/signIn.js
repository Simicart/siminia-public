import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { Form } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from 'src/util/formValidators';
import Identify from 'src/simi/Helper/Identify';
import { configColor } from 'src/simi/Config';

require('./signIn.scss');

class SignIn extends Component {
    static propTypes = {
        isGettingDetails: bool,
        onForgotPassword: func.isRequired,
        signIn: func
    };

    render() {
        return (
            <div className='root sign-in-form'>
                <Form className='form' getApi={this.setFormApi} onSubmit={() => this.onSignIn()} >
                    <Field label={Identify.__("Email")} required={false} after={'*'} >
                        <TextInput
                            autoComplete="email"
                            field="email"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Field label={Identify.__("Password")} required={false} after={'*'} >
                        <TextInput
                            autoComplete="current-password"
                            field="password"
                            type="password"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <div className='signInButtonCtn'>
                        <button
                            priority="high" className='signInButton' type="submit"
                            style={{ backgroundColor: configColor.button_background, color: configColor.button_text_color }}>
                            {Identify.__('Sign In')}
                        </button>
                    </div>
                    <button
                        type="button"
                        className='forgotPassword'
                        onClick={this.handleForgotPassword}
                    >
                        {Identify.__('Forgot password?')}
                    </button>
                </Form>
                <div className='signInDivider' />
                <div className='showCreateAccountButtonCtn'>
                    <button priority="high" className='showCreateAccountButton' onClick={this.showCreateAccountForm} type="submit">
                        {Identify.__('Create an Account')}
                    </button>
                </div>
            </div>
        );
    }

    handleForgotPassword = () => {
        this.props.onForgotPassword();
    };

    onSignIn() {
        const email = this.formApi.getValue('email');
        const password = this.formApi.getValue('password');
        this.props.onSignIn({ email, password });
    }

    setFormApi = formApi => {
        this.formApi = formApi;
    };

    showCreateAccountForm = () => {
        this.props.showCreateAccountForm();
    };
}

export default SignIn;
