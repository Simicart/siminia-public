import React from 'react';
import defaultClasses from './item.css'
import {configColor} from 'src/simi/Config';
import PropTypes from 'prop-types';
import ReactHTMLParse from 'react-html-parser'
import { mergeClasses } from 'src/classify'
import Price from 'src/simi/BaseComponents/Price';
import {prepareProduct} from 'src/simi/Helper/Product'
import { Link } from 'src/drivers';
import LazyLoad from 'react-lazyload';
import { logoUrl } from 'src/simi/Helper/Url'
import Image from 'src/simi/BaseComponents/Image'
import {StaticRate} from 'src/simi/BaseComponents/Rate'
import Identify from 'src/simi/Helper/Identify'
import { productUrlSuffix, saveDataToUrl } from 'src/simi/Helper/Url';


const Griditem = props => {
    const item = prepareProduct(props.item)
    const logo_url = logoUrl()
    const { classes } = props
    if (!item) return '';
    const itemClasses = mergeClasses(defaultClasses, classes);
    const { name, url_key, id, price, type_id, small_image, simiExtraField } = item
    const product_url = `/${url_key}${productUrlSuffix()}`
    saveDataToUrl(product_url, item)
    const location = {
        pathname: product_url,
        state: {
            product_id: id,
            item_data: item
        },
    }

    const image = (
        <div
            role="presentation"
            className={itemClasses["siminia-product-image"]}
            style={{borderColor: configColor.image_border_color,
                backgroundColor: 'white'
            }}
            >
            <div style={{position:'absolute',top:0,bottom:0,width: '100%', padding: 1}}>
                <Link to={location}>
                    {<Image src={small_image} alt={name}/>}
                </Link>
            </div>
        </div>
    )

    return (
        <div className={`${itemClasses["product-item"]} ${itemClasses["siminia-product-grid-item"]}`}>
            {
                props.lazyImage?
                (<LazyLoad placeholder={<img alt={name} src={logo_url} style={{maxWidth: 60, maxHeight: 60}}/>}>
                    {image}
                </LazyLoad>):
                image
            }
            <div className={itemClasses["siminia-product-des"]}>
                {
                    (simiExtraField && simiExtraField.app_reviews) &&
                    (
                        <div className={itemClasses["item-review-rate"]}>
                            <StaticRate rate={simiExtraField.app_reviews.rate} classes={itemClasses}/>
                            <span className={itemClasses["item-review-count"]}>
                                ({simiExtraField.app_reviews.number} {(simiExtraField.app_reviews.number)?Identify.__('Reviews'):Identify.__('Review')})
                            </span>
                        </div>
                    )
                }
                <div role="presentation" className={`${itemClasses["product-name"]} ${itemClasses["small"]}`} onClick={()=>props.handleLink(location)}>{ReactHTMLParse(name)}</div>
                <div role="presentation" className={`${itemClasses["prices-layout"]} ${Identify.isRtl() ? itemClasses["prices-layout-rtl"] : ''}`} id={`price-${id}`} onClick={()=>props.handleLink(location)}>
                    <Price
                        prices={price} type={type_id}
                    />
                </div>
            </div>
        </div>
    )
}

Griditem.contextTypes = {
    item: PropTypes.object,
    handleLink: PropTypes.func,
    classes: PropTypes.object,
    lazyImage: PropTypes.bool,
}

export default Griditem;
