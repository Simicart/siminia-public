/* eslint-disable prefer-const */
import React, { useState, useEffect } from "react";
import Identify from "src/simi/Helper/Identify";
import { formatPrice } from "src/simi/Helper/Pricing";
import { Whitebtn } from "src/simi/BaseComponents/Button";
import Loading from "src/simi/BaseComponents/Loading";
import ReactHTMLParse from "react-html-parser";
import { Link } from "react-router-dom";
import "./../../style.css";
import { getOrderDetail, getReOrder } from 'src/simi/Model/Orders';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';

const Detail = (props) => {
    const [data, setData] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const { history, classes, isPhone } = props
    const id = history.location.state.orderData.increment_id || null;

    useEffect(() => {
        const api = Identify.ApiDataStorage('quoteOrder') || {}
        if (api.hasOwnProperty(id)) {
            const data = api[id]
            setData(data)
            setLoaded(true)
        }
        if (!data && !loaded && id) {
            getOrderDetail(id, processData)
        }
    }, [])

    const getDataReOrder = (data) => {
        if (data) {
            hideFogLoading();
            props.toggleMessages([{ type: 'success', message: data.message ,auto_dismiss:true}])
        }
    }

    const processData = (data) => {
        let dataArr = {}
        const key = id;
        let dataOrder = data.order;
        setData(dataOrder)
        dataArr[key] = dataOrder;
        Identify.ApiDataStorage("quoteOrder", 'update', dataArr);
    }

    const getDateFormat = dateData => {
        const date = new Date(dateData);
        const day = date.getDate();
        const month =
            date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1;
        const year = date.getFullYear();

        return day + "/" + month + "/" + year;
    };

    const getFormatPrice = value => {
        return formatPrice(Number(value))
    }

    const onBackOrder = () => {
        history.push({ pathname: '/orderhistory.html' });
    }

    const renderSummary = () => {
        let html = null;
        if (data) {
            html = (
                <div className={classes["order-detail__summary"]}>
                    <div className={classes["detail-col"]}>
                        <div className={classes["line-num"]}>
                            <b>{Identify.__("Order Number:")}</b>
                            <span style={{ marginLeft: 26 }}>
                                {data.increment_id}
                            </span>
                        </div>
                        <div className={classes["line-num"]}>
                            <b>{Identify.__("Order placed on:")}</b>
                            <span style={{ marginLeft: 16 }}>
                                {getDateFormat(data.created_at)}
                            </span>
                        </div>
                        <div className={classes["line-num"]}>
                            <b>{Identify.__("Order status:")}</b>
                            <span
                                className={classes["green"]}
                                style={{
                                    marginLeft: 42,
                                    textTransform: "capitalize"
                                }}
                            >
                                {data.status}
                            </span>
                        </div>
                    </div>
                    {data.shipping_address &&
                        Object.keys(data.shipping_address).length > 0 && (
                            <div className={classes["detail-col"]}>
                                <div className={classes["line-num"]}>
                                    <b>{Identify.__("Delivery Address:")}</b>
                                    <div className={`${classes["address"]} ${classes["green"]}`}>
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
        console.log(items);
        let html = null;
        const totalPrice = data.total;

        if (items.length > 0) {
            html = items.map((item, index) => {
                let optionText = [];
                if (item.option) {
                    let options = item.option;
                    for (let i in options) {
                        let option = options[i];
                        optionText.push(
                            <div key={Identify.makeid()}>
                                <b>{option.option_title}</b> :{" "}
                                {ReactHTMLParse(option.option_value)}
                            </div>
                        );
                    }
                }

                const location = `/product.html?sku=${item.simi_sku?item.simi_sku:item.sku}`

                return (
                    <div className={classes["order-detail-line"]} key={index}>
                        <div className={`${classes["detail-order__col"]} ${classes["img-item"]}`}>
                            {isPhone && <b>{Identify.__('Item')}</b>}
                            <Link
                                to={location}
                                className={classes["img-name-col"]}
                            >
                                <div
                                    className={classes["img-order-container"]}
                                    style={{}}
                                >
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className={classes["order-item-info"]}>
                                    <div
                                        className={classes["des-order"]}
                                        style={{}}
                                    >
                                        <div className={classes["item-name"]}>
                                            {ReactHTMLParse(item.name)}
                                        </div>
                                        {optionText.length > 0 && (
                                            <div className={classes["item-options"]}>
                                                {optionText}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className={`${classes["detail-order__col"]} ${classes["product-code"]}`}>
                            {isPhone && <b>{Identify.__('Product code')}</b>}
                            {item.sku}
                        </div>
                        <div className={`${classes["detail-order__col"]} ${classes["item-size"]}`}>
                            {isPhone && <b>{Identify.__('Size')}</b>}
                            {optionText}
                        </div>
                        <div className={`${classes["detail-order__col"]} ${classes["item-qty"]}`}>
                            {isPhone && <b>{Identify.__('Quantity')}</b>}
                            <span>{parseInt(item.qty_ordered, 10)}</span>
                        </div>
                        <div className={classes["detail-order__col"]}>
                            {isPhone && <b>{Identify.__('Unit Price')}</b>}
                            <div
                                className={classes["cart-item-value"]}
                                style={{}}
                            >
                                {
                                    totalPrice.tax ? getFormatPrice(item.price_incl_tax) : getFormatPrice(item.price)
                                }
                            </div>
                        </div>
                        <div className={classes["detail-order__col"]}>
                            {isPhone && <b>{Identify.__('Total Price')}</b>}
                            <div
                                className={classes["cart-item-value"]}
                                style={{}}
                            >
                                {
                                    totalPrice.tax
                                        ? getFormatPrice(item.row_total_incl_tax)
                                        : getFormatPrice(item.row_total)
                                }
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
                <div className={classes["order-detail-table"]}>
                    {!isPhone && <div className={classes["order-header"]}>
                        <div className={classes["detail-order__col"]}>
                            {Identify.__("Item")}
                        </div>
                        <div className={classes["detail-order__col"]}>
                            {Identify.__("Product Code")}
                        </div>
                        <div className={classes["detail-order__col"]}>
                            {Identify.__("Size")}
                        </div>
                        <div className={classes["detail-order__col"]}>
                            {Identify.__("Quantity")}
                        </div>
                        <div className={classes["detail-order__col"]}>
                            {Identify.__("Unit Price")}
                        </div>
                        <div className={classes["detail-order__col"]}>
                            {Identify.__("Total price")}
                        </div>
                    </div>}
                    <div className={classes["order-body"]}>
                        {data.order_items.length > 0
                            ? renderItem(data.order_items)
                            : Identify.__("No product found!")}
                    </div>
                </div>
            );
        }
        return html;
    };

    const renderFooter = () => {
        const totalPrice = data.total;

        return (
            <div className={classes["detail-order-footer"]}>
                <div className={classes["delivery-restrictions"]}>
                    <b className={classes["title"]} style={{ display: 'block' }}>{Identify.__('Delivery Restrictions')}</b>
                    <textarea name="delevery_retriction" readOnly defaultValue={data.shipping_restriction} placeholder={Identify.__('e.g. no through route, low bridges etc.')}/>
                </div>
                <div className={classes["box-total-price"]}>
                    {totalPrice && <div className={classes["total-sub-price-container"]}>
                        <div className={classes["summary-price-line"]}>
                            <span className={classes["bold"]}>{Identify.__('Subtotal')}</span>
                            <span className="price">{totalPrice.tax ? getFormatPrice(totalPrice.subtotal_incl_tax) : getFormatPrice(totalPrice.subtotal_excl_tax)}</span>
                        </div>
                        <div className={classes["summary-price-line"]}>
                            <span className={classes["bold"]}>{Identify.__('Delivery')}</span>
                            <span className="price">{totalPrice.tax ? getFormatPrice(totalPrice.shipping_hand_incl_tax) : getFormatPrice(totalPrice.shipping_hand_excl_tax)}</span>
                        </div>
                        <div className={classes["summary-price-line"]}>
                            <span className={classes["bold"]}>{Identify.__('VAT')}</span>
                            <span className="price">{getFormatPrice(totalPrice.tax)}</span>
                        </div>
                        <div className={`${classes["summary-price-line"]} ${classes['total']}`}>
                            <span className={classes["bold"]}>{Identify.__('Total')}</span>
                            <span className={classes["price"]}>{totalPrice.tax ? getFormatPrice(totalPrice.grand_total_incl_tax) : getFormatPrice(totalPrice.shipping_hand_excl_tax)}</span>
                        </div>
                    </div>}

                    <Whitebtn className={classes["back-all-orders"]} text={Identify.__('Back to all orders')} onClick={onBackOrder} />
                </div>
            </div>
        )
    }

    if (!data) {
        return <Loading />;
    }

    return (
        <div className={classes["dashboard-acc-order-detail"]}>
            <div className={classes["customer-page-title"]}>
                {Identify.__("Order overview")}
            </div>
            {renderSummary()}
            <Whitebtn
                className={classes["back-all-orders"]}
                text={Identify.__('Re-order')}
                style={{ width: "20%", marginBottom: "10px" }}
                onClick={() => {
                    showFogLoading();
                    getReOrder(id, getDataReOrder)
                }}
            />
            {renderTableItems()}
            {renderFooter()}
        </div>
        // <div>Hello</div>
    );
}

const mapDispatchToProps = {
    toggleMessages,
}

export default connect(
    null,
    mapDispatchToProps
)(Detail);
