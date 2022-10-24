import React, { useMemo, useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import defaultClasses from './addNewAddress.module.css';
import Loader from '../../Loader';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LeftMenu from '../../../core/LeftMenu';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import FormError from '../../Customer/Login/formError';
import { Form } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Country from '../../Country';
import Region from '@magento/venia-ui/lib/components/Region';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import { useWindowSize } from '@magento/peregrine';
import Button from '@magento/venia-ui/lib/components/Button';
import { useAddressBookPage } from '../../talons/AddressBookPage/useAddressBookPage';

const AddNewAddress = props => {
    const talonProps = useAddressBookPage();
    const {
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        formErrors,
        formProps,
        handleAddAddress,
        handleCancelDeleteAddress,
        handleCancelDialog,
        handleConfirmDeleteAddress,
        handleConfirmDialog,
        handleDeleteAddress,
        handleEditAddress,
        isDeletingCustomerAddress,
        isDialogBusy,
        isDialogEditMode,
        isDialogOpen,
        isLoading
    } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth <= 768;

    const PAGE_TITLE = formatMessage({
        id: 'Add New Address',
        defaultMessage: 'Add New Address'
    });

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

    const form = (
        <Form onSubmit={handleConfirmDialog} className={classes.form}>
            <FormError
                classes={{ root: classes.errorContainer }}
                errors={Array.from(formErrors.values())}
            />
            <div className={classes.root}>
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
                            <Postcode validate={isRequired} />
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
                        <button className={classes.save} type="submit">
                            {formatMessage({
                                id: 'Save',
                                defaultMessage: 'Save'
                            })}
                        </button>
                    </div>
                </div>

                {/* <div className={classes.region}>
                    <Region
                        countryCodeField={'country_code'}
                        fieldInput={'region[region]'}
                        fieldSelect={'region[region_id]'}
                        optionValueKey="id"
                        validate={isRequired}
                    />
                </div> */}
            </div>
        </Form>
    );
    return (
        <div className={`${classes.root} container`}>
            <div className={classes.wrapper}>
                <LeftMenu label="Address Book" />
                <StoreTitle>{PAGE_TITLE}</StoreTitle>
                <div className={classes.addNewAddressContent}>
                    <div className={classes.content}>
                        {!isPhone ? (
                            <div className={classes.wrapHeading}>
                                <h1 className={classes.heading}>
                                    {PAGE_TITLE}
                                </h1>
                                <div className={classes.info}>
                                    <span className={classes.infoTitle}>
                                        {formatMessage({
                                            id: 'Contact Information',
                                            defaultMessage:
                                                'Contact Information'
                                        })}
                                    </span>
                                    <span className={classes.infoTitle}>
                                        {formatMessage({
                                            id: 'Address',
                                            defaultMessage: 'Address'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ) : null}
                        {form}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewAddress;
