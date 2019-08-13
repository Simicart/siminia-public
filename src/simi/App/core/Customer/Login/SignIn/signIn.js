import React, { Component } from 'react';
import { bool, func, object } from 'prop-types';
import { Form } from 'informed';
import Field from 'src/components/Field';
import TextInput from 'src/components/TextInput';
import { isRequired } from 'src/util/formValidators';
import classes from './signIn.css';
import Identify from 'src/simi/Helper/Identify'
import {configColor} from 'src/simi/Config'
import TitleHelper from 'src/simi/Helper/TitleHelper'

class SignIn extends Component {
    static propTypes = {
        isGettingDetails: bool,
        onForgotPassword: func.isRequired,
        signIn: func
    };

    render() {
        return (
            <div className={classes.root}>
                {TitleHelper.renderMetaHeader({
                    title:Identify.__('Sign In')
                })}
                <Form
                    className={classes.form}
                    getApi={this.setFormApi}
                    onSubmit={() => this.onSignIn()}
                >
                    <Field label="Email" required={true}>
                        <TextInput
                            autoComplete="email"
                            field="email"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Field label="Password" required={true}>
                        <TextInput
                            autoComplete="current-password"
                            field="password"
                            type="password"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <div className={classes.signInButtonCtn}>
                        <button 
                            priority="high" className={classes.signInButton} type="submit" 
                            style={{backgroundColor: configColor.button_background, color: configColor.button_text_color}}>
                            {Identify.__('Sign In')}
                        </button>
                    </div>
                    <button
                        type="button"
                        className={classes.forgotPassword}
                        onClick={this.handleForgotPassword}
                    >
                        {Identify.__('Forgot password?')}
                    </button>
                </Form>
                <div className={classes.signInDivider} />
                <div className={classes.showCreateAccountButtonCtn}>
                    <button priority="high" className={classes.showCreateAccountButton} onClick={this.showCreateAccountForm} type="submit">
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
        const username = this.formApi.getValue('email');
        const password = this.formApi.getValue('password');
        this.props.onSignIn(username, password)
    }

    setFormApi = formApi => {
        this.formApi = formApi;
    };

    showCreateAccountForm = () => {
        this.props.showCreateAccountForm();
    };
}

export default SignIn;