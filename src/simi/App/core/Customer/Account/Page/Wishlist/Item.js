import React from "react";
import Identify from "src/simi/Helper/Identify";
import { Colorbtn } from 'src/simi/BaseComponents/Button'
import { configColor } from 'src/simi/Config'
import ReactHTMLParse from 'react-html-parser';
import { Link } from 'src/drivers';
import Trash from 'src/simi/BaseComponents/Icon/Trash';
import { hideFogLoading, showFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'
import { productUrlSuffix } from 'src/simi/Helper/Url'
import { formatPrice } from 'src/simi/Helper/Pricing';
import Price from 'src/simi/BaseComponents/Price'
import Image from 'src/simi/BaseComponents/Image'
import { prepareProduct } from 'src/simi/Helper/Product'

const Item = props => {
    const { item, history, toggleMessages } = props;
    const product = prepareProduct(item.product);

    const location = {
        pathname: '/' + product.url_key + productUrlSuffix(),
        state: {
            product_sku: product.sku,
            product_id: product.id,
            item_data: item
        },
    }

    const addToCart = (id) => {
        props.addWishlistToCart(id);
    }

    const onTrashItem = (id) => {
        if (id) {
            if (confirm(Identify.__('Are you sure you want to delete this product?')) == true) {
                handleTrashItem(id)
            }
        }
    }

    const handleTrashItem = (id) => {
        props.removeItem(id);
    }

    const addToCartString = Identify.__('Buy Now')

    const image = (
        <div
            className="siminia-product-image"
            style={{
                borderColor: configColor.image_border_color,
                backgroundColor: 'white'
            }}>
            <Link to={location}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, width: '100%', padding: 1 }}>
                    <Image src={item.product.small_image.url} alt={item.product.name} />
                </div>
            </Link>
            <span
                role="presentation"
                className="trash-item"
                style={{
                    position: 'absolute', bottom: 1, left: 1, width: 30, height: 30,
                    cursor: 'pointer', zIndex: 1
                }}
                onClick={() => onTrashItem(item.id)}>
                <Trash style={{ fill: '#333132', width: 30, height: 30 }} />
            </span>
        </div>
    )

    const itemStock = (product && product.stock_status && product.stock_status === 'OUT_OF_STOCK') ? false : true;
    const itemAction =
        <div className="product-item-action">
            {
                (
                    itemStock && (
                        (product.type_id === 'simple' && !product.options) ||
                        (product.type_id === 'virtual' && !product.options) ||
                        (product.type_id === 'downloadable' && !product.links_purchased_separately)
                    )
                ) ?
                    <Colorbtn
                        style={{ backgroundColor: configColor.button_background, color: configColor.button_text_color }}
                        className="grid-add-cart-btn"
                        onClick={() => addToCart(item.id, location)}
                        text={addToCartString} /> : ''
            }
            <Link
                className="view-link"
                to={location}
            >{Identify.__('View')}</Link>
        </div>

    return (
        <div className={`product-item siminia-product-grid-item ${item.product.type_id !== 'simple' ? 'two-btn' : 'one-btn'}`}>
            {image}
            <div className="siminia-product-des">
                <Link to={location} className="product-name">{ReactHTMLParse(item.product.name)}</Link>
                <div
                    className="prices-layout"
                    id={`price-${item.product.id}`}
                    style={{ color: configColor.price_color }}>
                    <Price prices={product.price} type={product.type_id} />
                </div>
            </div>
            {itemAction}
        </div>
    );
}

export default Item