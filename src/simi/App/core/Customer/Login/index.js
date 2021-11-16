import React, { useEffect, useState } from 'react';
import defaultClasses from './login.scss';
import classify from 'src/classify';
import Identify from 'src/simi/Helper/Identify';
import SignIn from './SignIn';
import CreateAccount from './CreateAccount';
import ForgotPassword from './ForgotPassword';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import BackIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Back';
import { withRouter } from 'react-router-dom';
import TitleHelper from 'src/simi/Helper/TitleHelper'
import { toggleMessages, simiSignedIn } from 'src/simi/Redux/actions/simiactions';

import { useSignIn } from 'src/simi/talons/SignIn/useSignIn';
import { SIGN_IN as SIGN_IN_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { GET_CUSTOMER as GET_CUSTOMER_QUERY } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { CREATE_CART as CREATE_CART_MUTATION } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { GET_CART_DETAILS_QUERY } from './signIn.gql';
import { mergeCartsMutation } from './mergeCarts.gql';

const Login = props => {

    const [tabOpen, setTabOpen] = useState(1);      // 1: login page, 2: register, 3: forgot pass

    const {
        classes,
        history,
        toggleMessages
    } = props;

    const talonProps = useSignIn({
        createCartMutation: CREATE_CART_MUTATION,
        customerQuery: GET_CUSTOMER_QUERY,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        signInMutation: SIGN_IN_MUTATION,
        mergeCartsMutation
    });

    const {
        errors,
        handleSubmit
    } = talonProps;

    if (errors) {
        const messages = errors.map(value => {
            return { type: 'error', message: value.message, auto_dismiss: true }
        })
        toggleMessages(messages);
    }

    const stateForgot = history.location && history.location.state && history.location.state.forgot || false;

    const showForgotPasswordForm = () => {
        setTabOpen(3);
    };

    useEffect(() => {
        if (stateForgot) {
            showForgotPasswordForm()
        }
    }, [stateForgot]);

    const signInForm = () => {
        const className = tabOpen === 1 ? 'signIn_open' : 'signIn_closed';

        return (
            <div className={className}>
                <SignIn showCreateAccountForm={() => setTabOpen(2)} onForgotPassword={() => setTabOpen(3)} onSignIn={handleSubmit} />
            </div>
        );
    }

    const createAccountForm = () => {
        const className = tabOpen === 2 ? 'form_open' : 'form_closed';
        return <div className={className}>
            <CreateAccount onSignIn={handleSubmit} history={history} classes={classes} />
        </div>
    }

    const forgotPasswordForm = () => {
        const className = tabOpen == 3 ? 'form_open' : 'form_closed';
        return (
            <div className={className}>
                <ForgotPassword onCancel={hideForgotPasswordForm} history={history} />
            </div>
        );
    }

    const hideForgotPasswordForm = () => { };

    const title = tabOpen === 2 ? Identify.__('Create Account') : (tabOpen === 3 ? Identify.__('Forgot password') : Identify.__('Sign In'));

    return (
        <React.Fragment>
            {TitleHelper.renderMetaHeader({ title: title })}
            <div className='login-background'>
                <div className='login-container'>
                    <div className={`login-header ${(tabOpen === 2 || tabOpen === 3) ? 'has-back-btn' : ''}`}>
                        {(tabOpen === 2 || tabOpen === 3) &&
                            <div role="presentation" className='login-header-back' onClick={() => setTabOpen(1)}>
                                <BackIcon style={{ width: 20, height: 20 }} />
                            </div>}
                        <div className='login-header-title'>{title}</div>
                    </div>
                    {signInForm()}
                    {createAccountForm()}
                    {forgotPasswordForm()}
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = ({ user }) => {
    const { currentUser, isSignedIn, forgotPassword } = user;
    const { firstname, email, lastname } = currentUser;

    return {
        email,
        firstname,
        forgotPassword,
        isSignedIn,
        lastname,
    };
};

const mapDispatchToProps = {
    toggleMessages,
    simiSignedIn
};

export default compose(
    classify(defaultClasses),
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Login);
