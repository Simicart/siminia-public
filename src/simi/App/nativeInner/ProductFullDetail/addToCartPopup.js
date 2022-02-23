import React, { Fragment, Suspense, useRef, useState } from 'react';
import { Form } from 'informed';
import { GrClose } from "react-icons/gr";
import { Link } from 'react-router-dom';

require('./statusBar.scss');

const AddToCartPopup = props => {
    const { options, handleAddToCart, wrapperQuantity, cartAction, setAddToCartPopup,handleBuyNow, typeBtn } = props;

    // const test = () => {
    //     window.location.pathname = ('/cart')
    // }


    return (
        <div className="main-AddToCartPopup">
            <div className="modal" />
            
            <Form className='form' onSubmit={typeBtn === "add to cart" ? handleAddToCart : handleBuyNow}>
            <GrClose className="close-icon" onClick={()=> setAddToCartPopup(false)} />
                {options}
                {wrapperQuantity}
                {cartAction}
                
            </Form>
            
        </div>
    );
};

export default AddToCartPopup;
