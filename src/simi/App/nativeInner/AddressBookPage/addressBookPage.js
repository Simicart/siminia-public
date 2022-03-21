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
import AddEditDialog from '@magento/venia-ui/lib/components/AddressBookPage/addEditDialog.js';
import defaultClasses from './addressBookPage.module.css';
import defaultOperations from '../talons/AddressBookPage/addressBookPage.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useMutation } from '@apollo/client';
import Loader from '../Loader';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';

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

    const addressBookElements = useMemo(() => {
        const defaultToBeginning = (address1, address2) => {
            if (address1.default_shipping) return -1;
            if (address2.default_shipping) return 1;
            return 0;
        };

        return (
            Array.from(customerAddresses)
                // .sort(defaultToBeginning)
                .map((addressEntry, index) => {
                    const countryName = countryDisplayNameMap.get(
                        addressEntry.country_code
                    );

                    const isDefaultShipping =
                        addressEntry.id === isDefault ? true : false;
                    const boundEdit = () => handleEditAddress(addressEntry);
                    const boundDelete = () =>
                        handleDeleteAddress(addressEntry.id);
                    const isConfirmingDelete =
                        confirmDeleteAddressId === addressEntry.id;

                    return (
                        <div className={classes.addAddressWrapper}>
                            <div
                                className={
                               classes.normal
                                }
                                onClick={() =>
                                    handleSetDefaultShipping(addressEntry.id)
                                }
                            >
                                {isDefaultShipping ? <div className={classes.default} /> : null}
                            </div>

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
                                isDefaultShipping={isDefaultShipping}
                                indexAddress={index}
                            />
                        </div>
                    );
                })
        );
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
    console.log('hieubach', customerAddresses);

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
                            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
                        ) : null}
                        {!isPhone ? (
                            <div
                                onClick={handleAddAddress}
                                className={classes.addAddress}
                            >
                                <div className={classes.addAddressBtn}>
                                    {formatMessage({
                                        id: 'Add new address',
                                        defaultMessage: 'Add new address'
                                    }).toUpperCase()}
                                </div>
                            </div>
                        ) : null}
                        {customerAddresses.length > 0 ? (
                            addressBookElements
                        ) : (
                            <div className={classes.noAddress}>
                                <img
                                    src={require('./noAddress.png')}
                                    alt="no address"
                                />
                                <span>
                                    {/* No address. Please accept your address */}
                                    {formatMessage({id:'You have no item in your address book'})}
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
                />
            </div>
            {isPhone ? (
                <div
                    onClick={handleAddAddress}
                    className={classes.addAddressMb}
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
