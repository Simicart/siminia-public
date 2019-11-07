import React from 'react'
import Identify from 'src/simi/Helper/Identify'
import Deleteicon from 'src/simi/BaseComponents/Icon/Trash'
import Image from 'src/simi/BaseComponents/Image'
import {configColor} from 'src/simi/Config'
import { Price } from '@magento/peregrine'
import { resourceUrl, logoUrl } from 'src/simi/Helper/Url'
import ReactHTMLParse from 'react-html-parser';
require('./cartItem.scss')

const CartItem = props => {
    const { currencyCode, item, isPhone, itemTotal, handleLink } = props
    const tax_cart_display_price = 3; // 1 - exclude, 2 - include, 3 - both

    const rowPrice = tax_cart_display_price == 1 ? itemTotal.price : itemTotal.price_incl_tax
    const itemprice = (
        <Price
            currencyCode={currencyCode}
            value={rowPrice}
        />
    )
    const rowTotal = tax_cart_display_price == 1 ? itemTotal.row_total : itemTotal.row_total_incl_tax
    const subtotal = itemTotal && rowTotal && <Price
            currencyCode={currencyCode}
            value={rowTotal}
        />

    const optionText = [];
    if (item.options) {
        const options = item.options;
        for (const i in options) {
            const option = options[i];
            optionText.push(
                <div key={Identify.randomString(5)}>
                    <b>{option.label}</b> : {ReactHTMLParse(option.value)}
                </div>
            );
        }
    }
    
    const updateCartItem = (quantity) => {
        const payload = {
            item: item,
            quantity: quantity
        };
        props.updateCartItem(payload, item.item_id);
    }

    const location = `/product.html?sku=${item.simi_sku?item.simi_sku:item.sku}`
    const image = (item.image && item.image.file)?item.image.file:item.simi_image
    return (
        <div key={Identify.randomString(5)} className='cart-siminia-item'>
            <div className='img-and-name'>
                <div 
                    role="presentation"
                    onClick={() => {
                        handleLink(location)
                    }}
                    className='img-cart-container'
                    style={{borderColor: configColor.image_border_color}}>
                    <Image 
                        src={
                            image ? 
                            resourceUrl(image, {
                                type: 'image-product',
                                width: 300
                            }):
                            logoUrl()
                        } 
                        alt={item.name} />
                </div>
                <div className='cart-item-info'>
                    <div className='des-cart'>
                        <div 
                        role="presentation"
                            style={{color: configColor.content_color}}
                            onClick={()=>{
                                handleLink(location)
                            }}>
                            <div className="item-name">{item.name}</div>
                        </div>
                        <div className='item-sku'>{Identify.__('Product code:')} {item.sku}</div>
                        <div className='item-options'>{optionText}</div>
                    </div>
                    
                </div>
            </div>
            <div className="sub-item item-price">
                {isPhone && <div className='item-label'>{Identify.__('Unit Price')}</div>}
                <div className='cart-item-value' style={{color: configColor.price_color}}>{itemprice}</div>
            </div>
            <div className='sub-item item-qty'>
                {isPhone &&<div className='item-label'>{Identify.__('Qty')}</div>}
                <input
                    min={1}
                    type="number"
                    pattern="[1-9]*"
                    defaultValue={item.qty}
                    onBlur={(event) =>
                        {
                            if(parseInt(event.target.value, 10) !== parseInt(item.qty, 10))
                                updateCartItem(parseInt(event.target.value, 10))
                        }
                    }
                    onKeyUp={e => {
                        if(e.keyCode === 13){
                            if(parseInt(event.target.value, 10) !== parseInt(item.qty, 10))
                                updateCartItem(parseInt(event.target.value, 10))
                        }
                    }}
                />
            </div>
            <div className='sub-item  item-subtotal'>
                {isPhone && <div className='item-label'>{Identify.__('Total Price')}</div>}
                <div className='cart-item-value' style={{color: configColor.price_color}}>{subtotal}</div>
            </div>
            <div 
                role="button"
                tabIndex="0"
                className='sub-item item-delete' 
                onClick={() => props.removeFromCart(item)}
                onKeyUp={() => props.removeFromCart(item)}
            >
                <Deleteicon
                    style={{width: '22px', height: '22px'}} />
            </div>
        </div>
    );
}
export default CartItem;