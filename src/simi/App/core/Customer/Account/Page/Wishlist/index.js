import React, { useState } from 'react';
import { connect } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import Item from "./Item";
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { getCartDetails } from 'src/actions/cart';
import Pagination from 'src/simi/BaseComponents/Pagination';
import Loading from 'src/simi/BaseComponents/Loading'
import { hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'
import { smoothScrollToView } from 'src/simi/Helper/Behavior'
import { useWishlist } from 'src/simi/talons/Wishlist/useWishlist';

require("./index.scss");

const Wishlist = props => {
    const { history, toggleMessages, getCartDetails } = props

    const {
        data,
        isLoading,
        addToCart,
        deleteItem
    } = useWishlist({ toggleMessages });

    const renderItem = (item, index) => {
        return (
            <div
                key={item.id}
                className={`${
                    index % 4 === 0 ? "first" : ""
                    } siminia-wishlist-item`}
            >
                <Item
                    item={item}
                    lazyImage={true}
                    className={`${
                        index % 4 === 0 ? "first" : ""
                        }`}
                    showBuyNow={true}
                    toggleMessages={toggleMessages}
                    getCartDetails={getCartDetails}
                    history={history}
                    addWishlistToCart={addToCart}
                    removeItem={deleteItem}
                />
            </div>
        )
    }

    let rows = null
    if (data && data.items) {
        const { items, items_count } = data
        if (items_count && items && items.length) {
            rows = (
                <Pagination
                    data={items}
                    renderItem={renderItem}
                    itemsPerPageOptions={[8, 16, 32]}
                    showItemPerPage={false}
                    showInfoItem={false}
                    limit={12}
                    itemCount={items_count}
                    changedPage={() => smoothScrollToView($('#root'))}
                    changeLimit={() => smoothScrollToView($('#root'))}
                />
            )
        }
    } else {
        rows = <Loading />
    }
    return (
        <div className="account-my-wishlist">
            {TitleHelper.renderMetaHeader({
                title: Identify.__('Favourites')
            })}
            <div className="customer-page-title">
                {Identify.__("Favourites")}
            </div>
            <div className="account-favourites">
                <div className="product-grid">
                    {rows ? rows : (
                        <div className="no-product">
                            <p>
                                {Identify.__(
                                    "There are no products matching the selection"
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = {
    toggleMessages,
    getCartDetails
}
export default connect(
    null,
    mapDispatchToProps
)(Wishlist);
