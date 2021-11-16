import React, { Component } from 'react'
import Identify from 'src/simi/Helper/Identify'
import BasketIcon from "src/simi/BaseComponents/Icon/Basket2";
import { Colorbtn } from 'src/simi/BaseComponents/Button';
import { useHistory } from 'react-router-dom';

require('./emptyCart.scss')

const EmptyMiniCart = props => {
    const history = useHistory();
    const continueShopping = () => {
        if (props.handleClickOutside) {
            props.handleClickOutside()
        }
        history.push('/');
    }
    return (
        <div className={`empty_cart_root`}>
            <BasketIcon style={{ height: '20px', width: '20px' }} />
            <h3 className="emptyTitle">
                {Identify.__('YOUR CART IS EMPTY')}
            </h3>
            <Colorbtn
                className="continue"
                onClick={continueShopping}
                text={Identify.__('Continue Shopping')}
            />
        </div>
    );
}

export default EmptyMiniCart;
