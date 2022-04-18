import React, { Fragment, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useWishlistPage } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistPage';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { BsFillShareFill } from 'react-icons/bs';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
// import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import Wishlist from './wishlist';
import defaultClasses from './wishlistPage.module.css';
import LeftMenu from '../../core/LeftMenu';
import CreateWishlist from '@magento/venia-ui/lib/components/WishlistPage/createWishlist.js';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useWindowSize } from '@magento/peregrine';
import Loader from '../Loader';

const WishlistPage = props => {
    const talonProps = useWishlistPage();
    const {
        errors,
        loading,
        shouldRenderVisibilityToggle,
        wishlists
    } = talonProps;

    const { formatMessage } = useIntl();
    const error = errors.get('getCustomerWishlistQuery');

    const classes = useStyle(defaultClasses, props.classes);
    const WISHLIST_DISABLED_MESSAGE = formatMessage({
        id: 'wishlistPage.wishlistDisabledMessage',
        defaultMessage: 'The wishlist is not currently available.'
    });

    const [{ cartId }] = useCartContext();

    const windowSize = useWindowSize();
    const isMobileSite = windowSize.innerWidth <= 768;

    const wishlistElements = useMemo(() => {
        if (wishlists.length === 0) {
            return <Wishlist />;
        }
        return wishlists.map((wishlist, index) => (
            <Wishlist
                key={wishlist.id}
                isCollapsed={index !== 0}
                data={wishlist}
                shouldRenderVisibilityToggle={shouldRenderVisibilityToggle}
            />
        ));
    }, [shouldRenderVisibilityToggle, wishlists]);

    if (loading && !error) {
        return <Loader />;
    }

    let content;
    if (error) {
        const derivedErrorMessage = deriveErrorMessage([error]);
        const errorElement =
            derivedErrorMessage === WISHLIST_DISABLED_MESSAGE ? (
                <p>
                    <FormattedMessage
                        id={'wishlistPage.disabledMessage'}
                        defaultMessage={
                            'Sorry, this feature has been disabled.'
                        }
                    />
                </p>
            ) : (
                <p className={classes.fetchError}>
                    <FormattedMessage
                        id={'wishlistPage.fetchErrorMessage'}
                        defaultMessage={
                            'Something went wrong. Please refresh and try again.'
                        }
                    />
                </p>
            );

        content = <div className={classes.errorContainer}>{errorElement}</div>;
    } else {
        content = (
            <Fragment>
                {wishlistElements}
                <CreateWishlist />
            </Fragment>
        );
    }
    const handleShare = ()=>{
        if (navigator.share) {
            navigator
                .share({
                    title: 'My phone',
                    text: 'I shared this content via my mobile',
                    url: window.location.href
                })
                .then(() => {
                    console.log('Successfully shared');
                })
                .catch(error => {
                    console.error(
                        'Something went wrong sharing the blog',
                        error
                    );
                });
        } else {
            console.log(
                'Web share is currently not supported on this browser. Please provide a callback'
            );
        }
    }
    return (
        <div className={`${classes.root} ${!isMobileSite ? 'container' : ''}`}>
            <div className={classes.wrapper}>
                <LeftMenu label="WishList" />
                <div className={classes.container}>
                    <div className={classes.containerSub}>
                        <h1 className={classes.heading}>
                            <FormattedMessage
                                values={{ count: wishlists.length }}
                                id={'wishlistPage.headingText'}
                                defaultMessage={'Favorites Lists'}
                            />
                        </h1>
                        {/* <div className={classes.btncontainer}>
                            <button>
                                {
                                   formatMessage({
                                    id: 'Add all to cart',
                                    defaultMessage: 'Add all to cart'
                                })
                                }
                            </button>
                            <button>
                            {
                                   formatMessage({
                                    id: 'Detele all',
                                    defaultMessage: 'Delete all'
                                })
                                }
                            </button>
                        </div> */}
                        <div onClick={()=>handleShare()} className={classes.btnShare}>
                            <BsFillShareFill size={25} />
                        </div>
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
