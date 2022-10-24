import React, { useMemo, useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PlusSquare } from 'react-feather';

import { useAddressBookPage } from '../talons/AddressBookPage/useAddressBookPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import LeftMenu from '../../core/LeftMenu';
import { useWindowSize } from '@magento/peregrine';
import AddressCard from './addressCard';
import AddEditDialog from './addEditDialog.js';
import defaultClasses from './addressBookPage.module.css';
import defaultOperations from '../talons/AddressBookPage/addressBookPage.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useMutation } from '@apollo/client';
import Loader from '../Loader';
import { Link } from 'react-router-dom';

const AddressBookPage = props => {
    const talonProps = useAddressBookPage();
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 450;

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
    const [isDefault, setDefault] = useState();

    let bottomInsets = 0;
    let topInsets = 0;
    try {
        if (window.simicartRNinsets) {
            const simicartRNinsets = JSON.parse(window.simicartRNinsets);
            bottomInsets = parseInt(simicartRNinsets.bottom);
            topInsets = parseInt(simicartRNinsets.top);
        } else if (window.simpifyRNinsets) {
            const simpifyRNinsets = JSON.parse(window.simpifyRNinsets);
            bottomInsets = parseInt(simpifyRNinsets.bottom);
            topInsets = parseInt(simpifyRNinsets.top);
        }
    } catch (err) {}

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    useEffect(() => {
        customerAddresses.forEach(item => {
            if (item.default_shipping) {
                setDefault(item.id);
            }
        });
    }, [customerAddresses]);

    const operations = mergeOperations(defaultOperations, props.operations);
    const { setDefaultAddressMutation } = operations;

    const [
        setDefaultAddress,
        { error: setDefaultAddressEror, loading: isSetDefaultAddress, data }
    ] = useMutation(setDefaultAddressMutation);

    const handleSetDefaultShipping = addressId => {
        setDefault(addressId);
        setDefaultAddress({
            variables: {
                addressId: addressId
            }
        });
    };

    //------------------------------------------

    const PAGE_TITLE = formatMessage({
        id: 'addressBookPage.addressBookText',
        defaultMessage: 'Address Book'
    });
    const renderDefaultAddress = addresses => {
        const defaultShipping = addresses.find(
            ({ default_shipping }) => default_shipping === true
        );
        const defaultBilling = addresses.find(
            ({ default_billing }) => default_billing === true
        );

        if (!defaultBilling && !defaultShipping) {
            return (
                <div className={classes.noDefault}>
                    {formatMessage({
                        id: 'No default billing/shipping address selected.',
                        defaultMessage:
                            'No default billing/shipping address selected.'
                    })}
                </div>
            );
        }
        if (defaultBilling && !defaultShipping) {
            const countryNameBilling = countryDisplayNameMap.get(
                defaultShipping.country_code
            );
            const boundEditBilling = () => handleEditAddress(defaultBilling);
            const boundDeleteBilling = () =>
                handleDeleteAddress(defaultBilling.id);
            const isConfirmingDeleteBilling =
                confirmDeleteAddressId === defaultBilling.id;
            return (
                <>
                    <AddressCard
                        address={defaultBilling}
                        countryName={countryNameBilling}
                        isConfirmingDelete={isConfirmingDeleteBilling}
                        isDeletingCustomerAddress={isDeletingCustomerAddress}
                        key={defaultBilling.id}
                        onCancelDelete={handleCancelDeleteAddress}
                        onConfirmDelete={handleConfirmDeleteAddress}
                        onDelete={boundDeleteBilling}
                        onEdit={boundEditBilling}
                        setDefaultShipping={setDefault}
                        indexAddress={defaultBilling.id}
                        isPhone={isPhone}
                    />
                </>
            );
        }
        if (!defaultBilling && defaultShipping) {
            const countryNameShipping = countryDisplayNameMap.get(
                defaultShipping.country_code
            );
            const boundEditShipping = () => handleEditAddress(defaultShipping);
            const boundDeleteShipping = () =>
                handleDeleteAddress(defaultShipping.id);
            const isConfirmingDeleteShipping =
                confirmDeleteAddressId === defaultShipping.id;
            return (
                <>
                    <AddressCard
                        address={defaultShipping}
                        countryName={countryNameShipping}
                        isConfirmingDelete={isConfirmingDeleteShipping}
                        isDeletingCustomerAddress={isDeletingCustomerAddress}
                        key={defaultShipping.id}
                        onCancelDelete={handleCancelDeleteAddress}
                        onConfirmDelete={handleConfirmDeleteAddress}
                        onDelete={boundDeleteShipping}
                        onEdit={boundEditShipping}
                        setDefaultShipping={setDefault}
                        indexAddress={defaultShipping.id}
                        isPhone={isPhone}
                    />
                </>
            );
        }

        if (defaultBilling === defaultShipping) {
            const countryNameBilling = countryDisplayNameMap.get(
                defaultShipping.country_code
            );
            const boundEditBilling = () => handleEditAddress(defaultBilling);
            const boundDeleteBilling = () =>
                handleDeleteAddress(defaultBilling.id);
            const isConfirmingDeleteBilling =
                confirmDeleteAddressId === defaultBilling.id;
            return (
                <AddressCard
                    address={defaultBilling}
                    countryName={countryNameBilling}
                    isConfirmingDelete={isConfirmingDeleteBilling}
                    isDeletingCustomerAddress={isDeletingCustomerAddress}
                    key={defaultBilling.id}
                    onCancelDelete={handleCancelDeleteAddress}
                    onConfirmDelete={handleConfirmDeleteAddress}
                    onDelete={boundDeleteBilling}
                    onEdit={boundEditBilling}
                    setDefaultShipping={setDefault}
                    indexAddress={defaultBilling.id}
                    isPhone={isPhone}
                />
            );
        }
        if (
            defaultBilling &&
            defaultShipping &&
            defaultBilling !== defaultShipping
        ) {
            const countryNameBilling = countryDisplayNameMap.get(
                defaultShipping.country_code
            );
            const boundEditBilling = () => handleEditAddress(defaultBilling);
            const boundDeleteBilling = () =>
                handleDeleteAddress(defaultBilling.id);
            const isConfirmingDeleteBilling =
                confirmDeleteAddressId === defaultBilling.id;
            const countryNameShipping = countryDisplayNameMap.get(
                defaultShipping.country_code
            );
            const boundEditShipping = () => handleEditAddress(defaultShipping);
            const boundDeleteShipping = () =>
                handleDeleteAddress(defaultShipping.id);
            const isConfirmingDeleteShipping =
                confirmDeleteAddressId === defaultShipping.id;
            return (
                <>
                    {defaultBilling && (
                        <AddressCard
                            address={defaultBilling}
                            countryName={countryNameBilling}
                            isConfirmingDelete={isConfirmingDeleteBilling}
                            isDeletingCustomerAddress={
                                isDeletingCustomerAddress
                            }
                            key={defaultBilling.id}
                            onCancelDelete={handleCancelDeleteAddress}
                            onConfirmDelete={handleConfirmDeleteAddress}
                            onDelete={boundDeleteBilling}
                            onEdit={boundEditBilling}
                            setDefaultShipping={setDefault}
                            indexAddress={defaultBilling.id}
                            isPhone={isPhone}
                        />
                    )}
                    {defaultShipping && (
                        <AddressCard
                            address={defaultShipping}
                            countryName={countryNameShipping}
                            isConfirmingDelete={isConfirmingDeleteShipping}
                            isDeletingCustomerAddress={
                                isDeletingCustomerAddress
                            }
                            key={defaultShipping.id}
                            onCancelDelete={handleCancelDeleteAddress}
                            onConfirmDelete={handleConfirmDeleteAddress}
                            onDelete={boundDeleteShipping}
                            onEdit={boundEditShipping}
                            setDefaultShipping={setDefault}
                            indexAddress={defaultShipping.id}
                            isPhone={isPhone}
                        />
                    )}
                </>
            );
        }
        return '';
    };
    const addressBookElements = useMemo(() => {
        const defaultToBeginning = (address1, address2) => {
            if (address1.default_shipping) return -1;
            if (address2.default_shipping) return 1;
            return 0;
        };

        return Array.from(customerAddresses)
            .filter(
                address =>
                    address.default_shipping !== true &&
                    address.default_billing !== true
            )
            .map((addressEntry, index) => {
                const countryName = countryDisplayNameMap.get(
                    addressEntry.country_code
                );

                const boundEdit = () => handleEditAddress(addressEntry);
                const boundDelete = () => handleDeleteAddress(addressEntry.id);
                const isConfirmingDelete =
                    confirmDeleteAddressId === addressEntry.id;

                return (
                    <div className={classes.addAddressWrapper}>
                        <AddressCard
                            address={addressEntry}
                            countryName={countryName}
                            isConfirmingDelete={isConfirmingDelete}
                            isDeletingCustomerAddress={
                                isDeletingCustomerAddress
                            }
                            key={addressEntry.id}
                            onCancelDelete={handleCancelDeleteAddress}
                            onConfirmDelete={handleConfirmDeleteAddress}
                            onDelete={boundDelete}
                            onEdit={boundEdit}
                            setDefaultShipping={setDefault}
                            indexAddress={index}
                            isPhone={isPhone}
                        />
                    </div>
                );
            });
    }, [
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        handleCancelDeleteAddress,
        handleConfirmDeleteAddress,
        handleDeleteAddress,
        handleEditAddress,
        isDeletingCustomerAddress,
        isDefault,
        handleSetDefaultShipping
    ]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className={`${classes.root} container`}>
            <div className={classes.wrapper}>
                <LeftMenu label="Address Book" />
                <StoreTitle>{PAGE_TITLE}</StoreTitle>
                <div className={classes.addressbookContent}>
                    <div className={classes.content}>
                        {!isPhone ? (
                            <div className={classes.wrapHeading}>
                                <h1 className={classes.heading}>
                                    {PAGE_TITLE}
                                </h1>
                                <div
                                    onClick={handleAddAddress}
                                    className={classes.addAddress}
                                >
                                    <Link
                                        to={'/new-address'}
                                        className={classes.addAddressBtn}
                                    >
                                        {formatMessage({
                                            id: 'Add new address',
                                            defaultMessage: 'Add new address'
                                        }).toUpperCase()}
                                    </Link>
                                </div>
                            </div>
                        ) : null}

                        {customerAddresses.length > 0 ? (
                            <div className={classes.wrapAddresCard}>
                                <h2 className={classes.defaultAddress}>
                                    {formatMessage({
                                        id: 'Default Address',
                                        defaultMessage: 'Default Address'
                                    })}
                                </h2>
                                {renderDefaultAddress(customerAddresses)}
                                <h2 className={classes.defaultAddress}>
                                    {formatMessage({
                                        id: 'Additional Address Entries',
                                        defaultMessage:
                                            'Additional Address Entries'
                                    })}
                                </h2>
                                {addressBookElements}
                            </div>
                        ) : (
                            <div className={classes.noAddress}>
                                <img
                                    src={require('./noAddress.png')}
                                    alt="no address"
                                />
                                <span>
                                    {/* No address. Please accept your address */}
                                    {formatMessage({
                                        id:
                                            'You have no item in your address book'
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <AddEditDialog
                    formErrors={formErrors}
                    formProps={formProps}
                    isBusy={isDialogBusy}
                    isEditMode={isDialogEditMode}
                    isOpen={isDialogOpen}
                    onCancel={handleCancelDialog}
                    onConfirm={handleConfirmDialog}
                    topInsets={topInsets}
                />
            </div>
            {isPhone ? (
                <div
                    onClick={handleAddAddress}
                    className={classes.addAddressMb}
                    style={{ height: 55 + bottomInsets }}
                >
                    {formatMessage({
                        id: 'Add new address',
                        defaultMessage: 'Add new address'
                    }).toUpperCase()}
                </div>
            ) : null}
        </div>
    );
};

export default AddressBookPage;
