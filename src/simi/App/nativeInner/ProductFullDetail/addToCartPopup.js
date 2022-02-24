import React, { Fragment, Suspense, useRef, useState, useEffect } from 'react';
import { Form } from 'informed';
import { GrClose } from 'react-icons/gr';
import { Link } from 'react-router-dom';

require('./statusBar.scss');

const AddToCartPopup = props => {
    const {
        options,
        handleAddToCart,
        wrapperQuantity,
        cartAction,
        setAddToCartPopup,
        handleBuyNow,
        typeBtn,
        loading
    } = props;

    return (
        <div className="main-AddToCartPopup">
            {loading ? (
                <div>
                    <div className="loader" />
                    <div className="modal-loader" />
                </div>
            ) : null}
            <div className="modal" />
            <Form
                className="form"
                onSubmit={
                    typeBtn === 'add to cart' ? handleAddToCart : handleBuyNow
                }
            >
                <GrClose
                    className="close-icon"
                    onClick={() => setAddToCartPopup(false)}
                />
                {options}
                {wrapperQuantity}
                {cartAction}
            </Form>
        </div>
    );
};

export default AddToCartPopup;
