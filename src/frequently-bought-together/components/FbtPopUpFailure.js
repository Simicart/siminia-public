import Modal from 'react-modal';
import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/client';
import TinySlider from 'tiny-slider-react';
import 'tiny-slider/dist/tiny-slider.css';
import { ChevronLeft, ChevronRight, X } from 'react-feather';
import { useQuery } from '@apollo/client';
import CART_DATA from '../talons/useCartData';
import { fullPageLoadingIndicator } from "@magento/venia-ui/lib/components/LoadingIndicator"
import ADD_PRODUCTS_TO_CART from '../talons/useAddProductsToCart';
import { useWindowSize } from '@magento/peregrine';
import '../styles/styles.scss'

const FbtPopUpFailure = ({ isOpen, setIsOpen, setOpenModalFailure, FBT_Brief_Data, popUpType, addCartData, setAddCartData,
    configurableProduct, setOpenModal, setOpenPopUp, fbt_config_data, savedQuantity, savedProduct, setOpenPopUpFailure }) => {

    Modal.setAppElement('#root')

    console.log(addCartData)

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth < 500;

    const countdown_time = fbt_config_data.countdown_time
    const active_countdown = fbt_config_data.active_countdown
    const slide_popup_speed = fbt_config_data.slide_popup_speed
    const slide_popup_auto = fbt_config_data.slide_popup_auto
    const item_popup_slide = fbt_config_data.item_popup_slide
    const product_price = fbt_config_data.product_price
    const popup_btn_text_cart = fbt_config_data.popup_btn_text_cart
    const popup_btn_cart_bg = fbt_config_data.popup_btn_cart_bg
    const popup_btn_cart_cl = fbt_config_data.popup_btn_cart_cl
    const btn_text_viewcart = fbt_config_data.btn_text_viewcart
    const btn_viewcart_bg = fbt_config_data.btn_viewcart_bg
    const btn_viewcart_cl = fbt_config_data.btn_viewcart_cl
    const btn_text_continue = fbt_config_data.btn_text_continue
    const btn_continue_bg = fbt_config_data.btn_continue_bg
    const btn_continue_cl = fbt_config_data.btn_continue_cl
    const continue_button = fbt_config_data.continue_button
    const mini_cart = fbt_config_data.mini_cart
    const mini_checkout = fbt_config_data.mini_checkout

    const [remainingCountdown, setRemainingCountdown] = useState(parseInt(countdown_time))
    const [listProductOptions, setListProductOptions] = useState([])
    const history = useHistory()

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setRemainingCountdown(state => state - 1)
        }, 1000)

        return () => {
            clearInterval(countdownInterval)
        }
    }, [remainingCountdown])

    const [
        addProductsToCart,
        { loading }
    ] = useMutation(ADD_PRODUCTS_TO_CART, {
        onCompleted: data => {
            setAddCartData(data)
            if (data.addProductsToCart.user_errors.length === 0) {
                setOpenModalFailure(false)
                setOpenPopUpFailure(false)
                setOpenModal(true)
                setOpenPopUp(true)
            }
        }
    });

    const initListProductOptions = []
    if (configurableProduct.length > 0) {
        for (const element of configurableProduct) {
            const options = []
            for (let i = 0; i < element.configurable_options.length; i++) {
                options[i] = 'default'
            }
            initListProductOptions.push(options)
        }
    }

    let cartData = ''
    let cartLength = ''
    const cart_id = JSON.parse(
        localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')).value

    if (!addCartData || configurableProduct) {
        const cartQuery = useQuery(CART_DATA, {
            variables: {
                cart_id: cart_id.slice(1, cart_id.length - 1)
            }
        })

        if (cartQuery.loading) return fullPageLoadingIndicator
        if (cartQuery.error) return <p>{cartQuery.error.message}</p>

        cartData = cartQuery.data
    }

    if (popUpType === 'add cart') {
        if (addCartData) {
            cartLength = addCartData.addProductsToCart.cart.items.length - 1
        }
        else if (cartData !== '') {
            cartLength = cartData.cart.items.length - 1
        }
        else {
            cartLength = 0
        }
    }

    if (active_countdown === '1') {
        setTimeout(() => {
            setIsOpen(false)
        }, parseInt(countdown_time) * 1000)
    }

    if (active_countdown === '2') {
        useEffect(() => {
            setTimeout(() => {
                history.push('/cart')
                setIsOpen(false)
            }, parseInt(countdown_time) * 1000)
        }, [])
    }

    const settings = {
        nav: true,
        rewind: true,
        lazyload: true,
        mouseDrag: true,
        items: parseInt(item_popup_slide) > FBT_Brief_Data.length ? FBT_Brief_Data.length : parseInt(item_popup_slide),
        autoplay: Boolean(slide_popup_auto),
        autoplayText: ['', ''],
        speed: parseInt(slide_popup_speed),
        controlText: ['', ''],
        prevButton: '.fbt-pop-up-slider-prev',
        nextButton: '.fbt-pop-up-slider-next',
    }

    const imgStyles = {
        width: '45%',
        height: 180,
        objectFit: "ratio",
        cursor: 'pointer',
        margin: 'auto'
    }

    const addFailureProducts = () => {
        addProductsToCart({
            variables: {
                cartId: cart_id.slice(1, cart_id.length - 1),
                cartItems: [{
                    sku: savedProduct[0].sku,
                    quantity: parseInt(document.getElementById(`fbt-failure-quantity-0`).value) > 0
                        ? parseInt(document.getElementById(`fbt-failure-quantity-0`).value)
                        : parseInt(document.getElementById(`fbt-failure-quantity-0`).defaultValue)
                }]
            }
        })
    }


    const handleOptionsChange = (index, ele, idx) => {
        const tmp = listProductOptions.length !== 0 ? listProductOptions : initListProductOptions
        tmp[index][idx] = document.getElementById(`label${index}${idx}`).value !== 'default'
            ? ele.values[parseInt(document.getElementById(`label${index}${idx}`).value)].uid
            : 'default'
        setListProductOptions(tmp)
    }

    if (popUpType !== 'add cart') {
        return (
            <Modal
                isOpen={isOpen}
                bodyOpenClassName='fbt-pop-up-failure-body'
                portalClassName='fbt-pop-up-failure-portal'
                className={{
                    base: 'fbt-pop-up-failure-content',
                    afterOpen: 'fbt-pop-up-failure-content-afterOpen',
                    beforeClose: 'fbt-pop-up-failure-content-beforeClose'
                }}
                overlayClassName={{
                    base: 'fbt-pop-up-failure-overlay',
                    afterOpen: 'fbt-pop-up-failure-overlay-afterOpen',
                    beforeClose: 'fbt-pop-up-failure-overlay-beforeClose'
                }}
                closeTimeoutMS={500}>
                {loading && (<div className="fbt-pop-up-failure-loading-indicator">
                    {fullPageLoadingIndicator}
                </div>)}
                <div className='fbt-pop-up-failure-wrapper'>
                    <button className='fbt-pop-up-failure-close-button' onClick={() => {
                        setIsOpen(false)
                        setTimeout(() => {
                            setOpenModal(false)
                        }, 500)
                    }}>
                        <X size={18}></X>
                    </button>
                    {/*<div className='fbt-pop-up-failure-content-wrapper'>
                        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 16 }}>Shopping Cart</p>
                        <div style={{
                            textAlign: 'left', border: '1px solid lightgray', width: '80%',
                            marginLeft: '10%', marginTop: 20, marginBottom: 20
                        }}>
                            <p style={{ color: 'red', marginTop: 5, marginLeft: 5, fontSize: 16 }}>{addCartData.addProductsToCart.user_errors[0]?.message}</p>
                            <div className='fbt-pop-up-failure-info'>
                                <img src={savedProduct[0].small_image.url ? savedProduct[0].small_image.url : savedProduct[0].small_image}
                                    style={imgStyles}
                                ></img>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                                    <a dangerouslySetInnerHTML={{ __html: savedProduct[0].name }}
                                        href={`/${savedProduct[0].url_key}.html`} className='fbt-pop-up-failure-product-name'></a>
                                    {product_price === '1' && <p style={{ fontSize: 16, marginTop: 10 }}>{`As low as $${savedProduct[0].price.regularPrice.amount.value.toFixed(2)}`}</p>}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20, marginBottom: 10 }}>
                                        <p style={{ fontSize: 16, fontWeight: 'bold' }}>Qty</p>
                                        <input defaultValue={savedQuantity[0]} style={{ width: 40, height: 30, padding: 10, border: '1px solid lightgray' }}
                                        id='fbt-failure-quantity-0'></input>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <button style={{ backgroundColor: `#${popup_btn_cart_bg}`, color: `#${popup_btn_cart_cl}` }}
                            className='fbt-pop-up-failure-add-cart' onClick={addFailureProducts}>{popup_btn_text_cart}</button>
    
                        {mini_cart === '1' && (<span style={{ textAlign: 'center', fontSize: 16 }}>There are
                            <a href='/cart' className='fbt-pop-up-failure-cart'>{` ${addCartData ? addCartData.addProductsToCart.cart.total_quantity : cartData.cart.total_quantity} items`}</a> in your cart</span>)}
                        {mini_cart === '1' && (<p style={{ textAlign: 'center', fontSize: 16 }}>
                            {`Cart subtotal: $${addCartData ? addCartData.addProductsToCart.cart.prices.subtotal_excluding_tax.value.toFixed(2) : cartData.cart.prices.subtotal_excluding_tax.value.toFixed(2)}`}</p>)}
                        {mini_checkout === '1' && (<a style={{ textAlign: 'center', fontSize: 16 }} className='fbt-pop-up-failure-check-out'
                            href='/checkout'>Go to checkout</a>)}
    
                        <div style={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
                            width: '80%', margin: '20px 0 0 10%'
                        }}>
                            <button style={{ backgroundColor: `#${btn_viewcart_bg}`, color: `#${btn_viewcart_cl}` }}
                                className='fbt-pop-up-failure-view-cart' onClick={() => history.push('/cart')}>{active_countdown === '2' ? `${btn_text_viewcart} (${remainingCountdown})` : `${btn_text_viewcart}`}
                            </button>
    
                            {continue_button === '1' && (<button style={{ backgroundColor: `#${btn_continue_bg}`, color: `#${btn_continue_cl}` }}
                                className='fbt-pop-up-failure-continue' onClick={() => {
                                    setIsOpen(false)
                                    setTimeout(() => {
                                        setOpenModalFailure(false)
                                    }, 500)
                                }}>{active_countdown === '1' ? `${btn_text_continue} (${remainingCountdown})` : `${btn_text_continue}`}
                            </button>)}
                        </div>
                            </div>*/}
                </div>
            </Modal>
        )
    }

    else {
        return (
            <Modal
                isOpen={isOpen}
                bodyOpenClassName='fbt-pop-up-failure-body'
                portalClassName='fbt-pop-up-failure-portal'
                className={{
                    base: 'fbt-pop-up-failure-content',
                    afterOpen: 'fbt-pop-up-failure-content-afterOpen',
                    beforeClose: 'fbt-pop-up-failure-content-beforeClose'
                }}
                overlayClassName={{
                    base: 'fbt-pop-up-failure-overlay',
                    afterOpen: 'fbt-pop-up-failure-overlay-afterOpen',
                    beforeClose: 'fbt-pop-up-failure-overlay-beforeClose'
                }}
                closeTimeoutMS={500}>
                {loading && (<div className="fbt-pop-up-failure-loading-indicator">
                    {fullPageLoadingIndicator}
                </div>)}
                <div className='fbt-pop-up-failure-wrapper'>
                    <button className='fbt-pop-up-failure-close-button' onClick={() => {
                        setIsOpen(false)
                        setTimeout(() => {
                            setOpenModal(false)
                        }, 500)
                    }}>
                        <X size={18}></X>
                    </button>
                    <div className='fbt-pop-up-failure-content-wrapper'>
                        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 16 }}>Shopping Cart</p>
                        <div style={{
                            textAlign: 'left', border: '1px solid lightgray', width: '80%',
                            marginLeft: '10%', marginTop: 20, marginBottom: 20
                        }}>
                            <p style={{ color: 'red', marginTop: 5, marginLeft: 5, fontSize: 16 }}>{addCartData.addProductsToCart.user_errors[0]?.message}</p>
                            <div className='fbt-pop-up-failure-info'>
                                <img src={savedProduct[0].small_image.url ? savedProduct[0].small_image.url : savedProduct[0].small_image}
                                    style={imgStyles}
                                ></img>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                                    <a dangerouslySetInnerHTML={{ __html: savedProduct[0].name }}
                                        href={`/${savedProduct[0].url_key}.html`} className='fbt-pop-up-failure-product-name'></a>
                                    {product_price === '1' && <p style={{ fontSize: 16, marginTop: 10 }}>{`As low as $${savedProduct[0].price.regularPrice.amount.value.toFixed(2)}`}</p>}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20, marginBottom: 10 }}>
                                        <p style={{ fontSize: 16, fontWeight: 'bold' }}>Qty</p>
                                        <input defaultValue={savedQuantity[0]} style={{ width: 40, height: 30, padding: 10, border: '1px solid lightgray' }}
                                        id='fbt-failure-quantity-0'></input>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <button style={{ backgroundColor: `#${popup_btn_cart_bg}`, color: `#${popup_btn_cart_cl}` }}
                            className='fbt-pop-up-failure-add-cart' onClick={addFailureProducts}>{popup_btn_text_cart}</button>
    
                        {mini_cart === '1' && (<span style={{ textAlign: 'center', fontSize: 16 }}>There are
                            <a href='/cart' className='fbt-pop-up-failure-cart'>{` ${addCartData ? addCartData.addProductsToCart.cart.total_quantity : cartData.cart.total_quantity} items`}</a> in your cart</span>)}
                        {mini_cart === '1' && (<p style={{ textAlign: 'center', fontSize: 16 }}>
                            {`Cart subtotal: $${addCartData ? addCartData.addProductsToCart.cart.prices.subtotal_excluding_tax.value.toFixed(2) : cartData.cart.prices.subtotal_excluding_tax.value.toFixed(2)}`}</p>)}
                        {mini_checkout === '1' && (<a style={{ textAlign: 'center', fontSize: 16 }} className='fbt-pop-up-failure-check-out'
                            href='/checkout'>Go to checkout</a>)}
    
                        <div style={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
                            width: '80%', margin: '20px 0 0 10%'
                        }}>
                            <button style={{ backgroundColor: `#${btn_viewcart_bg}`, color: `#${btn_viewcart_cl}` }}
                                className='fbt-pop-up-failure-view-cart' onClick={() => history.push('/cart')}>{active_countdown === '2' ? `${btn_text_viewcart} (${remainingCountdown})` : `${btn_text_viewcart}`}
                            </button>
    
                            {continue_button === '1' && (<button style={{ backgroundColor: `#${btn_continue_bg}`, color: `#${btn_continue_cl}` }}
                                className='fbt-pop-up-failure-continue' onClick={() => {
                                    setIsOpen(false)
                                    setTimeout(() => {
                                        setOpenModalFailure(false)
                                    }, 500)
                                }}>{active_countdown === '1' ? `${btn_text_continue} (${remainingCountdown})` : `${btn_text_continue}`}
                            </button>)}
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
    
}

export default FbtPopUpFailure