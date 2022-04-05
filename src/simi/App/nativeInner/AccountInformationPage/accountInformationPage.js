import React, { Fragment, Suspense, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import { Message } from '@magento/venia-ui/lib/components/Field';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './accountInformationPage.module.css';
import { Colorbtn } from 'src/simi/BaseComponents/Button';
import RadioCheckbox from 'src/simi/BaseComponents/RadioCheckbox';
import LeftMenu from '../../core/LeftMenu';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';

import CUSTOMER_UPDATE from 'src/simi/queries/customerUpdate.graphql';
import CUSTOMER_PASSWORD_UPDATE from 'src/simi/queries/customerPasswordUpdate.graphql';
import GET_CUSTOMER_QUERY from 'src/simi/queries/getCustomer.graphql';
// import { useAccountInformationPage } from '../../../talons/MyAccount/useAccountInformationPage';
import { useAccountInformationPage } from '../../../talons/MyAccount/useAccountInformationPage';

import { randomString } from '../../core/TapitaPageBuilder/CarefreeHorizontalScroll/randomString';
import { showToastMessage } from 'src/simi/Helper/Message';
import {
    isRequired,
    hasLengthAtLeast,
    validatePassword,
    isNotEqualToField,
    isEqualToField
} from '@magento/venia-ui/lib/util/formValidators';
import combine from '@magento/venia-ui/lib/util/combineValidators';

import RadioGroup from '@magento/venia-ui/lib/components/RadioGroup';
import Radio from '@magento/venia-ui/lib/components/RadioGroup/radio';
import Password from '../Password';
import Loader from '../Loader';
import AlertMessages from '../ProductFullDetail/AlertMessages';
import AccountInformationPageOperations from './accountInformationPage.gql.js';

const AccountInformationPage = props => {
    
    const talonProps = useAccountInformationPage({
        ...AccountInformationPageOperations
    });
    

    const classes = useStyle(defaultClasses, props.classes);
    const {
        handleCancel,
        formErrors,
        handleChangePassword,
        handleSubmit,
        initialValues,
        isDisabled,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode,
        isLoading,
        setAlertMsg,
        alertMsg
    } = talonProps;
    const { formatMessage } = useIntl();
    
    if(isLoading){
        return <Loader/>
    }
    const errorMessage = loadDataError ? (
        <Message>
            <FormattedMessage
                id={'accountInformationPage.errorTryAgain'}
                defaultMessage={
                    'Something went wrong. Please refresh and try again.'
                }
            />
        </Message>
    ) : null;

    const maybeNewPasswordField = shouldShowNewPassword ? ( 
            <div className={classes.inputContent}>
                <Password
                    fieldName="newPassword"
                    label={formatMessage({
                        id: 'accountInformationPage.newPassword',
                        defaultMessage: 'New Password'
                    })}
                    validate={combine([
                        isRequired,
                        [hasLengthAtLeast, 8],
                        validatePassword,
                        [isNotEqualToField, 'password']
                    ])}
                    isToggleButtonHidden={false}
                />
            </div>
    ) : null;
    const maybeChangePasswordButton = !shouldShowNewPassword ? (
        <div className={classes.changePasswordButtonContainer}>
            <LinkButton
                classes={classes.changePasswordButton}
                type="button"
                onClick={handleChangePassword}
            >
                <FormattedMessage
                    id={'accountInformationPage.changePassword'}
                    defaultMessage={'Change Password'}
                />
            </LinkButton>
        </div>
    ) : null;
    const passwordLabel = shouldShowNewPassword
        ? formatMessage({
              id: 'accountInformationPage.currentPassword',
              defaultMessage: 'Current Password'
          })
        : formatMessage({
              id: 'accountInformationPage.password',
              defaultMessage: 'Password'
          });
    let pageContent = null;
    if (!initialValues) {
        return fullPageLoadingIndicator;
    } else {
        const { customer } = initialValues;
        pageContent = (
            <React.Fragment>
                <h2 className={classes.titleEdit}>
                    <FormattedMessage
                        id={'accountInformationPage.titleEdit'}
                        defaultMessage={'Edit Account Information'}
                    />
                </h2>
                <Form
                    id="form-edit-profile"
                    initialValues={customer}
                    onSubmit={handleSubmit}
                >
                    <div className={classes.rowEditProfile}>
                        <div className={classes.mainEditColumn}>
                            <h4 className={classes.titleH4}>
                                <FormattedMessage
                                    id={
                                        'accountInformationPage.titleAccountInfo'
                                    }
                                    defaultMessage={'Account Information'}
                                />
                            </h4>
                            <div className={classes.inputContent}>
                                <Field
                                    label={formatMessage({
                                        id: 'accountInformationPage.labelFirstName',
                                        defaultMessage: 'First Name *'
                                    })}
                                    required={true}
                                >
                                    <TextInput
                                        mask={value => value && value.trim()}
                                        maskOnBlur={true}
                                        autoComplete="given-name"
                                        field="firstname"
                                        validate={isRequired}
                                        validateOnBlur
                                    />
                                </Field>
                            </div>
                            <div className={classes.inputContent}>
                                <Field
                                    label={formatMessage({
                                        id: 'accountInformationPage.labelLasttName',
                                        defaultMessage: 'Last Name *'
                                    })}
                                    required={true}
                                >
                                    <TextInput
                                        autoComplete="family-name"
                                        field="lastname"
                                        validate={isRequired}
                                        validateOnBlur
                                    />
                                </Field>
                            </div>
                            <div className={classes.inputContent}>
                                <Field
                                    label={formatMessage({
                                        id: 'accountInformationPage.labelEmail',
                                        defaultMessage: 'Email address *'
                                    })}
                                    required={true}
                                >
                                    <TextInput
                                        field="email"
                                        type="email"
                                        autoComplete="email"
                                        validate={isRequired}
                                        validateOnBlur
                                        disabled={true}
                                    />
                                </Field>
                            </div>
                            <div className={classes.inputContent}>
                                <Password
                                    label={passwordLabel}
                                    fieldName="password"
                                    validate={isRequired}
                                    autoComplete="current-password"
                                    isToggleButtonHidden={false}
                                />
                            </div>
                            {maybeNewPasswordField}

                            
                        </div>
                    </div>
                    {maybeChangePasswordButton}
                    <Colorbtn
                        text={formatMessage({
                            id: 'accountInformationPage.save',
                            defaultMessage: 'SAVE'
                        })}
                        className={classes.saveProfile}
                        type="submit"
                    />
                </Form>
            </React.Fragment>
        );
    }
    let topInsets = 0;
    let bottomInsets = 0;
    try {
        if (window.simicartRNinsets) {
            const simicartRNinsets = JSON.parse(window.simicartRNinsets);
            topInsets = parseInt(simicartRNinsets.top);
            bottomInsets = parseInt(simicartRNinsets.bottom);
        } else if (window.simpifyRNinsets) {
            const simpifyRNinsets = JSON.parse(window.simpifyRNinsets);
            topInsets = parseInt(simpifyRNinsets.top);
            bottomInsets = parseInt(simpifyRNinsets.bottom);
        }
    } catch (err) {}
    return (
        <div className={`${classes.root} container`}>
            <div style={{height:topInsets}}></div>
            <AlertMessages
                message={formatMessage({
                    id: 'accountInformationPage.save',
                    defaultMessage: 'You saved the account information.'
                })}
                setAlertMsg={setAlertMsg}
                alertMsg={alertMsg}
                status="success"
                topInsets={topInsets}
            />
            <div className={classes.wrapper}>
            
                <LeftMenu label="Account Information" />
                <div className={`${classes.container}`}>
                    <div className={classes.containerSub}>
                        <StoreTitle>
                            {formatMessage({
                                id: 'accountInformationPage.titleAccount',
                                defaultMessage: 'Account Information'
                            })}
                        </StoreTitle>
                        <h1 className={classes.heading}>
                            <FormattedMessage
                                id={'accountInformationPage.accountInformation'}
                                defaultMessage={'Account Information'}
                            />
                        </h1>
                        {errorMessage ? errorMessage : pageContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountInformationPage;
