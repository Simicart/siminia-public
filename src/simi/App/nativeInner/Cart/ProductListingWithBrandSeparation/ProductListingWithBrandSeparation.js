import React, {Fragment, useState, useMemo, useEffect} from 'react';
import {useProductListing} from "@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing";
import DEFAULT_OPERATIONS from "../../../core/Cart/ProductListing/productListing.gql";
import {useStyle} from "@magento/venia-ui/lib/classify";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {FormattedMessage} from "react-intl";
import {ChevronRight} from 'react-feather'
import defaultClasses from "../../../core/Cart/ProductListing/productListing.module.css";
import defaultClasses_1 from './ProductListingWithBrandSeparation.module.css'
import CartProduct from "../CartProduct/CartProduct";
import {FOOTER_HEIGHT, FOOTER_HEIGHT_PAD, hasVendor, HEADER_HEIGHT} from "./ProductListingWithBrandSeparation.config";
import {configColor} from "../../../../Config";
import LoadingBridge from "../LoadingBridge/LoadingBridge";
import HeightPad from "../HeightPad/heightPad";


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
        setLoading,
        makeNotification,
        summaryRef,
        setFirstProductLoad,
        cartItems
    } = props;
    
    const [savedCart, setSavedCart] = useState(cartItems)
    console.log(cartItems)

    const talonProps = useProductListing({operations: DEFAULT_OPERATIONS});

    const {
        activeEditItem,
        isLoading,
        // items,
        setActiveEditItem,
        wishlistConfig
    } = talonProps;

    const classes = useStyle(defaultClasses, defaultClasses_1, props.classes);

    //TODO: wire this to actual data
    const segeratedItems = useMemo(() => ([
            {cartItems: [...cartItems], name: 'A brand name', id: 1},
        ]),
        [cartItems]
    )

    const hasOutOfStockProduct = useMemo(
        () => cartItems.some((product) => {
            return product.stockStatus === 'OUT_OF_STOCK'
        }),
        [cartItems]
    )

    useEffect(() => {
        setDisplayOutOfStockLabel(hasOutOfStockProduct)
    }, [hasOutOfStockProduct])

    useEffect(() => {
        setLoading(isLoading)

        return () => setLoading(false)
    }, [setLoading, isLoading])

    const minComponentHeight = summaryRef.current ? (
        window.innerHeight - summaryRef.current.offsetHeight
        - FOOTER_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT_PAD
    ) : 100

    useEffect(() => {
        if (!isLoading && cartItems.length) {
            setFirstProductLoad(false)
        }
    }, [isLoading, cartItems, setFirstProductLoad])

    if (isLoading) {
        return (
            <Fragment>
                <HeightPad height={minComponentHeight}/>
            </Fragment>
        )
    }

    if (cartItems.length) {
        const segregatedItemLists = segeratedItems.map(zone => {
            if (!zone.cartItems) {
                return null
            }
            return (
                <div key={zone.id}
                     className={classes.brandZoneContainer}
                     style={{
                         minHeight: minComponentHeight
                     }}
                >
                    {hasVendor ? (<VendorIntro classes={classes} zone={zone}/>) : null}
                    {savedCart ? savedCart.map(product => {
                        return (
                            <CartProduct
                                item={product}
                                cartItems={zone.cartItems}
                                key={product.id}
                                setActiveEditItem={setActiveEditItem}
                                setIsCartUpdating={setIsCartUpdating}
                                onAddToWishlistSuccess={onAddToWishlistSuccess}
                                fetchCartDetails={fetchCartDetails}
                                wishlistConfig={wishlistConfig}
                                makeNotification={makeNotification}
                            />
                        )
                    }) : zone.cartItems.map(product => {
                        return (
                            <CartProduct
                                item={product}
                                cartItems={zone.cartItems}
                                key={product.id}
                                setActiveEditItem={setActiveEditItem}
                                setIsCartUpdating={setIsCartUpdating}
                                onAddToWishlistSuccess={onAddToWishlistSuccess}
                                fetchCartDetails={fetchCartDetails}
                                wishlistConfig={wishlistConfig}
                                makeNotification={makeNotification}
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

