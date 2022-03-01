import React, {Fragment, useMemo, useEffect} from 'react';
import {useProductListing} from "@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing";
import DEFAULT_OPERATIONS from "../../../core/Cart/ProductListing/productListing.gql";
import {useStyle} from "@magento/venia-ui/lib/classify";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {FormattedMessage} from "react-intl";
import {ChevronRight} from 'react-feather'
import defaultClasses from "../../../core/Cart/ProductListing/productListing.module.css";
import defaultClasses_1 from './ProductListingWithBrandSeparation.module.css'
import CartProduct from "../CartProduct/CartProduct";
import {hasVendor} from "./ProductListingWithBrandSeparation.config";
import {configColor} from "../../../../Config";


const VendorIntro = ({zone, classes}) => {
    return (
        <Fragment>
            <div className={classes.brandNameContainer}>
                        <span className={classes.mallIcon} style={{
                            backgroundColor: configColor.button_background
                        }}>
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
            <div className={classes.fullLine}
                 style={{
                     borderColor: configColor.line_color
                 }}/>
        </Fragment>
    )
}

export const ProductListingWithBrandSeparation = (props) => {
    const {
        onAddToWishlistSuccess,
        setIsCartUpdating,
        fetchCartDetails,
        history,
        setDisplayOutOfStockLabel,
        setLoading
    } = props;

    const talonProps = useProductListing({operations: DEFAULT_OPERATIONS});

    const {
        activeEditItem,
        isLoading,
        items,
        setActiveEditItem,
        wishlistConfig
    } = talonProps;

    const classes = useStyle(defaultClasses, defaultClasses_1, props.classes);

    //TODO: wire this to actual data
    const segeratedItems = useMemo(() => ([
            {items: [...items], name: 'A brand name', id: 1},
        ]),
        [items]
    )

    const hasOutOfStockProduct = useMemo(
        () => items.some((product) => {
            return product.stockStatus === 'OUT_OF_STOCK'
        }),
        [items]
    )

    useEffect(() => {
        setDisplayOutOfStockLabel(hasOutOfStockProduct)
    }, [hasOutOfStockProduct])

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
                    {hasVendor ? (<VendorIntro classes={classes} zone={zone}/>) : null}
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

        return (
            <Fragment>
                {segregatedItemLists}
            </Fragment>
        )
    }

    return null;
};

