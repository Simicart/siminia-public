import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSignIn } from '@magento/peregrine/lib/talons/SignIn/useSignIn';

import { useStyle } from '@magento/venia-ui/lib/classify.js';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '../Field';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextInput from '../TextInput';
import defaultClasses from './signIn.module.css';
import { GET_CART_DETAILS_QUERY } from './signIn.gql';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import Password from '../Password';
import FormError from '@magento/venia-ui/lib/components/FormError/formError';
import { useWindowSize } from '@magento/peregrine';

const SignIn = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { setDefaultUsername, showCreateAccount, showForgotPassword } = props;
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 450;
    const { formatMessage } = useIntl();
    const talonProps = useSignIn({
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    });

    const {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy,
        setFormApi
    } = talonProps;
    const [labelEmail, setLabelEmail] = useState(false);
    const [labelPass, setLabelPass] = useState(false);

    if (isBusy) {
        return (
            <div className={classes.modal_active}>
                <LoadingIndicator>
                    <FormattedMessage
                        id={'signIn.loadingText'}
                        defaultMessage={'Signing In'}
                    />
                </LoadingIndicator>
            </div>
        );
    }

    const forgotPasswordClasses = {
        root: classes.forgotPasswordButton
    };

    return (
        <div className={classes.root}>
            {!isPhone ? (
                <span className={classes.title}>
                    <FormattedMessage
                        id={'signIn.titleText'}
                        defaultMessage={'Sign-in to Your Account'}
                    />
                </span>
            ) : null}
            <FormError errors={Array.from(errors.values())} />
            <Form
                getApi={setFormApi}
                className={classes.form}
                onSubmit={handleSubmit}
            >
                <Field
                // label={formatMessage({
                //     id: 'signIn.emailAddressText',
                //     defaultMessage: 'Email address'
                // }) }
                >
                    <TextInput
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                        placeholder="Email"
                    />
                </Field>
                <Password
                    fieldName="password"
                    // label={formatMessage({
                    //     id: 'signIn.passwordText',
                    //     defaultMessage: 'Password'
                    // })}
                    validate={isRequired}
                    placeholder="Password"
                    autoComplete="current-password"
                    isToggleButtonHidden={false}
                />
                <div className={classes.forgotPasswordButtonContainer}>
                    <LinkButton
                        classes={forgotPasswordClasses}
                        type="button"
                        onClick={handleForgotPassword}
                    >
                        <FormattedMessage
                            id={'signIn.forgotPasswordText'}
                            defaultMessage={'Forgot Password?'}
                        />
                    </LinkButton>
                </div>
                <div className={classes.buttonsContainer}>
                    <Button priority="high" type="submit">
                        <FormattedMessage
                            id={'signIn.signInText'}
                            defaultMessage={'Sign In'}
                        />
                    </Button>
                    {!isPhone ? (
                        <Button
                            priority="normal"
                            type="button"
                            onClick={handleCreateAccount}
                        >
                            <FormattedMessage
                                id={'signIn.createAccountText'}
                                defaultMessage={'Create an Account'}
                            />
                        </Button>
                    ) : (
                        <div className={classes.registerBtnContainer}>
                            <span>No Account? </span>
                            <span className={classes.registerBtn} onClick={handleCreateAccount}>
                                <FormattedMessage
                                    id={'Register'}
                                    defaultMessage={'Register'}
                                />
                            </span>
                        </div>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default SignIn;
SignIn.propTypes = {
    classes: shape({
        buttonsContainer: string,
        form: string,
        forgotPasswordButton: string,
        forgotPasswordButtonContainer: string,
        root: string,
        title: string
    }),
    setDefaultUsername: func,
    showCreateAccount: func,
    showForgotPassword: func
};
SignIn.defaultProps = {
    setDefaultUsername: () => {},
    showCreateAccount: () => {},
    showForgotPassword: () => {}
};
