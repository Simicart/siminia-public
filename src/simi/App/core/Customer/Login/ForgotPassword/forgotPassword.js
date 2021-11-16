import React from 'react';
import { func, shape, string } from 'prop-types';
import Identify from 'src/simi/Helper/Identify';
import FormErrors from '@magento/venia-ui/lib/components/FormError';
import { useForgotPassword } from 'src/simi/talons/ForgotPassword/useForgotPassword';
import forgotPasswordOperations from './forgotPassword.gql';
import FormSubmissionSuccessful from './FormSubmissionSuccessful';
import ForgotPasswordForm from './ForgotPasswordForm';

require('./forgotPassword.scss');

const ForgotPassword = props => {
    const { initialValues, onCancel, history } = props;

    const talonProps = useForgotPassword({
        onCancel,
        ...forgotPasswordOperations
    });

    const {
        forgotPasswordEmail,
        formErrors,
        handleCancel,
        handleFormSubmit,
        hasCompleted,
        isResettingPassword
    } = talonProps;

    const children = hasCompleted ? (
        <FormSubmissionSuccessful email={forgotPasswordEmail} history={history} />
    ) : (
            <React.Fragment>
                <p className='instructions'>
                    {Identify.__('Enter your email below to receive a password reset link')}
                </p>
                <ForgotPasswordForm
                    initialValues={initialValues}
                    isResettingPassword={isResettingPassword}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel} />
                <div style={{ marginTop: '15px' }}>
                    <FormErrors errors={formErrors} />
                </div>
            </React.Fragment>
        );

    return <div className='forgot-password-root'>{children}</div>;
};

export default ForgotPassword;

ForgotPassword.propTypes = {
    classes: shape({
        instructions: string,
        root: string
    }),
    initialValues: shape({
        email: string
    }),
    onCancel: func
};

ForgotPassword.defaultProps = {
    onCancel: () => { }
};
