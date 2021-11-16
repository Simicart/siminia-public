import React from 'react';
import { useAddWishlist } from 'src/simi/talons/Wishlist/useAddWishlist';
import { showToastMessage } from 'src/simi/Helper/Message';
import Identify from 'src/simi/Helper/Identify';
import { Whitebtn } from 'src/simi/BaseComponents/Button'

export const AddToWishlist = (props) => {
    const { toggleMessages, params } = props || {};
    const {
        addWishlist,
        derivedErrorMessage
    } = useAddWishlist({ toggleMessages });

    if (derivedErrorMessage)
        showToastMessage(derivedErrorMessage)

    const addToWishlist = () => {
        if (params && params.product && addWishlist) {
            if (params.super_attribute) {
                addWishlist(params.product, JSON.stringify(params));
            } else {
                addWishlist(params.product);
            }
        } else {
            showToastMessage(Identify.__('Please select the options required (*)'));
        }
    }

    return (
        <div className="wishlist-actions">
            <Whitebtn
                className="add-to-wishlist-btn"
                onClick={addToWishlist}
                text={Identify.__('Add to Favourites')} />
        </div>
    );
}

export default AddToWishlist;