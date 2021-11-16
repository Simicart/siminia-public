import React, { useCallback } from 'react';
import { connect } from 'src/drivers';
import { useToasts } from '@magento/peregrine';
import { Redirect } from 'src/drivers';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Identify from 'src/simi/Helper/Identify';
import PageTitle from '../../Components/PageTitle';
import GET_CUSTOMER_ADDRESSES from 'src/simi/queries/customerAddress';
import CUSTOMER_ADDRESS_DELETE from 'src/simi/queries/customerAddressDelete.graphql';
import { useAddressBook } from 'src/simi/talons/AddressBook/useAddressBook';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import Loading from "src/simi/BaseComponents/Loading";
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import AddressItem from '../../Components/AddressItem';

require('./style.scss');

const AddressBook = props => {
    const { history, user } = props;

    const [, { addToast }] = useToasts();

    const afterSubmit = useCallback(() => {
        hideFogLoading();
        addToast({
            type: 'info',
            message: Identify.__('Delete address book successful!'),
            timeout: 5000
        });
    }, [addToast]);

    const talonProps = useAddressBook({
        afterSubmit,
        query: { getCustomerAddress: GET_CUSTOMER_ADDRESSES },
        mutation: { deleteAddressMutation: CUSTOMER_ADDRESS_DELETE }
    });

    const { initialValues, loading, formErrors, handleDeleteItem, isSignedIn } = talonProps;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    if (loading && !initialValues) {
        return <Loading />
    }

    if (formErrors) {
        toggleMessages([{ type: 'error', message: formErrors, auto_dismiss: true }])
    }

    const { addresses } = initialValues;

    const handleNewAddress = (addId) => {
        if (addId) {
            const addressFounded = addresses.find(({ id }) => id === Number(addId));
            if (addressFounded) {
                const location = {
                    pathname: `/new-address.html/${addId}`,
                    state: {
                        address: addressFounded
                    }
                };
                history.push(location);
            } else {
                history.push('/new-address.html');
            }
        } else {
            history.push('/new-address.html');
        }
    }

    const deleteAddress = (id) => {
        if (confirm(Identify.__("Are you sure delete address?"))) {
            showFogLoading();
            handleDeleteItem(id);
        }
    }

    const renderDefaultAddress = (addresses) => {
        const defaultShipping = addresses.find(({ default_shipping }) => default_shipping === true);
        const defaultBilling = addresses.find(({ default_billing }) => default_billing === true);

        if (!defaultBilling && !defaultShipping) {
            return <div>{Identify.__("No default billing/shipping address selected.")}</div>
        }

        return <div className="address-content">
            {defaultBilling && <div className="billing-address">
                <span className="box-title">{Identify.__("Default Billing Address")}</span>
                <div className="box-content">
                    <AddressItem addressData={defaultBilling} customer_email={user && user.email ? user.email : ''} />
                </div>
                <div className="box-action">
                    <span onClick={() => handleNewAddress(defaultBilling.id)}>{Identify.__("Change Billing Address")}</span>
                </div>
            </div>}
            {defaultShipping && <div className="shipping-address">
                <span className="box-title">{Identify.__("Default Shipping Address")}</span>
                <div className="box-content">
                    <AddressItem addressData={defaultShipping} customer_email={user && user.email ? user.email : ''} />
                </div>
                <div className="box-action">
                    <span onClick={() => handleNewAddress(defaultShipping.id)}>{Identify.__("Change Shipping Address")}</span>
                </div>
            </div>}
        </div>
    }

    const renderAdditionalItem = (addressList) => {
        let html = null;
        if (addressList.length) {
            html = addressList.filter(({ default_shipping, default_billing }) => default_shipping === false || default_billing === false || (default_shipping === false && default_billing === false)).map((address, idx) => {
                return <div className="address-entry-box" key={idx}>
                    <div className="box-content">
                        <AddressItem addressData={address} customer_email={user && user.email ? user.email : ''} />
                    </div>
                    <div className="box-action">
                        <span className="btn-edit-address" onClick={() => handleNewAddress(address.id)}>{Identify.__("Edit")}</span>
                        <span className="btn-del-address" onClick={() => deleteAddress(address.id)}>{Identify.__("Delete")}</span>
                    </div>
                </div>
            });
        }
        return html;
    }

    return <div className="address-book">
        {TitleHelper.renderMetaHeader({ title: Identify.__('Address Book') })}
        <PageTitle title={Identify.__("Address Book")} />
        <div className='default-address'>
            <div className="address-label">{Identify.__("Default Addresses")}</div>
            {addresses && addresses.length ? renderDefaultAddress(addresses) : null}
        </div>
        <div className="additional-address">
            <div className="address-label">{Identify.__("Additional Address Entries")}</div>
            {addresses && addresses.length ? <div className="additional-address-contain">
                {renderAdditionalItem(addresses)}
            </div> : null}
        </div>
        <div className={"btn add-new-address"}>
            <button onClick={() => handleNewAddress()}><span>{Identify.__("Add New Address")}</span></button>
        </div>
    </div>
}

const mapStateToProps = ({ user }) => {
    const { currentUser } = user
    return {
        user: currentUser
    };
}

const mapDispatchToProps = {
    toggleMessages
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressBook);
