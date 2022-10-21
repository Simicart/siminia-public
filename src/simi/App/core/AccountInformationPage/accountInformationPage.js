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
import LeftMenu from '../LeftMenu';

import CUSTOMER_UPDATE from 'src/simi/queries/customerUpdate.graphql';
import CUSTOMER_PASSWORD_UPDATE from 'src/simi/queries/customerPasswordUpdate.graphql';
import GET_CUSTOMER_QUERY from 'src/simi/queries/getCustomer.graphql';
import { useAccountInformationPage } from '../../../talons/MyAccount/useAccountInformationPage';
import { randomString } from '../TapitaPageBuilder/CarefreeHorizontalScroll/randomString';
import { showToastMessage } from 'src/simi/Helper/Message';
import {
    isRequired,
    hasLengthAtLeast,
    validatePassword,
    isNotEqualToField
} from '@magento/venia-ui/lib/util/formValidators';
import combine from '@magento/venia-ui/lib/util/combineValidators';

import RadioGroup from '@magento/venia-ui/lib/components/RadioGroup';
import Radio from '@magento/venia-ui/lib/components/RadioGroup/radio';


const AccountInformationPage = props => {
    const { history } = props;

    let defaultForm = false;
    if (
        history.location.state
        && history.location.state.hasOwnProperty('profile_edit')
        && history.location.state.profile_edit
    ) {
        defaultForm = history.location.state.profile_edit;
    }
    const { formatMessage } = useIntl();
    
    const onSubmit = () => {
        showToastMessage(
            formatMessage({
                id: 'accountInformationPage.save',
                defaultMessage: 'You saved the account information.'
            })
        );
        return;
        
    }
    const talonProps = useAccountInformationPage({
        defaultForm,
        updateCustomerMutation: CUSTOMER_UPDATE,
        updateCustomerPasswordMutation: CUSTOMER_PASSWORD_UPDATE,
        customerQuery: GET_CUSTOMER_QUERY,
        onSubmit: onSubmit
    });
    
    
    const classes = useStyle(defaultClasses,props.classes);
    const {
        isSignedIn,
        initialValues,
        handleUpdateInfo,
        errors,
        isActiveForm,
        handleActiveForm,
        isLoading
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

    const handleOnChange = (e) => {
        
    }
    

    const renderAlternativeForm = () => {
        switch (isActiveForm) {
            case 'email':
                return (
                    <React.Fragment>
                        <h4 className={classes.titleH4}>
                            <FormattedMessage
                                id={'Change Email'}
                                defaultMessage={
                                    'Change Email'
                                }
                            />
                        </h4>
                        <div className={classes.inputContent}>
                            <Field
                                label={formatMessage({
                                    id: 'email',
                                    defaultMessage: 'Email *'
                                })}
                                required={true}>
                                <TextInput
                                    // placeholder={formatMessage({
                                    //     id: 'global.inputEmail',
                                    //     defaultMessage: 'Email'
                                    // })}
                                    field="email"
                                    type="email"
                                    autoComplete="email"
                                    validate={isRequired}
                                    validateOnBlur
                                />
                            </Field>
                        </div>
                        <div className={classes.inputContent}>
                        <Field
                            
                            label={formatMessage({
                                id: 'Current Password',
                                defaultMessage: 'Current password *'
                            })}
                            required={true}>
                            <TextInput
                                // placeholder={formatMessage({
                                //     id: 'global.inputCurrentPassword',
                                //     defaultMessage: 'Current Password'
                                // })}
                                field="password"
                                type="password"
                                validate={isRequired}
                                validateOnBlur
                            />
                        </Field>
                        </div>
                    </React.Fragment>
                );
            case 'password':
                return (
                    <React.Fragment>
                        <h4 className={classes.titleH4}>
                            <FormattedMessage
                                id={'Change password'}
                                defaultMessage={
                                    'Change Password'
                                }
                            />
                        </h4>
                        <div className={classes.inputContent}>
                        <Field
                            
                            label={formatMessage({
                                id: 'global.labelCurrentPassword2',
                                defaultMessage: 'Current password *'
                            })}
                            required={true}>
                            <TextInput
                                // placeholder={formatMessage({
                                //     id: 'global.inputCurrentPassword2',
                                //     defaultMessage: 'Current Password'
                                // })}
                                field="current_password"
                                type="password"
                                
                                validate={combine([
                                    isRequired,
                                    [hasLengthAtLeast, 8],
                                    validatePassword,
                                    [isNotEqualToField, 'password']
                                ])}
                                validateOnBlur
                            />
                        </Field>
                        </div>
                        <div className={classes.inputContent}>
                        <Field
                            
                            label={formatMessage({
                                id: 'New Password',
                                defaultMessage: 'New password *'
                            })}
                            required={true}>
                            <TextInput
                                // placeholder={formatMessage({
                                //     id: 'global.inputNewPassword',
                                //     defaultMessage: 'New password'
                                // })}
                                field="new_password"
                                type="password"
                                validate={combine([
                                    isRequired,
                                    [hasLengthAtLeast, 8],
                                    validatePassword,
                                    [isNotEqualToField, 'password']
                                ])}
                                validateOnBlur
                                onChange={e => handleOnChange(e)}
                            />
                        </Field>
                        </div>
                       
                        <div className={classes.inputContent}>
                        <Field
                            
                            label={formatMessage({
                                id: 'Confirm New Password',
                                defaultMessage: 'Confirm new password *'
                            })}
                            required={true}>
                            <TextInput
                                // placeholder={formatMessage({
                                //     id: 'global.inputConfirmNewPassword',
                                //     defaultMessage: 'Confirm new password'
                                // })}
                                field="confirm_password"
                                type="password"
                                validate={combine([
                                    isRequired,
                                    [hasLengthAtLeast, 8],
                                    validatePassword,
                                    [isNotEqualToField, 'password']
                                ])}
                                validateOnBlur
                            />
                        </Field>
                        </div>
                    </React.Fragment>
                )
        }
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
                    onSubmit={handleUpdateInfo}>
                    <div className={classes.rowEditProfile}>
                        <div className={classes.mainEditColumn}>
                            <h4 className={classes.titleH4}>
                                <FormattedMessage
                                    id={'accountInformationPage.titleAccountInfo'}
                                    defaultMessage={'Account Information'}
                                />
                            </h4>
                            <div className={classes.inputContent}>
                                <Field
                                    label={formatMessage({
                                        id: 'global.labelFirstName',
                                        defaultMessage: 'First Name' + ' *'
                                    })}
                                    required={true}
                                >
                                
                                    <TextInput
                                        // placeholder={formatMessage({
                                        //     id: 'global.inputFirstName',
                                        //     defaultMessage: 'First name'
                                        // })}
                                        autoComplete="given-name"
                                        field="firstname"
                                        validate={isRequired}
                                        validateOnBlur
                                    />
                                </Field>
                            </div>
                            <div className={classes.inputContent}>
                                <Field label={formatMessage({
                                        id: 'global.labelLasttName',
                                        defaultMessage: 'Last Name *'
                                    })}
                                       required={true} 
                                      >
                                    <TextInput
                                        //  placeholder={formatMessage({
                                        //     id: 'global.inputLastName',
                                        //     defaultMessage: 'Last name'
                                        // })}
                                        autoComplete="family-name"
                                        field="lastname"
                                        validate={isRequired}
                                        validateOnBlur
                                    />
                                </Field>
                            </div>
                            <div className={classes.radioCheckbox}>
                            {/* <RadioGroup classes={{root: classes.checkbox}} field="radioCheckbox">
                                <Radio
                                    id={randomString(2)} 
                                    label={formatMessage({
                                        id: 'global.checkboxChangeEmail',
                                        defaultMessage: 'Change Email'
                                    })} 
                                    value={formatMessage({id: 'global.radioEmail'})} 
                                    checked={isActiveForm === 'email' ? true : false}
                                    onClick={() => handleActiveForm(isActiveForm === 'email' ? false : 'email')} 
                                />
                                <Radio
                                   id={randomString(3)} 
                                   label={formatMessage({
                                       id: 'global.checkboxChangePassword',
                                       defaultMessage: 'Change Password'
                                   })} 
                                   value={formatMessage({id: 'global.radioPassword'})}
                                   checked={isActiveForm === 'password' ? true : false}
                                   onClick={() => handleActiveForm(isActiveForm === 'password' ? false : 'password')}                         
                                />
                            </RadioGroup> */}
                               
                                <RadioCheckbox
                                    key={randomString(2)} 
                                    
                                    defaultChecked={isActiveForm === 'email' ? true : false} 
                                    title={formatMessage({
                                        id: 'global.checkboxChangeEmail',
                                        defaultMessage: 'Change Email'
                                    })} 
                                    onClick={() => handleActiveForm(isActiveForm === 'email' ? false : 'email')} />
                                <RadioCheckbox
                                    key={randomString(2)} 
                                    
                                    defaultChecked={isActiveForm === 'password' ? true : false} 
                                    title={formatMessage({
                                        id: 'global.checkboxChangePassword',
                                        defaultMessage: 'Change Password'
                                    })} 
                                    onClick={() => handleActiveForm(isActiveForm === 'password' ? false : 'password')} />
                            </div>
                            
                        </div>
                        <div className={classes.alternativeEditColumn}>
                            {renderAlternativeForm()}
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
