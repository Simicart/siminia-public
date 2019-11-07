import React, { Component, Fragment } from 'react';
import { connect } from 'src/drivers';
import { bool, object, shape, string } from 'prop-types';
import {
    getCartDetails,
    updateItemInCart
} from 'src/actions/cart';
import { isEmptyCartVisible } from 'src/selectors/cart';

import BreadCrumb from "src/simi/BaseComponents/BreadCrumb"
import Loading from 'src/simi/BaseComponents/Loading'

import Identify from 'src/simi/Helper/Identify'
import Arrowup from 'src/simi/BaseComponents/Icon/Arrowup'
import Basket from 'src/simi/BaseComponents/Icon/Basket'
import CartItem from './cartItem'
import Total from 'src/simi/BaseComponents/Total'
import {Colorbtn, Whitebtn} from 'src/simi/BaseComponents/Button'
import {configColor} from 'src/simi/Config'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import {removeItemFromCart} from 'src/simi/Model/Cart'
import Coupon from 'src/simi/BaseComponents/Coupon'
require('./cart.scss')



class Cart extends Component {
    constructor(...args) {
        super(...args)
        const isPhone = window.innerWidth < 1024
        this.state = {
            isPhone: isPhone,
            focusItem: null
        };
    }

    setIsPhone(){
        const obj = this;
        window.onresize = function () {
            const width = window.innerWidth;
            const isPhone = width < 1024
            if(obj.state.isPhone !== isPhone){
                obj.setState({isPhone: isPhone})
            }
        }
    }

    componentDidMount() {
        showFogLoading()
        this.setIsPhone()
        const { getCartDetails } = this.props;
        getCartDetails();
    }

    shouldComponentUpdate(nextProps){
        if (this.showAPIloading(nextProps)) {
            showFogLoading()
            return false
        }
        console.log(nextProps)
        hideFogLoading()
        return true
    }

    showAPIloading = (props) => {
        const { cart } = props;
        if (cart && cart.isUpdatingItem)
            return true
        return false
    }

    get cartId() {
        const { cart } = this.props;

        return cart && cart.details && cart.details.id;
    }

    get cartCurrencyCode() {
        const { cart } = this.props;
        return (
            cart &&
            cart.details &&
            cart.details.currency &&
            cart.details.currency.quote_currency_code
        );
    }

    get productList() {
        const { cart } = this.props;
        if (!cart)
            return
        const { cartCurrencyCode, cartId } = this;
        const borderItemStyle = Identify.isRtl() ? {borderLeft: 'solid #DCDCDC 1px'} : {borderRight: 'solid #DCDCDC 1px'};
        if (cartId) {
            const obj = [];
            obj.push(
                <div key="cart-item-header" className='cart-item-header'>
                    <div style={{...borderItemStyle ,width: '60%'}}>{Identify.__('Items')}</div>
                    <div style={{...borderItemStyle ,width: '11%', textAlign: 'center'}}>{Identify.__('Unit Price')}</div>
                    <div style={{...borderItemStyle ,width: '11%', textAlign: 'center'}}>{Identify.__('Qty')}</div>
                    <div style={{...borderItemStyle ,width: '11%', textAlign: 'center'}}>{Identify.__('Total Price')}</div>
                    <div style={{width: '7%'}}>{Identify.__('').toUpperCase()}</div>
                </div>
            );
            for (const i in cart.details.items) {
                const item = cart.details.items[i];
                let itemTotal = null
                if (cart.totals && cart.totals.items) {
                    cart.totals.items.every(function(total) {
                        if (total.item_id === item.item_id) {
                            itemTotal = total
                            return false
                        }
                        else return true
                    })
                }
                if (itemTotal) {
                    const element = <CartItem
                        key={item.item_id}
                        item={item}
                        isPhone={this.state.isPhone}
                        currencyCode={cartCurrencyCode}
                        itemTotal={itemTotal}
                        removeFromCart={this.removeFromCart.bind(this)}
                        updateCartItem={this.props.updateItemInCart}
                        history={this.props.history}
                        handleLink={this.handleLink.bind(this)}/>;
                    obj.push(element);
                }
            }
            return <div className='cart-list'>{obj}</div>;
        }
    }

