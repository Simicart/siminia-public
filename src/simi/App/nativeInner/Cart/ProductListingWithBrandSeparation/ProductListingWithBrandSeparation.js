import React, {Fragment, useCallback, Suspense} from 'react';
import {useProductListing} from "@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing";
import DEFAULT_OPERATIONS from "../../../core/Cart/ProductListing/productListing.gql";
import {useStyle} from "@magento/venia-ui/lib/classify";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {FormattedMessage} from "react-intl";
import Product from "../../../core/Cart/ProductListing/product";
import ProductListingTableActions from "../../../core/Cart/ProductListing/productListingTableActions";
import {ChevronRight} from 'react-feather'
import defaultClasses from "../../../core/Cart/ProductListing/productListing.module.css";
import defaultClasses_1 from './ProductListingWithBrandSeparation.module.css'
import CartProduct from "../CartProduct/CartProduct";
import EditModal from "../../../core/Cart/ProductListing/EditModal";
import Icon from "@magento/venia-ui/lib/components/Icon";


export const ProductListingWithBrandSeparation = (props) => {
    const {
        onAddToWishlistSuccess,
        setIsCartUpdating,
        fetchCartDetails,
        history,
        setDisplayOutOfStockLabel
    } = props;

    const talonProps = useProductListing({operations: DEFAULT_OPERATIONS});

    const {
        activeEditItem,
        isLoading,
        items,
        setActiveEditItem,
        wishlistConfig
    } = talonProps;

    const handleLink = useCallback(
        link => {
            history.push(link);
        },
        [history]
    );
    const classes = useStyle(defaultClasses, defaultClasses_1, props.classes);

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'productListing.loading'}
                    defaultMessage={'Fetching Cart...'}
                />
            </LoadingIndicator>
        );
    }

    //TODO: wire this to actual data
    const segeratedItems = [
        {items: [...items], name: 'A brand name', id: 1},
    ]

    if (items.length) {
        console.log(items)
        const segregatedItemLists = segeratedItems.map(zone => {
            if (!zone.items) {
                return null
            }
            return (
                <div key={zone.id}
                     className={classes.brandZoneContainer}
                >
                    <div className={classes.brandNameContainer}>
                        <span className={classes.mallIcon}>
                            <span className={classes.mallIconText}>Mall</span>
                        </span>
                        <span className={classes.brandName}>
                            <span className={classes.brandText}>{zone.name}</span>
                        </span>
                        <ChevronRight className={classes.forwardIcon}
                                      onClick={() => {
                                      }}
                                      size={16}
                        />
                    </div>
                    <div className={classes.fullLine}/>
                    {zone.items.map(product => {
                        return (
                            <CartProduct
                                item={product}
                                key={product.id}
                                setActiveEditItem={setActiveEditItem}
                                setIsCartUpdating={setIsCartUpdating}
                                onAddToWishlistSuccess={onAddToWishlistSuccess}
                                fetchCartDetails={fetchCartDetails}
                                wishlistConfig={wishlistConfig}
                            />
                        )
                    })}
                </div>
            )
        })
        const productComponents = items.map(product => (
            <Product
                item={product}
                key={product.id}
                setActiveEditItem={setActiveEditItem}
                setIsCartUpdating={setIsCartUpdating}
                onAddToWishlistSuccess={onAddToWishlistSuccess}
                fetchCartDetails={fetchCartDetails}
                wishlistConfig={wishlistConfig}
            />
        ));
        return (
            <Fragment>
                {segregatedItemLists}
            </Fragment>
        )

        return (
            <Fragment>
                <ul className={classes.root}>{productComponents}</ul>
                <ProductListingTableActions
                    handleLink={handleLink}
                    setIsCartUpdating={setIsCartUpdating}
                    items={items}
                />
                <Suspense fallback={null}>
                    <EditModal
                        item={activeEditItem}
                        setIsCartUpdating={setIsCartUpdating}
                        setActiveEditItem={setActiveEditItem}
                    />
                </Suspense>
            </Fragment>
        );
    }

    return null;
};

