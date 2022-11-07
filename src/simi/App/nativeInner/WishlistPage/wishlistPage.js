import React, { Fragment, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
// import { useWishlistPage } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistPage';
import { useWishlistPage } from '../talons/WishlistPage/useWishlistPage';
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
import { getBottomInsets } from '../Helper/Native';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { Redirect } from 'react-router-dom';

const WishlistPage = props => {
    const talonProps = useWishlistPage();
    const {
        errors,
        loading,
        shouldRenderVisibilityToggle,
        wishlists
    } = talonProps;
    const [{ isSignedIn }] = useUserContext();
    if (!isSignedIn) {
        return <Redirect to={'/sign-in'} />;
    }
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
        return ''
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

    return (
        <div className={`${classes.root} ${!isMobileSite ? 'container' : ''}`}>
            <div className={classes.wrapper}>
                <LeftMenu label="WishList" />
                <div className={classes.container}>
                    <div className={classes.containerSub}>
                        <h1 className={classes.heading}>
                            <FormattedMessage
                                id={'Favorites'}
                                defaultMessage={'Favorites'}
                            />
                        </h1>
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
