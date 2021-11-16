import React, { useEffect } from 'react';
import { shape, string } from 'prop-types';
import { Form } from 'informed';
import Identify from 'src/simi/Helper/Identify';
import { useToasts } from '@magento/peregrine';
import { useResetPassword } from 'src/simi/talons/ResetPassword/useResetPassword';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Button from '@magento/venia-ui/lib/components/Button';
import FormErrors from '@magento/venia-ui/lib/components/FormError';
import resetPasswordOperations from './resetPassword.gql';
import defaultClasses from './resetPassword.css';
import Password from 'src/simi/BaseComponents/Password';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import {
    hasLengthAtLeast,
    isRequired,
    validatePassword
} from '@magento/venia-ui/lib/util/formValidators';

require('./style.scss');
const PAGE_TITLE = Identify.__('Reset Password');

const ResetPassword = props => {
    const { classes: propClasses } = props;
    const classes = mergeClasses(defaultClasses, propClasses);
    const talonProps = useResetPassword({
        ...resetPasswordOperations
    });
    const {
        hasCompleted,
        loading,
        email,
        token,
        formErrors,
        handleSubmit
    } = talonProps;

    const tokenMissing = (
        <div className={'invalidTokenContainer'}>
            <div className={'invalidToken'}>
                {Identify.__('Uh oh, something went wrong. Check the link or try again.')}
            </div>
        </div>
    );

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasCompleted) {
            addToast({
                type: 'info',
                message: Identify.__('Your new password has been saved.'),
                timeout: 5000
            });
        }
    }, [addToast, hasCompleted]);

    const recoverPassword = hasCompleted ? (
        <div className='successMessageContainer'>
            <div className='successMessage'>
                {Identify.__('Your new password has been saved. Please use this password to sign into your Account.')}
            </div>
        </div>
    ) : (
            <Form className={'rpass-form-container'} onSubmit={handleSubmit}>
                <div className={'rpass-form-description'}>{Identify.__('Please enter your new password')}</div>
                <Password
                    classes={{ root: classes.password }}
                    fieldName={'password'}
                    isToggleButtonHidden={false}
                    className={'rpass-newPassword'}
                    placeholder={Identify.__('New Password')}
                    validate={combine([
                        isRequired,
                        [hasLengthAtLeast, 8],
                        validatePassword
                    ])}
                    validateOnBlur
                />
                <Button
                    className={'submitButton'}
                    type="submit"
                    priority="high"
                    disabled={loading}
                >
                    {Identify.__('SAVE')}
                </Button>
                <FormErrors
                    classes={{ root: classes.errorMessage }}
                    errors={formErrors}
                />
            </Form>
        );

    return (
        <div className={'reset-password-page'}>
            {TitleHelper.renderMetaHeader({ title: PAGE_TITLE })}
            <div className="reset-password-customer">
                <div className="rpass-heading">
                    <span>{Identify.__('Reset Password')}</span>
                </div>
                <div className="rpass-form-wrap">
                    {token && email ? recoverPassword : tokenMissing}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

ResetPassword.propTypes = {
    classes: shape({
        container: string,
        description: string,
        errorMessage: string,
        heading: string,
        invalidToken: string,
        invalidTokenContainer: string,
        password: string,
        root: string,
        submitButton: string,
        successMessage: string,
        successMessageContainer: string
    })
};
