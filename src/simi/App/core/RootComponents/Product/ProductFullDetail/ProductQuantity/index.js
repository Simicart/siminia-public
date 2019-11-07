import React from 'react';

const Quantity = props => {
    const {initialValue, onValueChange } = props;
    const changedValue = () => {
        const qtyField = $('#product-detail-qty')
        let qty = parseInt(qtyField.val())
        if (!Number.isInteger(parseInt(qty)) || qty <= 0) {
            qty = 1
        }
        onValueChange(qty)
        $('#product-detail-qty').val(qty)
    }
    return (
        <div className="product-quantity">
            <input defaultValue={initialValue} id="product-detail-qty" type="number" onChange={changedValue}/>
        </div>
    );
}

export default Quantity;
