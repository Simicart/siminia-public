import React, { useState } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { Redirect } from 'src/drivers';
import { formatPrice } from 'src/simi/Helper/Pricing';
import PaginationTable from './PaginationTable';
import { Link } from 'react-router-dom';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import { useMyOrders } from 'src/simi/talons/MyAccount/useMyOrders';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import Loading from "src/simi/BaseComponents/Loading";
import {
    GET_ORDER_LIST,
    RE_ORDER_ITEMS
} from './OrderPage.gql';

const OrderList = props => {
    const { showForDashboard, toggleMessages } = props;
    const [limit, setLimit] = useState(10);
    const [title, setTitle] = useState(10);
    const { isSignedIn, data, dataReorder, handleReOrderItem, errors } = useMyOrders({
        query: { getOrderList: GET_ORDER_LIST },
        mutation: { reOrderItems: RE_ORDER_ITEMS }
    });

    if (!isSignedIn) {
        <Redirect to="/" />
    };

    if (errors) {
        toggleMessages([{ type: 'error', message: errors, auto_dismiss: true }])
    }

    if (dataReorder) {
        toggleMessages([{ type: 'success', message: Identify.__('Re-order success.'), auto_dismiss: true }]);
    }

    const cols = [
        { title: Identify.__("Order #"), width: "14.02%" },
        { title: Identify.__("Date"), width: "15.67%" },
        { title: Identify.__("Total"), width: "12.06%" },
        { title: Identify.__("Status"), width: "12.58%" },
        { title: Identify.__(""), width: "12.27%" },
        { title: Identify.__(""), width: "12.27%" }
    ];
    // const limit = 2;
    const currentPage = 1;

    const scrollTop = () => {
        smoothScrollToView($("#id-message"));
    }

    const renderOrderItem = (item, index) => {
        const arr = item.created_at.split(/[- :]/);
        let date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        date = date.getDate() + "/" + m + "/" + date.getFullYear();
        const location = {
            pathname: "/orderdetails.html/" + item.order_number,
            state: { orderData: item }
        };
        const { order_currency } = item;
        return (
            <tr key={index}>
                <td data-title={Identify.__("Order #")}>
                    {Identify.__(item.order_number)}
                </td>
                <td data-title={Identify.__("Date")}>
                    {date}
                </td>
                <td data-title={Identify.__("Total")}>
                    {formatPrice(item.grand_total, order_currency)}
                </td>
                <td className="order-status" data-title={Identify.__("Status")}>
                    {Identify.__(item.status)}
                </td>
                <td data-title="">
                    <Link className="view-order" onClick={() => scrollTop()} to={location}>{Identify.__('View order')}</Link>
                </td>
                <td data-title="">
                    <div aria-hidden onClick={() => handleReOrderItem(item.order_number)} className="view-order">{Identify.__('Re-order')}</div>
                </td>
            </tr>
        )
    }
    let listOrder = [];

    if (!data) return <Loading />

    if (data && data.items instanceof Array && data.items.length > 0) {
        listOrder = data.items.sort((a, b) => {
            return b.id - a.id
        })
    }

    const noOrders = !data || !data.hasOwnProperty('items') || data.items.length === 0

    return (
        <div className='customer-recent-orders'>
            {noOrders
                ? (
                    <div className="text-center">
                        {Identify.__("You have no items in your order")}
                    </div>
                ) : (
                    <PaginationTable
                        renderItem={renderOrderItem}
                        data={showForDashboard ? listOrder.slice(0, 3) : listOrder}
                        cols={cols}
                        showPageNumber={!showForDashboard}
                        limit={typeof (limit) === 'string' ? parseInt(limit) : limit}
                        setLimit={setLimit}
                        currentPage={currentPage}
                        title={title}
                        setTitle={setTitle}
                    />
                )
            }
        </div>
    )
}

const mapDispatchToProps = {
    toggleMessages,
}

export default connect(null, mapDispatchToProps)(OrderList);
