import React from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Country from '../Country';
import Dialog from '../Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import Region from '@magento/venia-ui/lib/components/Region';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './addEditDialog.module.css';

const AddEditDialog = props => {
    const {
        formErrors,
        formProps,
        isBusy,
        isEditMode,
        isOpen,
        onCancel,
        onConfirm,
        topInsets
    } = props;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    let formatTitleArgs;
    if (isEditMode) {
        formatTitleArgs = {
            id: 'addressBookPage.editDialogTitle',
            defaultMessage: 'Edit Address'
        };
    } else {
        formatTitleArgs = {
            id: 'addressBookPage.addDialogTitle',
            defaultMessage: 'New Address'
        };
    }
    const title = formatMessage(formatTitleArgs);

    const firstNameLabel = formatMessage({
        id: 'global.firstName',
        defaultMessage: 'First Name'
    });
    const middleNameLabel = formatMessage({
        id: 'global.middleName',
        defaultMessage: 'Middle Name'
    });
    const lastNameLabel = formatMessage({
        id: 'global.lastName',
        defaultMessage: 'Last Name'
    });
    const street1Label = formatMessage({
        id: 'global.streetAddress',
        defaultMessage: 'Street Address'
    });
    const street2Label = formatMessage({
        id: 'Street Address 2',
        defaultMessage: 'Street Address 2'
    });
    const companyLabel = formatMessage({
        id: 'company',
        defaultMessage: 'Company'
    });
    const cityLabel = formatMessage({
        id: 'global.city',
        defaultMessage: 'City'
    });
    const telephoneLabel = formatMessage({
        id: 'global.phoneNumber',
        defaultMessage: 'Phone Number'
    });
    const defaultAddressCheckLabel = formatMessage({
        id: 'Use as my default shipping address',
        defaultMessage: 'Use as my default shipping address'
    });


    const defaultBillingCheckLabel = formatMessage({
        id: 'Use as my default billing address',
        defaultMessage: 'Use as my default billing address'
    });

    return (
        <Dialog
            confirmTranslationId={'global.save'}
            confirmText="Save"
            formProps={formProps}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onConfirm}
            shouldDisableAllButtons={isBusy}
            title={title}
            topInsets={topInsets}
        >
            <FormError
                classes={{ root: classes.errorContainer }}
                errors={Array.from(formErrors.values())}
            />
            <div className={classes.root}>
                <div className={classes.info}>
                    <span className={classes.infoTitle}>
                        {formatMessage({
                            id: 'Contact Information',
                            defaultMessage: 'Contact Information'
                        })}
                    </span>
                    <span className={classes.infoTitle}>
                        {formatMessage({
                            id: 'Address',
                            defaultMessage: 'Address'
                        })}
                    </span>
                </div>
                <div className={classes.formContent}>
                    <div className={classes.infoContact}>
                        <div className={classes.firstname}>
                            <Field id="firstname" label={firstNameLabel}>
                                <TextInput
                                    field="firstname"
                                    validate={isRequired}
                                />
                            </Field>
                        </div>
                        <div className={classes.lastname}>
                            <Field id="lastname" label={lastNameLabel}>
                                <TextInput
                                    field="lastname"
                                    validate={isRequired}
                                />
                            </Field>
                        </div>
                        <div className={classes.company}>
                            <Field id="company" label={companyLabel}>
                                <TextInput
                                    field="company"
                                    validate={isRequired}
                                />
                            </Field>
                        </div>
                        <div className={classes.telephone}>
                            <Field id="telephone" label={telephoneLabel}>
                                <TextInput
                                    type="tel"
                                    field="telephone"
                                    validate={isRequired}
                                />
                            </Field>
                        </div>
                    </div>
                    <div className={classes.infoAddress}>
                        <div className={classes.street1}>
                            <Field id="street1" label={street1Label}>
                                <TextInput
                                    field="street[0]"
                                    validate={isRequired}
                                />
                            </Field>
                            <Field id="street2">
                                <TextInput field="street[1]" />
                            </Field>
                        </div>
                        <div className={classes.city}>
                            <Field id="city" label={cityLabel}>
                                <TextInput field="city" validate={isRequired} />
                            </Field>
                        </div>
                        <div className={classes.postcode}>
                            <Postcode type="tel" validate={isRequired} />
                        </div>
                        <div className={classes.country}>
                            <Country
                                field={'country_code'}
                                validate={isRequired}
                            />
                        </div>
                        <div className={classes.default_address_check}>
                            <Checkbox
                                field="default_billing"
                                label={defaultBillingCheckLabel}
                            />
                        </div>
                        <div className={classes.default_address_check2}>
                            <Checkbox
                                field="default_shipping"
                                label={defaultAddressCheckLabel}
                            />
                        </div>
                        {/* <button className={classes.save} type="submit">
                            {formatMessage({
                                id: 'Save',
                                defaultMessage: 'Save'
                            })}
                        </button> */}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default AddEditDialog;

AddEditDialog.propTypes = {
    classes: shape({
        root: string,
        city: string,
        country: string,
        default_address_check: string,
        errorContainer: string,
        firstname: string,
        lastname: string,
        middlename: string,
        postcode: string,
        region: string,
        street1: string,
        street2: string,
        telephone: string
    }),
    formErrors: object,
    isEditMode: bool,
    isOpen: bool,
    onCancel: func,
    onConfirm: func
};
