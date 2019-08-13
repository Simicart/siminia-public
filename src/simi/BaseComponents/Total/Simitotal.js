/*
Showing total from config like the sweet old time :)
Avoid using it, ask Cody before any rolling trial
*/

import React from 'react'
import Identify from 'src/simi/Helper/Identify'
import { Price } from '@magento/peregrine'
import PropTypes from 'prop-types'
import {configColor} from 'src/simi/Config'

const Total = props => {
    const { classes, currencyCode, data } = props
    const tax_cart_display_subtotal = 3; // 1 - exclude, 2 - include, 3 - both
    const tax_cart_display_shipping = 3; // 1 - exclude, 2 - include, 3 - both
    const tax_cart_display_grandtotal = 0; // 0 - include, 1 - both

    let subtotal = <div/>;
    if ((tax_cart_display_subtotal === 1 || data.subtotal === data.subtotal_incl_tax) && data.subtotal) {
        const subtotal_excl_tax = Identify.__('Subtotal') + Identify.__(':');
        subtotal = (<div key="subtotal" className={classes["subtotal"]}>
            <div>
                <span className={classes["label"]}>{subtotal_excl_tax}</span>
                <span className={classes["price"]} style={{color : configColor.price_color}}><Price currencyCode={currencyCode} value={data.subtotal}/></span>
            </div>
        </div>);
    } else if (tax_cart_display_subtotal === 2  && data.subtotal_incl_tax) {
        const subtotal_incl_tax = Identify.__('Subtotal') + Identify.__(':');
        subtotal = (<div key="subtotal" className={classes["subtotal"]}>
            <div>
                <span className={classes["label"]}>{subtotal_incl_tax}</span>
                <span className={classes["price"]} style={{color : configColor.price_color}}><Price currencyCode={currencyCode} value={data.subtotal_incl_tax}/></span>
            </div>
        </div>);
    } else if (tax_cart_display_subtotal === 3) {
        const subtotal_excl_tax = Identify.__('Subtotal (Excl. Tax)') + Identify.__(':');
        const subtotal_incl_tax = Identify.__('Subtotal (Incl. Tax)') + Identify.__(':');
        subtotal = (<div key="subtotal" className={classes["subtotal"]}>
            {data.subtotal ?
            <div>
                <span className={classes["label"]}>{subtotal_excl_tax}</span>
                <span className={classes["price"]}
                        style={{color: configColor.price_color}}><Price currencyCode={currencyCode} value={data.subtotal}/></span>
            </div> : ''
            }
            {data.subtotal_incl_tax ?
            <div>
                <span className={classes["label"]}>{subtotal_incl_tax}</span>
                <span className={classes["price"]}
                        style={{color: configColor.price_color}}><Price currencyCode={currencyCode} value={data.subtotal_incl_tax}/></span>
            </div> : ''
            }
        </div>);
    }
    let shipping = <div/>;
    if ((tax_cart_display_shipping === 1 || data.shipping_amount === data.shipping_incl_tax) && data.shipping_amount) {
        if (data.shipping_amount) {
            const shipping_hand_excl_tax = Identify.__('Shipping') + ` (${Identify.__('Excl. Tax')}):`;
            shipping = (<div key="shipping" className={classes["shipping"]}>
                <div>
                    <span className={classes["label"]}>{shipping_hand_excl_tax}</span>
                    <span
                        className={classes["price"]} style={{color : configColor.price_color}}><Price currencyCode={currencyCode} value={data.shipping_amount}/></span>
                </div>
            </div>);
        }
    } else if (tax_cart_display_shipping === 2 && data.shipping_incl_tax) {
        if (data.shipping_hand_incl_tax) {
            const shipping_hand_incl_tax = Identify.__('Shipping (Incl. Tax)') + Identify.__(':');
            shipping = (<div key="shipping" className={classes["shipping"]}>
                <div>
                    <span className={classes["label"]}>{shipping_hand_incl_tax}</span>
                    <span
                        className={classes["price"]} style={{color : configColor.price_color}}><Price currencyCode={currencyCode} value={data.shipping_incl_tax}/></span>
                </div>
            </div>);
        }
    } else if (tax_cart_display_shipping === 3 && data.shipping_amount && data.shipping_incl_tax) {
        const shipping_hand_excl_tax = Identify.__('Shipping (Excl. Tax)') + Identify.__(':');
        const shipping_hand_incl_tax = Identify.__('Shipping (Incl. Tax)') + Identify.__(':');
        shipping = (<div key="shipping" className={classes["shipping"]}>
            {data.shipping_amount || data.shipping_amount>=0 ?
            <div>
                <span className={classes["label"]}>{shipping_hand_excl_tax}</span>
                <span
                    className={classes["price"]}
                    style={{color: configColor.price_color}}><Price currencyCode={currencyCode} value={data.shipping_amount}/></span>
            </div> : ''
            }
            {data.shipping_incl_tax || data.shipping_incl_tax >=0 ?
            <div>
                <span className={classes["label"]}>{shipping_hand_incl_tax}</span>
                <span
                    className={classes["price"]}
                    style={{color: configColor.price_color}}><Price currencyCode={currencyCode} value={data.shipping_incl_tax}/></span>
            </div> : ''
            }
        </div>);
    }
    let discount = <div/>;
    if (data.discount_amount) {
        const discount_label = Identify.__('Discount')+ ':';
        discount = (<div key="discount" className={classes["discount"]}>
            <div>
                <span className={classes["label"]}>{discount_label}</span>
                <span className={classes["price"]} style={{color : configColor.price_color}}><Price currencyCode={currencyCode} value={data.discount_amount}/></span>
            </div>
        </div>);
    }
    let tax = <div/>;
    if (data.tax_amount) {
        const tax_label = Identify.__('Tax') + ':';
        tax = (<div key="tax" className={classes["tax"]}>
            <div>
                <span className={classes["label"]}>{tax_label}</span>
                <span className={classes["price"]} style={{color : configColor.price_color}}><Price currencyCode={currencyCode} value={data.tax_amount}/></span>
            </div>
        </div>);
    }

    let grand_total = <div/>;
    if (tax_cart_display_grandtotal === 1) {
        const grand_total_excl_tax = Identify.__('Grand Total (Excl. Tax)') + Identify.__(':');
        const grand_total_incl_tax = Identify.__('Grand Total (Incl. Tax)') + Identify.__(':');
        grand_total = (<div key="grand_total" className={classes["grand_total"]}>
            {data.grand_total_excl_tax !== null ?
            <div>
                <span className={classes["label"]}>{grand_total_excl_tax}</span>
                <span className={classes["price"]}
                        style={{color: configColor.price_color}}><Price currencyCode={currencyCode} value={data.grand_total_excl_tax}/></span>
            </div> : ''
            }
            {data.grand_total !== null ?
            <div>
                <span className={classes["label"]}>{grand_total_incl_tax}</span>
                <span className={classes["price"]}
                        style={{color: configColor.price_color}}><Price currencyCode={currencyCode} value={data.grand_total}/></span>
            </div> : ''
            }
        </div>);
    } else if (data.grand_total) {
        const grand_total_incl_tax = Identify.__('Grand Total') + Identify.__(':');
        grand_total = (<div key="grand_total" className={classes["grand_total"]}>
            <div>
                <span className={classes["label"]}>{grand_total_incl_tax}</span>
                <span className={classes["price"]} style={{color : configColor.price_color}}><Price currencyCode={currencyCode} value={data.grand_total}/></span>
            </div>
        </div>);
    }

    let custom = <div className={classes["custom"]}/>;
    if (data.custom_rows) {
        const custom_rows = data.custom_rows;
        const rows = [];
        for (const i in custom_rows) {
            const row = custom_rows[i];
            const title = row.title;
            const value = <Price currencyCode={currencyCode} value={row.value}/>
            if(row.hasOwnProperty('value_string') && row.value_string ){
                value = row.value_string;
            }
            const el = <div key={i}><span className={classes["label"]}>{title}:</span>
                <span className={classes["price"]} style={{color : configColor.price_color}}>
                    {value}
                </span></div>;
            rows.push(el);
        }
        custom = <div key="custom" className={classes["custom"]}>{rows}</div>;
    }
    return (
        <div className={classes["cart-total"]} >
            {custom}
            {subtotal}
            {shipping}
            {discount}
            {tax}
            {grand_total}
        </div>
    );
}
Total.contextTypes = {
    classes: PropTypes.object,
    currencyCode: PropTypes.string,
    data: PropTypes.object,
};

export default Total