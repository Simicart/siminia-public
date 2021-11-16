import React from "react";
import Identify from "src/simi/Helper/Identify";
import { formatPrice } from "src/simi/Helper/Pricing";
import { Whitebtn } from "src/simi/BaseComponents/Button";
import ReactHTMLParse from "react-html-parser";
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { Link, connect } from 'src/drivers';
import { getCartDetails } from 'src/actions/cart';
import { useWindowSize } from '@magento/peregrine';
import { useMyOrderDetails } from 'src/simi/talons/MyAccount/useMyOrderDetails';
import {
    GET_ORDER_DETAIL,
    RE_ORDER_ITEMS
} from '../../Components/Orders/OrderPage.gql';
import "./../../style.scss";

const Detail = (props) => {
    const { history, toggleMessages, orderId } = props;

    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const isSmallPhone = windowSize.innerWidth < 601;

    if (!orderId) {
        toggleMessages([{ type: 'error', message: Identify.__('Order number is required.'), auto_dismiss: true }]);
        history.push('/orderhistory.html');
        return null;
    }

    const {
        data,
        reorder
    } = useMyOrderDetails({
        toggleMessages,
        orderNumber: orderId,
        query: { getOrderDetail: GET_ORDER_DETAIL },
        mutation: { reOrderItems: RE_ORDER_ITEMS }
    });


    if (!data) {
        return null;
        // return <Loading />;
    }

    const getDateFormat = dateData => {
        const arr = dateData.split(/[- :]/);
        let date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        date = date.getDate() + "/" + m + "/" + date.getFullYear();
        return date;
    };

    const getFormatPrice = (value, currency) => {
        return formatPrice(Number(value), currency);
    }

    const onBackOrder = () => {
        history.push({ pathname: '/orderhistory.html' });
    }

    const renderSummary = () => {
        let html = null;
        if (data) {
            html = (
                <div className="order-detail__summary">
                    <div className="detail-col">
                        <div className="line-num">
                            <b>{Identify.__("Order Number:")}</b>
                            <span style={{ marginInlineStart: 26 }}>
                                {data.order_number}
                            </span>
                        </div>
                        <div className="line-num">
                            <b>{Identify.__("Order placed on:")}</b>
                            <span style={{ marginInlineStart: 16 }}>
                                {getDateFormat(data.created_at)}
                            </span>
                        </div>
                        <div className="line-num">
                            <b>{Identify.__("Order status:")}</b>
                            <span
                                className="green"
                                style={{
                                    marginInlineStart: 42,
                                    textTransform: "capitalize"
                                }}
                            >
                                {data.status}
                            </span>
                        </div>
                    </div>
                    {data.shipping_address &&
                        Object.keys(data.shipping_address).length > 0 && (
                            <div className="detail-col">
                                <div className="line-num">
                                    <b>{Identify.__("Delivery Address:")}</b>
                                    <div className="address green">
                                        {data.shipping_address.street && (
                                            <span style={{ display: "block" }}>
                                                {ReactHTMLParse(
                                                    data.shipping_address
                                                        .street
                                                )}
                                            </span>
                                        )}
                                        {data.shipping_address.city && (
                                            <span style={{ display: "block" }}>
                                                {data.shipping_address.city}
                                            </span>
                                        )}
                                        {data.shipping_address.postcode && (
                                            <span style={{ display: "block" }}>
                                                {data.shipping_address.postcode}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            );
        }
        return html;
    };

    const renderItem = items => {
        let html = null;
        const currency = data.prices.sub_total.currency;
        if (items.length > 0) {
            html = items.map((item, index) => {
                let location = `/product.html?sku=${item.simi_sku ? item.simi_sku : item.sku}`
                if (item.url_key) location = `/${item.url_key}.html`;

                return (
                    <div className="order-detail-line" key={index}>
                        <div className="detail-order__col img-item">
                            {isPhone && <b>{Identify.__('Item')}</b>}
                            <Link to={location} className="img-name-col">
                                <div className="img-order-container" >
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="order-item-info">
                                    <div className="des-order">
                                        <div className="item-name">
                                            {ReactHTMLParse(item.name)}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="detail-order__col product-code">
                            {isPhone && <b>{Identify.__('Product code')}</b>}
                            {item.sku}
                        </div>
                        <div className="detail-order__col item-qty">
                            {isPhone && <b>{Identify.__('Quantity')}</b>}
                            <span>{parseInt(item.qty, 10)}</span>
                        </div>
                        <div className="detail-order__col">
                            {isPhone && <b>{Identify.__('Unit Price')}</b>}
                            <div className="cart-item-value">
                                {getFormatPrice(item.price, currency)}
                            </div>
                        </div>
                        <div className="detail-order__col">
                            {isPhone && <b>{Identify.__('Total Price')}</b>}
                            <div className="cart-item-value">
                                {getFormatPrice(item.row_total, currency)}
                            </div>
                        </div>
                    </div>
                );
            });
        }
        return html;
    };

    const renderTableItems = () => {
        let html = null;
        if (data) {
            html = (
                <div className="order-detail-table">
                    {!isPhone && <div className="order-header">
                        <div className="detail-order__col">
                            {Identify.__("Item")}
                        </div>
                        <div className="detail-order__col">
                            {Identify.__("Product Code")}
                        </div>
                        <div className="detail-order__col">
                            {Identify.__("Quantity")}
                        </div>
                        <div className="detail-order__col">
                            {Identify.__("Unit Price")}
                        </div>
                        <div className="detail-order__col">
                            {Identify.__("Total price")}
                        </div>
                    </div>}
                    <div className="order-body">
                        {data.items.length > 0
                            ? renderItem(data.items)
                            : Identify.__("No product found!")}
                    </div>
                </div>
            );
        }
        return html;
    };

    const renderFooter = () => {
        const totalPrice = data.prices;

        return (
            <div className="detail-order-footer">
                <div className="box-total-price">
                    {totalPrice && <div className="total-sub-price-container">
                        <div className="summary-price-line">
                            <span className="bold">{Identify.__('Subtotal')}</span>
                            {<span className="price">{getFormatPrice(totalPrice.sub_total.value, totalPrice.sub_total.currency)}</span>}
                        </div>
                        <div className="summary-price-line">
                            <span className="bold">{Identify.__('VAT')}</span>
                            {getFormatPrice(totalPrice.tax.value, totalPrice.tax.currency)}
                        </div>
                        {totalPrice.discount && parseFloat(totalPrice.discount.value) > 0 &&
                            <div className="summary-price-line total">
                                <span className="bold">{Identify.__('Discount')}</span>
                                <span className="price">{getFormatPrice(totalPrice.discount.value, totalPrice.discount.currency)}</span>
                            </div>
                        }
                        <div className="summary-price-line total">
                            <span className="bold">{Identify.__('Total')}</span>
                            <span className="price">{getFormatPrice(totalPrice.grand_total.value, totalPrice.grand_total.currency)}</span>
                        </div>
                    </div>}

                    <Whitebtn className="back-all-orders" text={Identify.__('Back to all orders')} onClick={onBackOrder} />
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-acc-order-detail">
            <div className="customer-page-title">
                {Identify.__("Order overview")}
            </div>
            {renderSummary()}
            <Whitebtn
                className="back-all-orders"
                text={Identify.__('Re-order')}
                style={{ width: "20%", marginBottom: "10px" }}
                onClick={() => reorder(data.order_number)}
            />
            {renderTableItems()}
            {renderFooter()}
        </div>
    );
}

const mapDispatchToProps = {
    toggleMessages,
    getCartDetails
}

export default connect(
    null,
    mapDispatchToProps
)(Detail);
