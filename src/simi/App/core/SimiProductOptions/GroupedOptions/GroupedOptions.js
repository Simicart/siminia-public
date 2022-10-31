import React from 'react';
import {Qty} from 'src/simi/BaseComponents/Input'
import Identify from 'src/simi/Helper/Identify';
import {formatPrice as helperFormatPrice} from 'src/simi/Helper/Pricing';
import {FormattedMessage} from 'react-intl';
import './GroupedOptions.scss'

export const GroupedOptions = (props) => {
    const product = props.product;
    const useProductFullDetailProps = props.useProductFullDetailProps
    const {handleGroupedOptionsChange} = useProductFullDetailProps

    const items = product.items
    if (!(!!items && items.length > 0)) {
        return null;
    }
    const header = (
        <div className="row">
            <div className={'product-title'}>
                <FormattedMessage
                    id="Product Name"
                    defaultMessage="Product Name"
                />
            </div>
            <div className={'product-title'}>
                <FormattedMessage
                    id="Quantity"
                    defaultMessage="Quantity"
                />
            </div>
        </div>
    );
    const itemsHTML = items.map(function (item, index) {
        const {product, qty} = item;
        
        const {price_range, id} = product
        const handleChange = (qty) => {
            handleGroupedOptionsChange(id, qty)
        }
        return (
            <div id={`attribute-${id}`} key={index} className={`row product-options-group-item`}>
                <div className={`col-sm-8 col-xs-8 ${Identify.isRtl() ? 'pull-right' : ''}`}>
                    <div className={'product-name'}>{product.name}</div>
                    <div
                        className="price-simple">{helperFormatPrice(price_range.minimum_price.final_price.value, price_range.minimum_price.final_price.currency)}</div>
                </div>
                <div className={'option-qty'}>
                    {
                        <Qty
                            dataId={id}
                            key={id}
                            value={qty}
                            inputStyle={{
                                borderRadius: 0,
                                border: 'solid #E8E8E8 1px',
                                height:'40',
                                width:'80px',
                                textAlign: "center"
                            }}
                            onChange={(qty => handleChange(qty) || null)}
                        />
                    }
                </div>
            </div>);
    })
    return (
        <div className={'grouped-options'}>
            {header}
            {itemsHTML}
        </div>
    );
};
