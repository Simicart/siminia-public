import React, { useRef, useState, useEffect } from 'react';
import { Form } from 'informed';
import { GrClose } from 'react-icons/gr';
import Loader from '../Loader'

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
        loading,
        addToCartPopup = { addToCartPopup }
    } = props;

    const [height, setHeight] = useState();
    const ref = useRef();

    useEffect(() => {
        if (ref && ref.current && ref.current.clientHeight) {
            setHeight(ref.current.clientHeight);
        } else setHeight(398);
    }, [ref, height]);

    return (
        <div className="main-AddToCartPopup">
            {loading ? (
                <Loader />
             ) : null}
            <div className="modal" onClick={() => setAddToCartPopup(false)} />
            <div
                ref={ref}
                className="form"
                // style={{ top: `calc(100% - ${height}px)` }}
            >
                <Form
                    onSubmit={
                        typeBtn === 'add to cart'
                            ? handleAddToCart
                            : handleBuyNow
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
        </div>
    );
};

export default AddToCartPopup;
