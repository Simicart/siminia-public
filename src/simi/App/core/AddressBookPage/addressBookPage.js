import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PlusSquare } from 'react-feather';

import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import LeftMenu from '../LeftMenu';

import AddressCard from './addressCard';
import AddEditDialog from '@magento/venia-ui/lib/components/AddressBookPage/addEditDialog.js';
import defaultClasses from './addressBookPage.module.css';

const AddressBookPage = props => {
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

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

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

        return Array.from(customerAddresses)
            .sort(defaultToBeginning)
            .map(addressEntry => {
                const countryName = countryDisplayNameMap.get(
                    addressEntry.country_code
                );

                const boundEdit = () => handleEditAddress(addressEntry);
                const boundDelete = () => handleDeleteAddress(addressEntry.id);
                const isConfirmingDelete =
                    confirmDeleteAddressId === addressEntry.id;

                return (
                    <AddressCard
                        address={addressEntry}
                        countryName={countryName}
                        isConfirmingDelete={isConfirmingDelete}
                        isDeletingCustomerAddress={isDeletingCustomerAddress}
                        key={addressEntry.id}
                        onCancelDelete={handleCancelDeleteAddress}
                        onConfirmDelete={handleConfirmDeleteAddress}
                        onDelete={boundDelete}
                        onEdit={boundEdit}
                    />
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
        isDeletingCustomerAddress
    ]);
    console.log("hieubach", customerAddresses);

    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    return (
        <div className={`${classes.root} container`}>
            <div className={classes.wrapper}>
                <LeftMenu label="Address Book" />
                <StoreTitle>{PAGE_TITLE}</StoreTitle>
                <div className={classes.addressbookContent}>
                    <div className={classes.content}>
                        <h1 className={classes.heading}>{PAGE_TITLE}</h1>
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
                        {/* <LinkButton
                    className={classes.addButton}
                    key="addAddressButton"
                    onClick={handleAddAddress}
                >
                    <Icon
                        classes={{
                            icon: classes.addIcon
                        }}
                        size={24}
                        src={PlusSquare}
                    />
                    <span className={classes.addText}>
                        <FormattedMessage
                            id={'addressBookPage.addAddressText'}
                            defaultMessage={'Add an Address'}
                        />
                    </span>
                </LinkButton> */}
                        {customerAddresses.length > 0 ? 
                        addressBookElements : formatMessage(
                            {
                                id: 'wishlist.itemCountClosed',
                                defaultMessage: `You have {count} {count, plural,
                                  one {item}
                                  other {items}
                                } in this list`
                            },
                            { count: customerAddresses.length }
                        )
                        }

                        
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
        </div>
    );
};

export default AddressBookPage;
