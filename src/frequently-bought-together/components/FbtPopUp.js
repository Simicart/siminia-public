import Modal from 'react-modal';
import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client';
import TinySlider from 'tiny-slider-react';
import 'tiny-slider/dist/tiny-slider.css';
import { ChevronLeft, ChevronRight, X } from 'react-feather';
import CART_DATA from '../talons/useCartData';
import { fullPageLoadingIndicator } from "@magento/venia-ui/lib/components/LoadingIndicator"
import ADD_PRODUCTS_TO_CART from '../talons/useAddProductsToCart';
import { useWindowSize } from '@magento/peregrine';
import { FormattedMessage } from 'react-intl';

const FbtPopUp = ({ isOpen, setIsOpen, setOpenModal, FBT_Brief_Data, popUpType, addCartData, setAddCartData,
    configurableProduct, setOpenModalConfigurable, setOpenPopUpConfigurable, fbt_config_data, savedQuantity }) => {

    Modal.setAppElement('#root')

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth < 500;
    const tmpString = 'Choose an Option...'

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
    const [errorOption, setErrorOption] = useState(false)
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
                setIsOpen(false)
                setOpenModalConfigurable(true)
                setOpenPopUpConfigurable(true)
                setTimeout(() => {
                    setOpenModal(false)
                }, 500)
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
        height: '36%',
        objectFit: "ratio",
        cursor: 'pointer',
        margin: 'auto'
    }

    const addConfigurableProducts = () => {
        let result = true
        if (listProductOptions.length > 0) {
            for (let i = 0; i < listProductOptions.length; i++) {
                for (let j = 0; j < listProductOptions[i].length; j++) {
                    if (listProductOptions[i][j] === 'default') {
                        result = false
                    }
                }
            }
        }
        if (result === false || listProductOptions.length === 0) {
            setErrorOption(true)
        }
        else {
            const listConfigurableProducts = []
            for (let i = 0; i < configurableProduct.length; i++) {
                listConfigurableProducts.push({
                    sku: configurableProduct[i].sku,
                    quantity: parseInt(document.getElementById(`fbt-quantity-configurable-${i}`).value) > 0
                        ? parseInt(document.getElementById(`fbt-quantity-configurable-${i}`).value)
                        : 1,
                    selected_options: listProductOptions[i]
                })
            }

            addProductsToCart({
                variables: {
                    cartId: cart_id.slice(1, cart_id.length - 1),
                    cartItems: listConfigurableProducts
                }
            })
        }
    }

    const handleOptionsChange = (index, ele, idx) => {
        const tmp = listProductOptions.length !== 0 ? listProductOptions : initListProductOptions
        tmp[index][idx] = document.getElementById(`label${index}${idx}`).value !== 'default'
            ? ele.values[parseInt(document.getElementById(`label${index}${idx}`).value)].uid
            : 'default'
        setListProductOptions(tmp)
    }

    if (popUpType !== 'add cart') {
        if (FBT_Brief_Data.length === 0) {
            return (
                <Modal
                    isOpen={isOpen}
                    bodyOpenClassName='fbt-pop-up-body'
                    portalClassName='fbt-pop-up-portal'
                    className={{
                        base: 'fbt-pop-up-content',
                        afterOpen: 'fbt-pop-up-content-afterOpen',
                        beforeClose: 'fbt-pop-up-content-beforeClose'
                    }}
                    overlayClassName={{
                        base: 'fbt-pop-up-overlay',
                        afterOpen: 'fbt-pop-up-overlay-afterOpen',
                        beforeClose: 'fbt-pop-up-overlay-beforeClose'
                    }}
                    closeTimeoutMS={500}>
                    <div className='fbt-pop-up-no-product'>
                        <button onClick={() => {
                            setIsOpen(false)
                            setTimeout(() => {
                                setOpenModal(false)
                            }, 500)
                        }} className='fbt-pop-up-close-button'>
                            <X size={18}></X>
                        </button>
                        <p style={{ fontSize: 16, marginTop: 10 }}>
                            <FormattedMessage id='Please select a product' defaultMessage='Please select a product'></FormattedMessage>
                        </p>
                        <button onClick={() => {
                            setIsOpen(false)
                            setTimeout(() => {
                                setOpenModal(false)
                            }, 500)
                        }} className='fbt-pop-up-ok-button'>
                            <FormattedMessage id='OK' defaultMessage='OK'></FormattedMessage>
                        </button>
                    </div>
                </Modal>
            )
        }

        else return (
            <Modal
                isOpen={isOpen}
                bodyOpenClassName='fbt-pop-up-body'
                portalClassName='fbt-pop-up-portal'
                className={{
                    base: 'fbt-pop-up-content',
                    afterOpen: 'fbt-pop-up-content-afterOpen',
                    beforeClose: 'fbt-pop-up-content-beforeClose'
                }}
                overlayClassName={{
                    base: 'fbt-pop-up-overlay',
                    afterOpen: 'fbt-pop-up-overlay-afterOpen',
                    beforeClose: 'fbt-pop-up-overlay-beforeClose'
                }}
                closeTimeoutMS={500}>
                {loading && (<div className="fbt-pop-up-loading-indicator">
                    {fullPageLoadingIndicator}
                </div>)}
                <div className={configurableProduct.length > 0 ? 'fbt-pop-up-wrapper' : 'fbt-pop-up-wrapper-add-cart'}>
                    <button className='fbt-pop-up-close-button' onClick={() => {
                        setIsOpen(false)
                        setTimeout(() => {
                            setOpenModal(false)
                        }, 500)
                    }}>
                        <X size={18}></X>
                    </button>
                    <div className='fbt-pop-up-content-wrapper'>
                        <p style={{ textAlign: 'center', marginTop: 5, fontSize: 16 }}>
                            <FormattedMessage id='Shopping Cart' defaultMessage='Shopping Cart'></FormattedMessage>
                        </p>
                        {addCartData?.addProductsToCart.user_errors.length===0 && (<p style={{ textAlign: 'center', marginTop: 5, fontSize: 16 }}>
                            <FormattedMessage id='You have added the following items to cart:'
                                defaultMessage='You have added the following items to cart:'></FormattedMessage>
                        </p>)}
                        <div className={parseInt(item_popup_slide) < FBT_Brief_Data.filter((element) => element.__typename === 'SimpleProduct').length
                            ? 'fbt-pop-up-slider' : 'fbt-pop-up-no-slider'}>
                            <div style={{ position: 'relative' }}>
                                {FBT_Brief_Data.filter((element) => element.__typename === 'SimpleProduct').length > 0 && (
                                    <button className="fbt-pop-up-slider-prev">
                                        <ChevronLeft size={16} />
                                    </button>)}
                                {FBT_Brief_Data.filter((element) => element.__typename === 'SimpleProduct').length > 0 && (
                                    <button className="fbt-pop-up-slider-next">
                                        <ChevronRight size={16} />
                                    </button>)}
                                {FBT_Brief_Data.filter((element) => element.__typename === 'SimpleProduct').length > 0 && (<TinySlider settings={settings}>
                                    {FBT_Brief_Data.filter((element) => element.__typename === 'SimpleProduct').map((element, index) => (
                                        <div key={index} style={{ textAlign: 'center', border: '1px solid lightgray' }}>
                                            <a href={`/${element.url_key}.html`}>
                                                <img
                                                    className={`tns-lazy-img`}
                                                    src={element.small_image.url ? element.small_image.url : element.small_image}
                                                    data-src={element.small_image.url ? element.small_image.url : element.small_image}
                                                    alt=""
                                                    style={imgStyles}
                                                />
                                            </a>
                                            <a dangerouslySetInnerHTML={{ __html: element.name }}
                                                href={`/${element.url_key}.html`} className='fbt-pop-up-product-name'></a>
                                            {product_price === '1' && <p style={{ fontWeight: 'bold', fontSize: 16, marginTop: 10 }}>
                                                <FormattedMessage id='simp-price' defaultMessage={`$${element.price.regularPrice.amount.value.toFixed(2)}`}></FormattedMessage>
                                            </p>}
                                        </div>
                                    ))}
                                </TinySlider>)}
                            </div>

                            <div style={{ marginTop: 20 }}>
                                {configurableProduct.map((element, index) => (
                                    <div className='fbt-pop-up-conf-wrapper'>
                                        <p style={{ color: 'red', marginTop: 5, marginLeft: 5, fontSize: 16 }}>
                                            <FormattedMessage id={addCartData?.addProductsToCart.user_errors.length>0 ? 'The requested qty is not available' : 'You need to choose options for your item'}
                                            defaultMessage={addCartData?.addProductsToCart.user_errors.length>0 ? 'The requested qty is not available' : 'You need to choose options for your item'}></FormattedMessage>
                                        </p>
                                        <div className={isMobile ? 'fbt-pop-up-conf-info-mobile' : 'fbt-pop-up-conf-info'}>
                                            <a href={`/${element.url_key}.html`}>
                                            <img
                                                src={element.small_image.url ? element.small_image.url : element.small_image}
                                                data-src={element.small_image.url ? element.small_image.url : element.small_image}
                                                alt=""
                                                style={{ width: 80, objectFit: "ratio", cursor: 'pointer', margin: 'auto' }}
                                            />
                                            </a> 
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                                                <a dangerouslySetInnerHTML={{ __html: element.name }}
                                                    href={`/${element.url_key}.html`} className='fbt-pop-up-product-name'></a>
                                                {product_price === '1' && <p style={{ fontSize: 16, marginTop: 10 }}>
                                                    <FormattedMessage id='conf price 0' defaultMessage={`As low as $${element.price.regularPrice.amount.value.toFixed(2)}`}>
                                                    </FormattedMessage>
                                                </p>}
                                                {element.configurable_options.map((ele, idx) => (
                                                    <div style={{ marginTop: 10 }}>
                                                        <span style={{ display: 'flex', flexDirection: 'row', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{ele.label}<p style={{ color: 'red', marginLeft: 5 }}>
                                                            <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                                                            </p></span>
                                                        <select id={`label${index}${idx}`} style={{ padding: 5, border: '1px solid lightgray' }} onChange={() => handleOptionsChange(index, ele, idx)}
                                                            disabled={idx > 0 && document.getElementById(`label${index}${idx - 1}`)?.value === 'default' ? true : false}>
                                                            <option value='default'>
                                                                {tmpString}
                                                            </option>
                                                            {ele.values.map((e, i) => (
                                                                <option value={i}>{e.label}</option>
                                                            ))}
                                                        </select>
                                                        {errorOption && !document.getElementById(`label${index}${idx}`).disabled
                                                            && (listProductOptions.length === 0
                                                                || (listProductOptions.length > 0 && listProductOptions[index][idx] === 'default'))
                                                            && (<p style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                                                                <FormattedMessage id='This is a required field.' defaultMessage='This is a required field'></FormattedMessage>
                                                            </p>)}
                                                    </div>
                                                ))}
                                                <div className='fbt-pop-up-quantity-wrapper'>
                                                    <p style={{ fontSize: 16, fontWeight: 'bold' }}>
                                                        <FormattedMessage id='Qty' defaultMessage='Qty'></FormattedMessage>
                                                    </p>
                                                    <input defaultValue={savedQuantity[index]} className='fbt-pop-up-quantity-input'
                                                        id={`fbt-quantity-configurable-${index}`}></input>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {configurableProduct.length > 0 && (<button style={{ backgroundColor: `#${popup_btn_cart_bg}`, color: `#${popup_btn_cart_cl}` }}
                                className='fbt-pop-up-add-cart' onClick={addConfigurableProducts}>{popup_btn_text_cart}</button>)}

                            {mini_cart === '1' && (<span style={{ textAlign: 'center', fontSize: 16 }}>
                            <FormattedMessage id='There are' defaultMessage='There are'></FormattedMessage>
                                <a href='/cart' className='fbt-pop-up-cart'>
                                    <FormattedMessage id='number items' 
                                    defaultMessage={` ${addCartData ? addCartData.addProductsToCart.cart.total_quantity : cartData.cart.total_quantity} items`}></FormattedMessage>
                                </a> 
                                <FormattedMessage id='in your cart' defaultMessage=' in your cart'></FormattedMessage></span>)}
                            {mini_cart === '1' && (<p style={{ textAlign: 'center', fontSize: 16 }}>
                                <FormattedMessage id='Sub Total' defaultMessage={`Cart subtotal: $${addCartData ? addCartData.addProductsToCart.cart.prices.subtotal_excluding_tax.value.toFixed(2) : cartData.cart.prices.subtotal_excluding_tax.value.toFixed(2)}`}></FormattedMessage>
                                </p>)}
                            {mini_checkout === '1' && (<a style={{ textAlign: 'center', fontSize: 16 }} className='fbt-pop-up-check-out'
                                href='/checkout'>
                                    <FormattedMessage id='Go to checkout' defaultMessage='Go to checkout'></FormattedMessage>
                                </a>)}

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                <button style={{ backgroundColor: `#${btn_viewcart_bg}`, color: `#${btn_viewcart_cl}` }}
                                    className='fbt-pop-up-view-cart' onClick={() => history.push('/cart')}>{active_countdown === '2' ? `${btn_text_viewcart} (${remainingCountdown})` : `${btn_text_viewcart}`}</button>

                                {continue_button === '1' && (<button style={{ backgroundColor: `#${btn_continue_bg}`, color: `#${btn_continue_cl}` }}
                                    className='fbt-pop-up-continue' onClick={() => {
                                        setIsOpen(false)
                                        setTimeout(() => {
                                            setOpenModal(false)
                                        }, 500)
                                    }}>{active_countdown === '1' ? `${btn_text_continue} (${remainingCountdown})` : `${btn_text_continue}`}</button>)}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
    else {
        return (
            <Modal
                isOpen={isOpen}
                bodyOpenClassName='fbt-pop-up-body'
                portalClassName='fbt-pop-up-portal'
                className={{
                    base: 'fbt-pop-up-content',
                    afterOpen: 'fbt-pop-up-content-afterOpen',
                    beforeClose: 'fbt-pop-up-content-beforeClose'
                }}
                overlayClassName={{
                    base: 'fbt-pop-up-overlay',
                    afterOpen: 'fbt-pop-up-overlay-afterOpen',
                    beforeClose: 'fbt-pop-up-overlay-beforeClose'
                }}
                closeTimeoutMS={500}>
                {loading && (<div className="fbt-pop-up-loading-indicator">
                    {fullPageLoadingIndicator}
                </div>)}
                <div className={configurableProduct.length > 0 ? 'fbt-pop-up-wrapper' : 'fbt-pop-up-wrapper-add-cart'}>
                    <button className='fbt-pop-up-close-button' onClick={() => {
                        setIsOpen(false)
                        setTimeout(() => {
                            setOpenModal(false)
                        }, 500)
                    }}>
                        <X size={18}></X>
                    </button>
                    <div className='fbt-pop-up-content-wrapper'>
                        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 16 }}>
                            <FormattedMessage id='Shopping Cart' defaultMessage='Shopping Cart'></FormattedMessage>
                        </p>
                        {configurableProduct.length === 0 && (<span style={{ textAlign: 'center', marginTop: 15, fontSize: 16 }}>
                        <FormattedMessage id='You added' defaultMessage='You added '></FormattedMessage>
                             <a href={`/${addCartData.addProductsToCart.cart.items[cartLength].product.url_key}.html`}
                                dangerouslySetInnerHTML={{ __html: addCartData.addProductsToCart.cart.items[cartLength].product.name }}
                                className='fbt-pop-up-product-name'>
                            </a> <FormattedMessage id=' to your shopping cart' defaultMessage=' to your shopping cart'></FormattedMessage></span>)}
                        {configurableProduct.length === 0 && (<img src={addCartData.addProductsToCart.cart.items[cartLength].product.image.url}
                            alt='' style={{ objectFit: "ratio" }} className='fbt-pop-up-image'></img>)}

                        {configurableProduct.length > 0 && configurableProduct.map((element, index) => (
                            <div style={{
                                textAlign: 'left', border: '1px solid lightgray', width: '80%',
                                marginLeft: '10%', marginTop: 20, marginBottom: 20
                            }}>
                                <p style={{ color: 'red', marginTop: 5, marginLeft: 5, fontSize: 16 }}>{!addCartData || addCartData?.addProductsToCart.user_errors.length === 0 
                                ? 'You need to choose options for your item.' : addCartData?.addProductsToCart.user_errors[0]?.message}</p>
                                <div className={isMobile ? 'fbt-pop-up-conf-info-mobile' : 'fbt-pop-up-conf-info'}>
                                    <a href={`/${element.url_key}.html`}>
                                    <img
                                        src={element.small_image.url ? element.small_image.url : element.small_image}
                                        data-src={element.small_image.url ? element.small_image.url : element.small_image}
                                        alt=""
                                        style={{ width: 80, objectFit: "ratio", cursor: 'pointer', margin: 'auto' }}
                                    />
                                    </a>
                                    <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                                        <a dangerouslySetInnerHTML={{ __html: element.name }}
                                            href={`/${element.url_key}.html`} className='fbt-pop-up-product-name'></a>
                                        {product_price === '1' && <p style={{ fontSize: 16, marginTop: 10 }}>
                                            <FormattedMessage id='conf price 1'
                                            defaultMessage={`As low as $${element.price.regularPrice.amount.value.toFixed(2)}`}></FormattedMessage>
                                        </p>}
                                        {element.configurable_options.map((ele, idx) => (
                                            <div style={{ marginTop: 10 }}>
                                                <span style={{ display: 'flex', flexDirection: 'row', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{ele.label}<p style={{ color: 'red', marginLeft: 5 }}>
                                                    <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                                                    </p></span>
                                                <select id={`label${index}${idx}`} style={{ padding: 5, border: '1px solid lightgray' }} onChange={() => handleOptionsChange(index, ele, idx)}
                                                    disabled={idx > 0 && document.getElementById(`label${index}${idx - 1}`)?.value === 'default' ? true : false}>
                                                    <option value='default'>
                                                        {tmpString}
                                                    </option>
                                                    {ele.values.map((e, i) => (
                                                        <option value={i}>{e.label}</option>
                                                    ))}
                                                </select>
                                                {errorOption && !document.getElementById(`label${index}${idx}`).disabled
                                                    && (listProductOptions.length === 0
                                                        || (listProductOptions.length > 0 && listProductOptions[index][idx] === 'default'))
                                                    && (<p style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                                                        <FormattedMessage id='This is a required field.' defaultMessage='This is a required field.'></FormattedMessage>
                                                    </p>)}
                                            </div>
                                        ))}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20, marginBottom: 10 }}>
                                            <p style={{ fontSize: 16, fontWeight: 'bold' }}>
                                            <FormattedMessage id='Qty' defaultMessage='Qty'></FormattedMessage>
                                            </p>
                                            <input defaultValue={savedQuantity[index]} style={{ width: 40, height: 30, padding: 10, border: '1px solid lightgray' }}
                                                id={`fbt-quantity-configurable-${index}`}></input>
                                        </div>
                                    </div>
                                </div>
                            </div>))}

                        {configurableProduct.length > 0 && (<button style={{ backgroundColor: `#${popup_btn_cart_bg}`, color: `#${popup_btn_cart_cl}` }}
                            className='fbt-pop-up-add-cart' onClick={addConfigurableProducts}>{popup_btn_text_cart}</button>)}

                        {mini_cart === '1' && (<span style={{ textAlign: 'center', fontSize: 16 }}>
                            <FormattedMessage id='There are' defaultMessage='There are'></FormattedMessage>
                            <a href='/cart' className='fbt-pop-up-cart'>
                                <FormattedMessage id='number items' 
                                defaultMessage={` ${addCartData ? addCartData.addProductsToCart.cart.total_quantity : cartData.cart.total_quantity} items`}></FormattedMessage>
                                </a>
                                <FormattedMessage id=' in your cart' default=' in your cart'></FormattedMessage></span>)}
                        {mini_cart === '1' && (<p style={{ textAlign: 'center', fontSize: 16 }}>
                        <FormattedMessage id='Sub Total' 
                        defaultMessage={`Cart subtotal: $${addCartData ? addCartData.addProductsToCart.cart.prices.subtotal_excluding_tax.value.toFixed(2) : cartData.cart.prices.subtotal_excluding_tax.value.toFixed(2)}`}></FormattedMessage>
                            </p>)}
                        {mini_checkout === '1' && (<a style={{ textAlign: 'center', fontSize: 16 }} className='fbt-pop-up-check-out'
                            href='/checkout'>
                                <FormattedMessage id='Go to checkout' defaultMessage='Go to checkout'></FormattedMessage>
                            </a>)}

                        <div style={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
                            width: '80%', margin: '20px 0 0 10%'
                        }}>
                            <button style={{ backgroundColor: `#${btn_viewcart_bg}`, color: `#${btn_viewcart_cl}` }}
                                className='fbt-pop-up-view-cart' onClick={() => history.push('/cart')}>{active_countdown === '2' ? `${btn_text_viewcart} (${remainingCountdown})` : `${btn_text_viewcart}`}
                            </button>

                            {continue_button === '1' && (<button style={{ backgroundColor: `#${btn_continue_bg}`, color: `#${btn_continue_cl}` }}
                                className='fbt-pop-up-continue' onClick={() => {
                                    setIsOpen(false)
                                    setTimeout(() => {
                                        setOpenModal(false)
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

export default FbtPopUp