    get totalsSummary() {
        const { cart } = this.props;
        const { cartCurrencyCode } = this;
        if (!cart.totals)
            return
        return (<Total data={cart.totals} currencyCode={cartCurrencyCode} />)
    }


    get total() {
        const { totalsSummary } = this;

        return (
            <div>
                <div className={`summary ${Identify.isRtl() ? 'summary-cart-rtl' : ''}`}>{totalsSummary}</div>
            </div>
        );
    }

    get checkoutButton() {
        return (
            <div className='cart-btn-section'>
                <Whitebtn className='continue-shopping' onClick={() => this.handleBack()} text={Identify.__('Continue shopping')}/>
                <Colorbtn
                    id="go-checkout"
                    style={{backgroundColor: configColor.button_background, color: configColor.button_text_color}}
                    className="go-checkout"
                    onClick={() => this.handleGoCheckout()} text={Identify.__('Pay Securely')}/>
            </div>
        )
    }

    get breadcrumb() {
        return <BreadCrumb breadcrumb={[{name:'Home',link:'/'},{name:'Basket',link:'/checkout/cart'}]}/>
    }

    handleLink(link) {
        this.props.history.push(link)
    }

    handleBack() {
        this.props.history.goBack()
    }

    handleGoCheckout() {
        this.props.history.push('/checkout.html')
    }

    removeFromCart(item) {
        if (confirm(Identify.__("Are you sure?")) === true) {
            showFogLoading()
            removeItemFromCart(()=>{this.props.getCartDetails()},item.item_id, this.props.isSignedIn)
        }
    }

    get couponView () {
        const { cart, toggleMessages, getCartDetails } = this.props;
        let value = "";
        if (cart.totals.coupon_code) {
            value = cart.totals.coupon_code;
        }

        const childCPProps = {
            value,
            toggleMessages,
            getCartDetails
        }
        return <div className={`cart-coupon-form`}><Coupon {...childCPProps} /></div>
    }

    get cartInner() {
        const { productList, props, total, checkoutButton, couponView } = this;
        const { cart: { isLoading }, isCartEmpty,cart } = props;

        if (isCartEmpty || !cart.details || !parseInt(cart.details.items_count)) {
            if (isLoading)
                return <Loading />
            else
                return (
                    <div className='cart-page-siminia'>
                        <div className='empty-cart'>
                        {Identify.__('You have no items in your shopping cart')}
                        </div>
                    </div>
                );
        }

        if (isLoading)
            showFogLoading()
        else
            hideFogLoading()


        return (
            <Fragment>
                {this.state.isPhone && this.breadcrumb}
                <div className='cart-header'>
                    <div role="presentation" className='cart-back-btn' onClick={() => this.handleBack()} onKeyUp={() => this.handleBack()} >
                        <Arrowup style={{width: 25}}/>
                        <span>{Identify.__('Continue shopping')}</span>
                    </div>
                    {   (cart.details && parseInt(cart.details.items_count))?
                        <div className='cart-title'>
                            <Basket/>
                            <div>
                                {Identify.__('Your basket contains: %s item(s)').replace('%s', cart.details.items_count)}
                            </div>
                        </div>:''
                    }
                </div>
                <div className={`body ${Identify.isRtl() ? 'body-cart-rtl' : ''}`}>{productList}</div>
                {couponView}
                {total}
                {checkoutButton}
            </Fragment>
        );
    }

    render() {
        return (
            <div className="container">
                {TitleHelper.renderMetaHeader({
                    title:Identify.__('Shopping Cart')
                })}
                {this.cartInner}
            </div>
        );
    }
}

Cart.propTypes = {
    cart: shape({
        details: object,
        cartId: string,
        totals: object,
        isLoading: bool,
        isUpdatingItem: bool
    }),
    isCartEmpty: bool
}

const mapStateToProps = state => {
    const { cart, user } = state;
    const { isSignedIn } = user;
    return {
        cart,
        isCartEmpty: isEmptyCartVisible(state),
        isSignedIn,
    };
};

const mapDispatchToProps = {
    getCartDetails,
    toggleMessages,
    updateItemInCart,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Cart);
