import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ForgotPasswordForm from './ForgotPasswordForm';
import FormSubmissionSuccessful from './FormSubmissionSuccessful';
import TitleHelper from 'src/simi/Helper/TitleHelper'
import Identify from 'src/simi/Helper/Identify'
import {forgotPassword} from 'src/simi/Model/Customer'
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import {showToastMessage} from 'src/simi/Helper/Message';

require('./forgotPassword.scss');

class ForgotPassword extends Component {

    state  = {resetSubmited: false}

    static propTypes = {
        classes: PropTypes.shape({
            instructions: PropTypes.string
        }),
        onClose: PropTypes.func.isRequired
    };

    handleFormSubmit = ({ email }) => {
        showFogLoading()
        forgotPassword(this.resetSubmited, email)
    }

    resetSubmited = (data) => {
        hideFogLoading()
        if (data && !data.errors) {
            let text = '';
            if (data.message) {
                const messages = data.message;
                for (const i in messages) {
                    const message = messages[i];
                    text += message + ' ';
                }
            }
            this.successMessage = text
            this.setState({ resetSubmited: true})
        } else {
            let messages = ''
            data.errors.map(value => {
                messages +=  value.message
            })
            showToastMessage(messages)
            this.setState({ resetSubmited: false})
        }
    }

    handleContinue = () => {
        this.setState({resetSubmited: false})
        if (this.props.onClose)
            this.props.onClose();
    };

    render() {
        const { email } = this.props;
        const {resetSubmited} = this.state

        if (resetSubmited) {
            return (
                <FormSubmissionSuccessful
                    email={email}
                    onContinue={this.handleContinue}
                    successMessage={this.successMessage}
                />
            );
        }

        return (
            <Fragment>
                {TitleHelper.renderMetaHeader({
                    title:Identify.__('Forgot password')
                })}
                <p className='instructions'>
                    {Identify.__('Enter your email below to receive a password reset link')}
                </p>
                <ForgotPasswordForm
                    onSubmit={this.handleFormSubmit}
                />
            </Fragment>
        );
    }
}

export default ForgotPassword;
