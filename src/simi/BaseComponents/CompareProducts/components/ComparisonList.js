import React, { useState } from "react";
import "../styles/styles.scss";
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import { StaticRate } from '../../Rate'
import { useHistory } from 'react-router-dom'
import { Heart, X } from 'react-feather';
import ADD_PRODUCT_TO_CART from '../talons/useAddProductToCart'
import ADD_PRODUCT_TO_WISHLIST from '../talons/useAddProductToWishlist'
import { fullPageLoadingIndicator } from "@magento/venia-ui/lib/components/LoadingIndicator"
import { useMutation } from '@apollo/client'
import Price from '../../GridItem/Price'
import RemovePopUp from "./RemovePopUp";

const ComparisonList = () => {
    const comparisonList = JSON.parse(localStorage.getItem('comparison-list'))
    const [isOpen, setIsOpen] = useState(false)
    const [openRemovePopUp, setOpenRemovePopUp] = useState(false)
    const [removeType, setRemoveType] = useState()
    const [index, setIndex] = useState(-1)
    const history = useHistory()

    const gridTemplateColumns = () => {
        if (comparisonList.length === 1) {
            return '1fr 1fr'
        }
        if (comparisonList.length === 2) {
            return '1fr 2fr'
        }
        if (comparisonList.length === 3) {
            return '1fr 3fr'
        }
        if (comparisonList.length === 4) {
            return '1fr 4fr'
        }
        if (comparisonList.length >= 5) {
            return '1fr 5fr'
        }
    }

    const [
        addProductToCart,
        { loading }
    ] = useMutation(ADD_PRODUCT_TO_CART);

    const [
        addProductToWishlist
    ] = useMutation(ADD_PRODUCT_TO_WISHLIST, {
        onCompleted: data => {
            if (data) history.push('/wishlist')
        }
    });

    const handleAddProductToCart = (element) => {
        const cart_id = JSON.parse(
            localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')
        ).value;

        if (element.__typename === 'ConfigurableProduct') {
            history.push(`/${element.url_key}.html`)
        }
        else {
            addProductToCart({
                variables: {
                    cartId: cart_id.slice(1, cart_id.length - 1),
                    cartItems: [{
                        sku: element.sku,
                        quantity: 1
                    }]
                }
            })
        }
    }

    const handleAddProductToWishlist = (element) => {
        if (!localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__signin_token')) {
            history.push('/sign-in')
        }
        else {
            addProductToWishlist({
                variables: {
                    wishlistId: 0,
                    wishlistItems: [{
                        sku: element.sku,
                        quantity: 1
                    }]
                }
            })
        }
    }

    return (
        <div className="cmp-wrapper">
            {(loading) && (<div className="cmp-loading-indicator">
                {fullPageLoadingIndicator}
            </div>)}
            <h1 className="cmp-title">Compare Products</h1>
            <div className="cmp-list-wrapper" style={{ gridTemplateColumns: gridTemplateColumns() }}>
                <div className="cmp-product-list">
                    {comparisonList.map((element, index) => (
                        <div style={{ flex: '0 0 20%', padding: 15, position: 'relative' }}>
                            <button className="cmp-remove-btn" onClick={() => {
                                setRemoveType('single')
                                setIndex(index)
                                setOpenRemovePopUp(true)
                                setIsOpen(true)
                            }}>
                                <X size={18} color='#757575'></X>
                            </button>
                            <img src={element.small_image} className="cmp-product-image"></img>
                            <p dangerouslySetInnerHTML={{ __html: element.name }} className="cmp-product-name"></p>
                            {element.review_count > 1 && (<div className="cmp-review-wrapper">
                                <StaticRate rate={element.rating_summary}></StaticRate>
                                <button onClick={() => history.push({
                                    pathname: `/${element.url_key}.html`,
                                    state: {
                                        autofocus: 'review'
                                    }
                                })} className="cmp-review-btn">
                                    {`(${element.review_count} Reviews)`}
                                </button>
                            </div>)}
                            <div className="cmp-price-wrapper">
                                {element.__typename === 'ConfigurableProduct' && (<p style={{ marginRight: 3 }}>As low as</p>)}
                                <Price prices={element.price} type={element.type_id}></Price>
                            </div>
                            <div className="cmp-btn-wrapper">
                                <button className="cmp-btn-add-cart" onClick={() => handleAddProductToCart(element)}>Add to Cart</button>
                                <button onClick={() => handleAddProductToWishlist(element)}>
                                    <Heart></Heart>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cmp-sku">
                    <h3>SKU</h3>
                </div>

                <div className="cmp-sku-list">
                    {comparisonList.map((element) => (
                        <div style={{ flex: '0 0 20%', padding: 15, borderTop: '1px solid #bbb' }}>
                            <h1>{element.sku}</h1>
                        </div>
                    ))}
                </div>

                <div className="cmp-des">
                    <h3>Description</h3>
                </div>

                <div className="cmp-des-list">
                    {comparisonList.map((element) => (
                        <div style={{ flex: '0 0 20%', padding: 15 }}>
                            <RichContent html={element.description.html}></RichContent>
                        </div>
                    ))}
                </div>
            </div>
            {openRemovePopUp && (<RemovePopUp isOpen={isOpen} setIsOpen={setIsOpen} index={index}
                setOpenRemovePopUp={setOpenRemovePopUp} removeType={removeType}></RemovePopUp>)}
        </div>
    )
}

export default ComparisonList