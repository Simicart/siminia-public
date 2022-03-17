import React, { Fragment, Suspense } from 'react';
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

import CUSTOMER_UPDATE from 'src/simi/queries/customerUpdate.graphql';
import CUSTOMER_PASSWORD_UPDATE from 'src/simi/queries/customerPasswordUpdate.graphql';
import GET_CUSTOMER_QUERY from 'src/simi/queries/getCustomer.graphql';
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
import Loader from '../Loader'
import AlertMessages from '../ProductFullDetail/AlertMessages';

const AccountInformationPage = props => {
    const { history } = props;

    let defaultForm = false;
    if (
        history.location.state &&
        history.location.state.hasOwnProperty('profile_edit') &&
        history.location.state.profile_edit
    ) {
        defaultForm = history.location.state.profile_edit;
    }
    const { formatMessage } = useIntl();
    const onSubmit = () => {
        <AlertMessages
                message={formatMessage({
                    id: 'accountInformationPage.save',
                    defaultMessage: 'You saved the account information.'
                })}
                setAlertMsg={setAlertMsg}
                alertMsg={alertMsg}
                status="success"
            />
        return;
        
    }
    const talonProps = useAccountInformationPage({
        defaultForm,
        updateCustomerMutation: CUSTOMER_UPDATE,
        updateCustomerPasswordMutation: CUSTOMER_PASSWORD_UPDATE,
        customerQuery: GET_CUSTOMER_QUERY,
        onSubmit: onSubmit
    });

    const classes = useStyle(defaultClasses, props.classes);
    const {
        isSignedIn,
        initialValues,
        handleUpdateInfo,
        errors,
        isActiveForm,
        handleActiveForm,
        isLoading,
        setAlertMsg,
        alertMsg
    } = talonProps;
    const errorMessage = errors ? (
        <Message>
            <FormattedMessage
                id={'accountInformationPage.errorTryAgain'}
                defaultMessage={
                    'Something went wrong. Please refresh and try again.'
                }
            />
        </Message>
    ) : null;
    if(isLoading){
        return <Loader/>
    }
    

    let pageContent = null;
    if (!initialValues) {
        return fullPageLoadingIndicator;
    } else {
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
                    initialValues={initialValues}
                    onSubmit={handleUpdateInfo}
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
                                        id: 'global.labelFirstName',
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
                                        id: 'global.labelLasttName',
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
                                        id: 'global.labelEmail',
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
                                    label={formatMessage({
                                        id: 'accountInfo.currentPassword',
                                        defaultMessage: 'Current Password'
                                    })}
                                    fieldName="password"
                                    validate={isRequired}
                                    autoComplete="current-password"
                                    isToggleButtonHidden={false}
                                />
                            </div>
                            <div className={classes.inputContent}>
                                <Password
                                    fieldName="newPassword"
                                    label={formatMessage({
                                        id: 'accountInfo.newPassword',
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

                            <div className={classes.inputContent}>
                            <Password
                                    fieldName="confirmPassword"
                                    label={formatMessage({
                                        id: 'accountInfo.confirmPassword',
                                        defaultMessage: 'Confirm Password'
                                    })}
                                    validate={combine([
                                        isRequired,
                                        [hasLengthAtLeast, 8],
                                        validatePassword,
                                        [isEqualToField, 'newPassword']
                                    ])}
                                    isToggleButtonHidden={false}
                                />
                            </div>
                            
                        </div>
                        <div className={classes.alternativeEditColumn}>
                            {/* {renderAlternativeForm()} */}
                        </div>
                    </div>
                    <Colorbtn
                        text={formatMessage({
                            id: 'global.save',
                            defaultMessage: 'SAVE'
                        })}
                        className={classes.saveProfile}
                        type="submit"
                        disabled={isLoading}
                    />
                </Form>
            </React.Fragment>
        );
    }
    return (
        <div className={`${classes.root} container`}>
            <AlertMessages
                message={formatMessage({
                    id: 'accountInformationPage.save',
                    defaultMessage: 'You saved the account information.'
                })}
                setAlertMsg={setAlertMsg}
                alertMsg={alertMsg}
                status="success"
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