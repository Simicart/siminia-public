import React from 'react';
import OrderHistory from '../../Components/Orders/OrderList';
import Identify from "src/simi/Helper/Identify";
import TitleHelper from 'src/simi/Helper/TitleHelper';

const MyOrder = props => {

    return (
        <div className='account-my-orders-history'>
            {TitleHelper.renderMetaHeader({
                title: Identify.__('My Orders'),
                desc: Identify.__('My Orders')
            })}
            <div className="customer-page-title">
                <div className="customer-page-title">
                    {Identify.__("My Orders")}
                </div>
            </div>
            <div className='account-my-orders'>
                <OrderHistory showForDashboard={false} />
            </div>
        </div>
    )
}

export default MyOrder;
