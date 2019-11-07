import React from "react";
import Identify from "src/simi/Helper/Identify";
import {Colorbtn} from 'src/simi/BaseComponents/Button'
import {configColor} from 'src/simi/Config'
import ReactHTMLParse from 'react-html-parser';
import { Link } from 'src/drivers';
import Trash from 'src/simi/BaseComponents/Icon/Trash';
import { removeWlItem, addWlItemToCart } from 'src/simi/Model/Wishlist'
import {hideFogLoading, showFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import { resourceUrl } from 'src/simi/Helper/Url'
import { formatPrice } from 'src/simi/Helper/Pricing';
import Image from 'src/simi/BaseComponents/Image'
import {productUrlSuffix} from 'src/simi/Helper/Url';

class Item extends React.Component {
    processData(data) {
        hideFogLoading()
        if (data.errors) {
            if (data.errors.length) {
                const errors = data.errors.map(error => {
                    return {
                        type: 'error',
                        message: error.message,
                        auto_dismiss: true
                    }
                });
                this.props.toggleMessages(errors)
            }
        } else if (this.addCart || this.removeItem) {
            if (this.addCart) {
                this.props.toggleMessages([{type: 'success', message: Identify.__('This product has been moved to cart'), auto_dismiss: true}])
                const { getCartDetails } = this.props;
                if (getCartDetails)
                    getCartDetails()
                showFogLoading()
                this.props.getWishlist()
            }
            if (this.removeItem) {
                this.props.toggleMessages([{type: 'success', message: Identify.__('This product has been removed from your wishlist'), auto_dismiss: true}])
                showFogLoading()
                this.props.getWishlist()
            }
        }

        this.addCart = false
        this.removeItem = false;
    }

    addToCart(id, location = false) {
        const item = this.props.item;
        if (item.type_id !== 'simple') {
            if (location)
                this.props.history.push(location)
            return
        }
        this.addCart = true;
        addWlItemToCart(id, this.processData.bind(this))
    }

    onTrashItem = (id) => {
        if(id){
            if (confirm(Identify.__('Are you sure you want to delete this product?')) == true) {
                this.handleTrashItem(id)
            }
        }
    }

    handleTrashItem = (id) => {
        showFogLoading();
        this.removeItem = true;
        removeWlItem(id, this.processData.bind(this))
    }

    render() {
        const storeConfig = Identify.getStoreConfig()
        if (!this.currencyCode)
            this.currencyCode = storeConfig?storeConfig.simiStoreConfig?storeConfig.simiStoreConfig.currency:storeConfig.storeConfig.default_display_currency_code:null
        const {item, classes} = this.props;
        this.location = {
            pathname: item.product_url_key + productUrlSuffix(),
            state: {
                product_sku: item.product_sku,
                product_id: item.product_id,
                item_data: item
            },
        }
        
        const addToCartString = Identify.__('Buy Now')
        
        const image = item.product_image && (
            <div 
                className="siminia-product-image"
                style={{borderColor: configColor.image_border_color,
                    backgroundColor: 'white'
                }}>
                <Link to={this.location}>
                    <div style={{position:'absolute',top:0,bottom:0,width: '100%', padding: 1}}>
                        <Image src={resourceUrl(item.product_image, {
                                type: 'image-product',
                                width: 100
                            })} alt={item.product_name}/>
                    </div>
                </Link>
                <span 
                    role="presentation"
                    className="trash-item"
                    style={{
                        position: 'absolute', bottom: 1, left: 1, width: 30, height: 30, 
                        cursor: 'pointer', zIndex: 1}} 
                    onClick={() => this.onTrashItem(item.wishlist_item_id)}>
                    <Trash style={{fill: '#333132', width: 30, height: 30}} />
                </span>
            </div>
        );

        const itemAction = 
            <div className="product-item-action">
                {
                    item.type_id === 'simple' &&
                    <Colorbtn 
                        style={{backgroundColor: configColor.button_background, color: configColor.button_text_color}}
                        className="grid-add-cart-btn"
                        onClick={() => this.addToCart(item.wishlist_item_id, this.location)}
                        text={addToCartString}/>
                }
                <Link 
                    className="view-link"
                    to={this.location}
                >{Identify.__('View')}</Link>
            </div>
        
        return (
            <div className={`'product-item siminia-product-grid-item ${item.type_id !== 'simple'?'two-btn': 'one-btn'}`}>
                {image}
                <div className="siminia-product-des">
                    <Link to={this.location} className="product-name">{ReactHTMLParse(item.product_name)}</Link>
                    <div 
                        className="prices-layout"
                        id={`price-${item.product_id}`} 
                        style={{color: configColor.price_color}}>
                        {formatPrice(parseFloat(item.product_price))}
                    </div>
                </div>
                {itemAction}
            </div>
        );
    }
}

export default Item