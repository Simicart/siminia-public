import Modal from 'react-modal';
import React from "react";
import { useHistory } from 'react-router-dom'
import { X } from 'react-feather';
import { FormattedMessage } from 'react-intl';

const AddCartPopUp = ({ isOpen, setIsOpen, setOpenAddCartPopUp, cartData, addCartProduct }) => {

    Modal.setAppElement('#root')
    const history = useHistory()

    return (
        <Modal
            isOpen={isOpen}
            bodyOpenClassName='add-cart-pop-up-body'
            portalClassName='add-cart-pop-up-portal'
            className={{
                base: 'add-cart-pop-up-content',
                afterOpen: 'add-cart-pop-up-content-afterOpen',
                beforeClose: 'add-cart-pop-up-content-beforeClose'
            }}
            overlayClassName={{
                base: 'add-cart-pop-up-overlay',
                afterOpen: 'add-cart-pop-up-overlay-afterOpen',
                beforeClose: 'add-cart-pop-up-overlay-beforeClose'
            }}
            closeTimeoutMS={500}>
            <div className='add-cart-pop-up-wrapper'>
                <button className='add-cart-pop-up-close-button' onClick={() => {
                    setIsOpen(false)
                    setTimeout(() => {
                        setOpenAddCartPopUp(false)
                    }, 500)
                }}>
                    <X size={18}></X>
                </button>
                <div className='add-cart-pop-up-content-wrapper'>
                    <p style={{ textAlign: 'center', marginTop: 10, fontSize: 16 }}>
                        <FormattedMessage id='Shopping Cart' defaultMessage='Shopping Cart'></FormattedMessage>
                    </p>
                    <span style={{ textAlign: 'center', marginTop: 15, fontSize: 16 }}>
                        <FormattedMessage id='You added' defaultMessage='You added '></FormattedMessage>
                        <a href={`/${addCartProduct.url_key}.html`}
                            dangerouslySetInnerHTML={{ __html: addCartProduct.name }}
                            className='add-cart-pop-up-product-name'>
                        </a> <FormattedMessage id=' to your shopping cart' defaultMessage=' to your shopping cart'></FormattedMessage>
                    </span>
                    <a href={`/${addCartProduct.url_key}.html`}>
                        <img src={addCartProduct.small_image}
                            alt='' style={{ objectFit: "ratio" }} className='add-cart-pop-up-image'>
                        </img>
                    </a>

                    <span style={{ textAlign: 'center', fontSize: 16 }}>
                        <FormattedMessage id='There are' defaultMessage='There are'></FormattedMessage>
                        <a href='/cart' className='add-cart-pop-up-cart'>
                            <FormattedMessage id='number items'
                                defaultMessage={` ${cartData.addProductsToCart.cart.total_quantity} items`}></FormattedMessage>
                        </a>
                        <FormattedMessage id=' in your cart' default=' in your cart'></FormattedMessage>
                    </span>

                    <p style={{ textAlign: 'center', fontSize: 16 }}>
                        <FormattedMessage id='Sub Total'
                            defaultMessage={`Cart subtotal: $${cartData.addProductsToCart.cart.prices.subtotal_excluding_tax.value.toFixed(2)}`}></FormattedMessage>
                    </p>

                    <a style={{ textAlign: 'center', fontSize: 16 }} className='add-cart-pop-up-check-out'
                        href='/checkout'>
                        <FormattedMessage id='Go to checkout' defaultMessage='Go to checkout'></FormattedMessage>
                    </a>

                    <div style={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
                        width: '80%', margin: '20px 0 0 10%'
                    }}>
                        <button className='add-cart-pop-up-view-cart' onClick={() => history.push('/cart')}>
                            View Cart
                        </button>

                        <button className='add-cart-pop-up-continue'
                            onClick={() => {
                                setIsOpen(false)
                                setTimeout(() => {
                                    setOpenAddCartPopUp(false)
                                }, 500)
                            }}>
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default AddCartPopUp