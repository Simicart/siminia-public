import React, { useState, useEffect } from "react";
import "../styles/styles.scss";
import { useQuery } from "@apollo/client";
import GET_PRODUCT_DESCRIPTION from "../talons/useQueryDescription";
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
import MessagePopUp from "./MessagePopUp";
import AddCartPopUp from "./AddCartPopUp";
import { useWindowSize } from '@magento/peregrine';

const ComparisonList = () => {
    const comparisonList = JSON.parse(localStorage.getItem('comparison-list'))
    const listUrlKey = []

    if (comparisonList) {
        for (let i = 0; i < comparisonList.length; i++) {
            listUrlKey.push(comparisonList[i].url_key)
        }
    }

    const { data, loading } = useQuery(GET_PRODUCT_DESCRIPTION, {
        variables: {
            urlKey: listUrlKey
        },
        skip: listUrlKey.length === 0
    })

    if (listUrlKey.length > 0 && !loading) {
        for (let i = 0; i < comparisonList.length; i++) {
            comparisonList[i].description = data.products.items[i].description
        }
        localStorage.setItem('comparison-list', JSON.stringify(comparisonList))
    }

    const reload = localStorage.getItem("reload");
    const [openRemovePopUp, setOpenRemovePopUp] = useState(false)
    const [isOpenRemovePopUp, setIsOpenRemovePopUp] = useState(false)
    const [openMessagePopUp, setOpenMessagePopUp] = useState(reload ? true : false)
    const [isOpen, setIsOpen] = useState(reload ? true : false)
    const [openAddCartPopUp, setOpenAddCartPopUp] = useState(false)
    const [isOpenAddCartPopUp, setIsOpenAddCartPopUp] = useState(false)
    const [addCartProduct, setAddCartProduct] = useState()
    const [cartData, setCartData] = useState()
    const windowSize = useWindowSize()

    useEffect(() => {
        if (isOpen && openMessagePopUp) {
            localStorage.removeItem("reload")
            const timeoutModal = setTimeout(() => {
                setIsOpen(false)
            }, 5000);
            return () => clearTimeout(timeoutModal);
        }
        if (!isOpen) {
            const timeoutShowModal = setTimeout(() => {
                localStorage.removeItem('changeList')
                setOpenMessagePopUp(false)
            }, 1000)

            return () => clearTimeout(timeoutShowModal);
        }
    }, [isOpen]);
    
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

    const flexDisplay = () => {
        if (comparisonList.length === 1) {
            return '0 0 100%'
        }
        if (comparisonList.length === 2) {
            if (windowSize.innerWidth <= 600) {
                return '0 0 100%'
            }
            return '0 0 50%'
        }
        if (comparisonList.length === 3) {
            if (windowSize.innerWidth <= 760) {
                return '0 0 50%'
            }
            return '0 0 calc(100% / 3)'
        }
        if (comparisonList.length === 4) {
            if (windowSize.innerWidth <= 1024) {
                return '0 0 calc(100% / 3)'
            }
            return '0 0 25%'
        }
        if (comparisonList.length >= 5) {
            if (comparisonList.length === 5 && windowSize.innerWidth <= 1280) {
                return '0 0 25%'
            }
            return '0 0 20%'
        }
    }

    const [
        addProductToCart,
        { loading: cartLoading }
    ] = useMutation(ADD_PRODUCT_TO_CART, {
        onCompleted: data => {
            setCartData(data)
            setOpenAddCartPopUp(true)
            setIsOpenAddCartPopUp(true)
        }
    });

    const [
        addProductToWishlist,
        { loading: wishlistLoading }
    ] = useMutation(ADD_PRODUCT_TO_WISHLIST, {
        onCompleted: data => {
            if (data) history.push('/wishlist')
        }
    });

    const handleAddProductToCart = (element) => {
        const cart_id = JSON.parse(
            localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')
        ).value;

        if (element.__typename !== 'SimpleProduct') {
            history.push(`/${element.url_key}.html`)
        }

        else {
            setAddCartProduct(element)
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
            {(cartLoading || wishlistLoading) && (<div className="cmp-loading-indicator">
                {fullPageLoadingIndicator}
            </div>)}
            <h1 className="cmp-title">Compare Products</h1>
            {comparisonList && (<button onClick={() => window.print()} className="cmp-print-btn">Print This Page</button>)}
            {comparisonList ? (<div className="cmp-list-wrapper" style={{ gridTemplateColumns: gridTemplateColumns() }}>
                <div className="cmp-product-list">
                    {comparisonList.map((element, index) => (
                        <div style={{ flex: flexDisplay(), padding: 15, position: 'relative' }}>
                            <button className="cmp-remove-btn" onClick={() => {
                                setRemoveType('single')
                                setIndex(index)
                                setOpenRemovePopUp(true)
                                setIsOpenRemovePopUp(true)
                            }}>
                                <X size={18} color='#757575'></X>
                            </button>
                            <a href={`/${element.url_key}.html`}>
                                <img src={element.small_image} className="cmp-product-image"></img>
                            </a>
                            <a href={`/${element.url_key}.html`}>
                                <p dangerouslySetInnerHTML={{ __html: element.name }} className="cmp-product-name"></p>
                            </a>
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
                                {element.stock_status !== 'OUT_OF_STOCK' ? 
                                (<button className="cmp-btn-add-cart" onClick={() => handleAddProductToCart(element)}>Add to Cart</button>) :
                                (<button className="cmp-btn-out-stock">Out of Stock</button>)}
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
                        <div style={{ flex: flexDisplay(), padding: 15, borderTop: '1px solid #bbb' }}>
                            <h1>{element.sku}</h1>
                        </div>
                    ))}
                </div>

                {comparisonList.find(element => element.description) && (<div className="cmp-des">
                    <h3>Description</h3>
                </div>)}

                {comparisonList.find(element => element.description) && (<div className="cmp-des-list">
                    {comparisonList.map((element) => (
                        <div style={{ flex: flexDisplay(), padding: 15 }}>
                            <RichContent html={element.description?.html ? element.description?.html : (element.description ? element.description : '')}></RichContent>
                        </div>
                    ))}
                </div>)}
            </div>) : (<p style={{ marginTop: 20, fontSize: 16 }}>You have no items to compare.</p>)}
            {openRemovePopUp && (<RemovePopUp isOpen={isOpenRemovePopUp} setIsOpen={setIsOpenRemovePopUp} index={index}
                setOpenRemovePopUp={setOpenRemovePopUp} removeType={removeType}></RemovePopUp>)}
            {openMessagePopUp && (<MessagePopUp isOpen={isOpen} setIsOpen={setIsOpen}></MessagePopUp>)}
            {openAddCartPopUp && (<AddCartPopUp isOpen={isOpenAddCartPopUp} setIsOpen={setIsOpenAddCartPopUp}
                setOpenAddCartPopUp={setOpenAddCartPopUp} cartData={cartData} addCartProduct={addCartProduct}></AddCartPopUp>)}
        </div>
    )
}

export default ComparisonList