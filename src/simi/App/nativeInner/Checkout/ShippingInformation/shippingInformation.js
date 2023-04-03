import React, { Fragment, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { func, string, shape } from 'prop-types';
import { Edit2 as EditIcon } from 'react-feather';
import { useShippingInformation } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useShippingInformation';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import AddressForm from '@magento/venia-ui/lib/components/CheckoutPage/ShippingInformation/AddressForm';
import Card from './card';
import defaultClasses from './shippingInformation.module.css';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';

import Loader from 'src/simi/App/nativeInner/Loader';
import CheckoutCustomField from '../../CheckoutCustomField/checkoutCustomField';

const EditModal = React.lazy(() =>
    import('@magento/venia-ui/lib/components/CheckoutPage/ShippingInformation/editModal')
);

const ShippingInformation = props => {
    const {
        classes: propClasses,
        onSave,
        onSuccess,
        toggleActiveContent,
        isMobile
    } = props;
    const talonProps = useShippingInformation({
        onSave,
        toggleActiveContent
    });
    const {
        doneEditing,
        handleEditShipping,
        hasUpdate,
        isSignedIn,
        isLoading,
        shippingData
    } = talonProps;

    const classes = useStyle(defaultClasses, propClasses);

    const rootClassName = !doneEditing
        ? classes.root_editMode
        : hasUpdate
        ? classes.root_updated
        : classes.root;

    if (isLoading) {
        if (isMobile) {
            return <Loader />;
        }

        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                <FormattedMessage
                    id={'Fetching Shipping Information...'}
                    defaultMessage={'Fetching Shipping Information...'}
                />
            </LoadingIndicator>
        );
    }

    const editModal = !isSignedIn ? (
        <Suspense fallback={null}>
            <EditModal
                onSuccess={onSuccess}
                shippingData={shippingData}
                classes={{
                    root: classes.root_editModal,
                    root_open: classes.root_editModal_open
                }}
            />
        </Suspense>
    ) : null;

    const shippingInformation = doneEditing ? (
        <Fragment>
            <div className={classes.cardHeader}>
                <h5 className={classes.cardTitle}>
                    <FormattedMessage
                        id={'SHIPPING INFORMATION'}
                        defaultMessage={'Shipping Information'}
                    />
                </h5>
                <LinkButton
                    onClick={handleEditShipping}
                    className={classes.editButton}
                >
                    <Icon
                        size={16}
                        src={EditIcon}
                        classes={{ icon: classes.editIcon }}
                    />
                    <span className={classes.editText}>
                        <FormattedMessage
                            id={'Edit'}
                            defaultMessage={'Edit'}
                        />
                    </span>
                </LinkButton>
            </div>
            <Card shippingData={shippingData} />
            {editModal}
        </Fragment>
    ) : (
        <Fragment>
            <h3 className={classes.editTitle}>
                <FormattedMessage
                    id={'1. Shipping Information'}
                    defaultMessage={'1. Shipping Information'}
                />
            </h3>
            <div className={classes.editWrapper}>
                <AddressForm
                    onSuccess={onSuccess}
                    shippingData={shippingData}
                />
            </div>
        </Fragment>
    );

    return <div className={rootClassName}>
        {shippingInformation}
        {/* <CheckoutCustomField /> */}
    </div>;
};

export default ShippingInformation;

ShippingInformation.propTypes = {
    classes: shape({
        root: string,
        root_editMode: string,
        cardHeader: string,
        cartTitle: string,
        editWrapper: string,
        editTitle: string,
        editButton: string,
        editIcon: string,
        editText: string
    }),
    onSave: func.isRequired,
    onSuccess: func.isRequired,
    toggleActiveContent: func.isRequired
};
