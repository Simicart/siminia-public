import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from 'react-feather';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';
import TinySlider from "tiny-slider-react";
import 'tiny-slider/dist/tiny-slider.css';
import '../styles/styles.scss'
import { FormattedMessage } from 'react-intl';

const FbtPopUpConfigurable = ({ isOpen, setIsOpen, setOpenModalConfigurable, configurableProduct, addCartData, fbt_config_data }) => {

    Modal.setAppElement('#root')

    const countdown_time = fbt_config_data.countdown_time
    const active_countdown = fbt_config_data.active_countdown
    const slide_popup_speed = fbt_config_data.slide_popup_speed
    const slide_popup_auto = fbt_config_data.slide_popup_auto
    const item_popup_slide = fbt_config_data.item_popup_slide
    const product_price = fbt_config_data.product_price
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
    const history = useHistory()

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

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setRemainingCountdown(state => state - 1)
        }, 1000)

        return () => {
            clearInterval(countdownInterval)
        }
    }, [remainingCountdown])

    const settings = {
        nav: true,
        rewind: true,
        lazyload: true,
        mouseDrag: true,
        items: parseInt(item_popup_slide),
        autoplay: Boolean(slide_popup_auto),
        autoplayText: ['', ''],
        speed: parseInt(slide_popup_speed),
        controlText: ['', ''],
        prevButton: '.fbt-pop-up-configurable-slider-prev',
        nextButton: '.fbt-pop-up-configurable-slider-next',
    }

    const imgStyles = {
        width: '60%',
        height: '48%',
        objectFit: "ratio",
        cursor: 'pointer',
        margin: 'auto'
    }

    return (
        <Modal
            isOpen={isOpen}
            bodyOpenClassName='fbt-pop-up-configurable-body'
            portalClassName='fbt-pop-up-configurable-portal'
            className={{
                base: 'fbt-pop-up-configurable-content',
                afterOpen: 'fbt-pop-up-configurable-content-afterOpen',
                beforeClose: 'fbt-pop-up-configurable-content-beforeClose'
            }}
            overlayClassName={{
                base: 'fbt-pop-up-configurable-overlay',
                afterOpen: 'fbt-pop-up-configurable-overlay-afterOpen',
                beforeClose: 'fbt-pop-up-configurable-overlay-beforeClose'
            }}
            closeTimeoutMS={500}>
            <div className='fbt-pop-up-configurable-wrapper'>
                <button className='fbt-pop-up-configurable-close-button' onClick={() => {
                    setIsOpen(false)
                    setTimeout(() => {
                        setOpenModalConfigurable(false)
                    }, 500)
                }}>
                    <X size={18}></X>
                </button>
                <div className='fbt-pop-up-configurable-content-wrapper'>
                    <p style={{ textAlign: 'center', marginTop: 5, fontSize: 16 }}>
                        <FormattedMessage id='Shopping Cart' defaultMessage='Shopping Cart'></FormattedMessage>
                    </p>
                    <p style={{ textAlign: 'center', marginTop: 5, fontSize: 16, marginBottom: 5 }}>
                        <FormattedMessage id='You have added the following item to the cart:'
                            defaultMessage='You have added the following item to the cart:'></FormattedMessage>
                    </p>
                    <div className='fbt-pop-up-configurable-slider'>
                        <div style={{ position: 'relative' }}>
                            <button className="fbt-pop-up-configurable-slider-prev">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="fbt-pop-up-configurable-slider-next">
                                <ChevronRight size={16} />
                            </button>
                            <TinySlider settings={settings}>
                                {configurableProduct.map((element, index) => (
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
                                        <div><a dangerouslySetInnerHTML={{ __html: element.name }}
                                            href={`/${element.url_key}.html`} className='fbt-pop-up-product-name'></a></div>
                                        {product_price === '1' && <p style={{ fontWeight: 'bold', fontSize: 16 }}>
                                            <FormattedMessage id={`$${element.price.regularPrice.amount.value.toFixed(2)}`} 
                                            defaultMessage={`$${element.price.regularPrice.amount.value.toFixed(2)}`}></FormattedMessage>
                                        </p>}
                                    </div>))}
                            </TinySlider>
                        </div>
                    </div>

                    {mini_cart === '1' && (<span style={{ textAlign: 'center', fontSize: 16 }}>
                        <FormattedMessage id='There are' defaultMessage='There are'></FormattedMessage>
                        <a href='/cart' className='fbt-pop-up-configurable-cart'>
                            <FormattedMessage id='number items'
                                defaultMessage={` ${addCartData ? addCartData.addProductsToCart.cart.total_quantity : cartData.cart.total_quantity} items`}></FormattedMessage>
                        </a>
                        <FormattedMessage id=' in your cart' defaultMessage=' in your cart'></FormattedMessage></span>)}
                    {mini_cart === '1' && (<p style={{ textAlign: 'center', fontSize: 16 }}>
                        <FormattedMessage id='Sub Total' defaultMessage={`Cart subtotal: $${addCartData ? addCartData.addProductsToCart.cart.prices.subtotal_excluding_tax.value.toFixed(2) : cartData.cart.prices.subtotal_excluding_tax.value.toFixed(2)}`}></FormattedMessage>
                    </p>)}
                    {mini_checkout === '1' && (<a style={{ textAlign: 'center', fontSize: 16 }} className='fbt-pop-up-configurable-check-out'
                        href='/checkout'>
                        <FormattedMessage id='Go to checkout' defaultMessage='Go to checkout'></FormattedMessage>
                    </a>)}

                    <div style={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
                        width: '80%', margin: '20px 0 0 10%'
                    }}>
                        <button style={{ backgroundColor: `#${btn_viewcart_bg}`, color: `#${btn_viewcart_cl}` }}
                            className='fbt-pop-up-configurable-view-cart' onClick={() => history.push('/cart')}>{active_countdown === '2' ? `${btn_text_viewcart} (${remainingCountdown})` : `${btn_text_viewcart}`}
                        </button>

                        {continue_button === '1' && (<button style={{ backgroundColor: `#${btn_continue_bg}`, color: `#${btn_continue_cl}` }}
                            className='fbt-pop-up-configurable-continue' onClick={() => {
                                setIsOpen(false)
                                setTimeout(() => {
                                    setOpenModalConfigurable(false)
                                }, 500)
                            }}>{active_countdown === '1' ? `${btn_text_continue} (${remainingCountdown})` : `${btn_text_continue}`}
                        </button>)}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default FbtPopUpConfigurable