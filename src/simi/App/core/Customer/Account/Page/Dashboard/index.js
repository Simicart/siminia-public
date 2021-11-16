import React from 'react';
import Identify from "src/simi/Helper/Identify";
import { Link } from 'src/drivers';
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import OrderHistory from '../../Components/Orders/OrderList';
import Loading from "src/simi/BaseComponents/Loading";
import { simiUseQuery } from 'src/simi/Network/Query';
import getCustomerInfoQuery from 'src/simi/queries/getCustomerInfo.graphql';
import AddressItem from '../../Components/AddressItem';
import TitleHelper from 'src/simi/Helper/TitleHelper';

const Dashboard = props => {
    const { isPhone, customer, history } = props;
    const { data } = simiUseQuery(getCustomerInfoQuery, { fetchPolicy: 'no-cache' });

    const renderDefaultAddress = (item, default_billing, default_shipping) => {
        const defaultBilling = item.find(value => {
            return value.id === parseInt(default_billing, 10);
        });

        let billingLink = null;
        if (defaultBilling) {
            const locationBill = {
                pathname: `/new-address.html/${defaultBilling.id}`,
                state: {
                    address: defaultBilling
                }
            }
            billingLink = <div className="edit-item" onClick={() => history.push(locationBill)}>{Identify.__("Edit address")}</div>
        };

        const defaultShipping = item.find(value => {
            return value.id === parseInt(default_shipping, 10);
        });
        let shippingLink = null;
        if (defaultShipping) {
            const locationShip = {
                pathname: `/new-address.html/${defaultShipping.id}`,
                state: {
                    address: defaultShipping
                }
            }
            shippingLink = <div className='edit-item' onClick={() => history.push(locationShip)}>{Identify.__("Edit address")}</div>
        };

        return (
            <div className="address-book__container">
                <div className="dash-column-box">
                    <div className="box-title">
                        {Identify.__("Default Billing Address")}
                    </div>
                    {defaultBilling ? (
                        <React.Fragment>
                            <AddressItem addressData={defaultBilling} />
                            {billingLink}
                        </React.Fragment>
                    ) : <div>{Identify.__('You have not set a default billing address.  ')}</div>}

                </div>
                <div className="dash-column-box">
                    <div className="box-title">
                        {Identify.__("Default Shipping Address")}
                    </div>
                    {defaultShipping ? (
                        <React.Fragment>
                            <AddressItem addressData={defaultShipping} />
                            {shippingLink}
                        </React.Fragment>
                    ) : <div>{Identify.__('You have not set a default shipping address.')}</div>}

                </div>
            </div>
        );
    }

    if (!data) {
        return <Loading />
    }

    return (
        <div className='my-dashboard'>
            {TitleHelper.renderMetaHeader({
                title: Identify.__('Dashboard'),
                desc: Identify.__('Dashboard')
            })}
            {!isPhone ? (
                <div className="dashboard-recent-orders">
                    <div className="customer-page-title">
                        {Identify.__("Recent Orders")}
                        <Link className="view-all" to='/orderhistory.html'>{Identify.__("View all")}</Link>
                    </div>
                    <OrderHistory data={data} showForDashboard={true} />
                </div>
            ) : (
                    <Link to="/orderhistory.html">
                        <Whitebtn
                            text={Identify.__("View recent orders")}
                            className="view-recent-orders"
                        />
                    </Link>

                )}
            <div className='dashboard-acc-information'>
                <div className='customer-page-title'>
                    {Identify.__("Account Information")}
                </div>
                <div className="acc-information" >
                    <div className="dash-column-box">
                        <div className="white-box-content">
                            <div className="box-title">
                                {Identify.__("Contact information")}
                            </div>
                            <p className="desc email">{`${customer.firstname} ${customer.lastname}`}</p>
                            <p className="desc email">{customer.email}</p>
                            <Link className="edit-link" to={{ pathname: '/profile.html', state: { profile_edit: 'password' } }}>{Identify.__("Change password")}</Link>
                        </div>
                        <Link to="/profile.html">
                            <Whitebtn
                                text={Identify.__("Edit")}
                                className="edit-information"
                            />
                        </Link>

                    </div>
                    <div className="dash-column-box">
                        {data.hasOwnProperty('customer') && data.customer.hasOwnProperty('is_subscribed') ? (
                            <div className="white-box-content">
                                <div className="box-title">
                                    {Identify.__("Newsletter")}
                                </div>
                                <p className="desc">
                                    {data.customer.is_subscribed === true
                                        ? Identify.__(
                                            "You are subscribed to our newsletter"
                                        )
                                        : Identify.__(
                                            "You are not subscribed to our newsletter"
                                        )}
                                </p>
                            </div>
                        ) : <Loading />}
                        <Link to="/newsletter.html">
                            <Whitebtn
                                text={Identify.__("Edit")}
                                className="edit-information"
                            />
                        </Link>
                    </div>
                </div>
            </div>
            {data.customer && data.customer.addresses && (
                <div className="dashboard-address-book">
                    <div className="customer-page-title">
                        {Identify.__("Address Book")}
                        <Link className="view-all" to="/addresses.html">{Identify.__("Manage addresses")}</Link>
                    </div>
                    {renderDefaultAddress(data.customer.addresses, data.customer.default_billing, data.customer.default_shipping)}
                </div>
            )}
        </div>
    )

}

export default Dashboard;
