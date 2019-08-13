import React, { useEffect } from 'react';
import Identify from "src/simi/Helper/Identify";
import {Link} from 'react-router-dom'
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import OrderHistory from 'src/simi/App/core/Customer/Account/Components/Orders/OrderList';
import Loading from "src/simi/BaseComponents/Loading";
import { simiUseQuery } from 'src/simi/Network/Query' 
import getCustomerInfoQuery from 'src/simi/queries/getCustomerInfo.graphql'
import AddressItem from './AddressItem'; 
import TitleHelper from 'src/simi/Helper/TitleHelper';

const Dashboard = props => {
    const {classes, isPhone, customer} = props;
    const [queryResult, queryApi] = simiUseQuery(getCustomerInfoQuery, false);
    const {data} = queryResult
    const { runQuery } = queryApi;

    const getCustomerInfo = () => {
        runQuery({});
    }

    useEffect(() => {
        if(!data) {
            getCustomerInfo();
        }
    }, [data])

    const renderDefaultAddress = (item, default_billing, default_shipping) => {
        const defaultBilling = item.find(value => {
            return value.id === parseInt(default_billing, 10);
        });

        const defaultShipping = item.find(value => {
            return value.id === parseInt(default_shipping, 10);
        })
        
        return (
            <div className={classes["address-book__container"]}>
                <div className={classes["dash-column-box"]}>
                    <div className={classes["box-title"]}>
                        {Identify.__("Default Billing Address")}
                    </div>
                    {defaultBilling ? (
                        <React.Fragment>
                             <AddressItem
                                addressData={defaultBilling}
                                classes={classes}
                            />
                            <Link className={classes["edit-item"]} to={{pathname: '/addresses.html', state: { addressEditing: defaultBilling}}}>{Identify.__("Edit address")}</Link>
                        </React.Fragment>
                    ) : <div>{Identify.__('You have not set a default billing address.  ')}</div>}
    
                </div>
                <div className={classes["dash-column-box"]}>
                    <div className={classes["box-title"]}>
                        {Identify.__("Default Shipping Address")}
                    </div>
                    {defaultShipping ? (
                        <React.Fragment>
                            <AddressItem
                                addressData={defaultShipping}
                                classes={classes}
                            />
                            <Link className={classes["edit-item"]} to={{pathname: '/addresses.html', state: { addressEditing: defaultShipping}}}>{Identify.__("Edit address")}</Link>
                        </React.Fragment>
                    ) : <div>{Identify.__('You have not set a default shipping address.')}</div>}
                    
                </div>
            </div>
        );
    }

    if(!data) {
        return <Loading />
    }

    return (
        <div className={classes['my-dashboard']}>
            {TitleHelper.renderMetaHeader({
                title: Identify.__('Dashboard'),
                desc: Identify.__('Dashboard') 
            })}
            {!isPhone ? (
                    <div className={classes["dashboard-recent-orders"]}>
                        <div className={classes["customer-page-title"]}>
                            {Identify.__("Recent Orders")}
                            <Link className={classes["view-all"]} to='/orderhistory.html'>{Identify.__("View all")}</Link>
                        </div>
                        <OrderHistory classes={classes} data={data} showForDashboard={true} />
                    </div>
                ) : (
                    <Link to="/orderhistory.html">
                        <Whitebtn
                            text={Identify.__("View recent orders")}
                            className={classes["view-recent-orders"]}
                        />
                    </Link>
                    
            )}
            <div className={classes['dashboard-acc-information']}>
                <div className={classes['customer-page-title']}>
                    {Identify.__("Account Information")}
                </div>
                <div className={classes["acc-information"]} >
                    <div className={classes["dash-column-box"]}>
                        <div className={classes["white-box-content"]}>
                            <div className={classes["box-title"]}>
                                {Identify.__("Contact information")}
                            </div>
                            <p className={`${classes["desc"]} ${classes["email"]}`}>{`${customer.firstname} ${customer.lastname}`}</p>
                            <p className={`${classes["desc"]} ${classes["email"]}`}>{customer.email}</p>
                            <Link className={classes["edit-link"]} to={{ pathname: '/profile.html', state: {profile_edit: 'password'} }}>{Identify.__("Change password")}</Link>
                        </div>
                        <Link to="/profile.html">
                            <Whitebtn
                                text={Identify.__("Edit")}
                                className={classes["edit-information"]}
                            />
                        </Link>
                        
                    </div>
                    <div className={classes["dash-column-box"]}>
                        {data.hasOwnProperty('customer') && data.customer.hasOwnProperty('is_subscribed') ? (
                            <div className={classes["white-box-content"]}>
                                <div className={classes["box-title"]}>
                                    {Identify.__("Newsletter")}
                                </div>
                                <p className={classes["desc"]}>
                                    {data.customer.is_subscribed === true
                                        ? Identify.__(
                                            "You are subscribed to our newsletter"
                                        )
                                        : Identify.__(
                                            "You are not subscribed to our newsletter"
                                        )}
                                </p>
                            </div>
                        ) : <Loading /> }
                        <Link to="/newsletter.html">
                            <Whitebtn
                                text={Identify.__("Edit")}
                                className={classes["edit-information"]} 
                            />            
                        </Link>
                    </div>
                </div>
            </div>
            {data.customer && data.customer.addresses && (
                <div className={classes["dashboard-address-book"]}>
                    <div className={classes["customer-page-title"]}>
                        {Identify.__("Address Book")}
                        <Link className={classes["view-all"]} to="/addresses.html">{Identify.__("Manage addresses")}</Link>
                    </div>
                    {renderDefaultAddress(data.customer.addresses, data.customer.default_billing, data.customer.default_shipping)}
                </div>
            )} 
        </div>
    )
    
}

export default Dashboard;