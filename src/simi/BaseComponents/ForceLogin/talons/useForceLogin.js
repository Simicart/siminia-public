import {useMemo} from 'react';
import useForceLoginConfig from "./useForceLoginConfig";
import {useLocation} from "react-router-dom";
import {useIntl} from 'react-intl';
import {useUserContext} from '@magento/peregrine/lib/context/user';

import builtinIgnoreForceLoginRoutes from '../components/Routes/ignoreForceLoginRoutes';

const FORCE_LOGIN_ALL_PAGE = '1';
const NO_FORCE_LOGIN = '0';
const FORCE_LOGIN_SPECIAL_PAGE = '2';

const AFTER_LOGIN_REDIRECT_HOME = 'home';
const AFTER_LOGIN_REDIRECT_PREVIOUS = 'previous';
const AFTER_LOGIN_REDIRECT_CUSTOMURL = 'customurl';

const useForceLogin = props => {
    const SEARCH_RESULT_PAGE_ROUTE_PATH = '/search.html';
    const SEARCH_CART_ROUTE_PATH = '/cart';
    const SEARCH_CHECKOUT_ROUTE_PATH = '/checkout';

    const { showAlert = false } = props || {};
    const { pathname } = useLocation();
    const { formatMessage } = useIntl();
    const { moduleConfig = {}, error: bssError, loading: bssLoading } = useForceLoginConfig();
    const [{ isSignedIn }] = useUserContext();
    const formatRoute = route => route.replace(/^\/+/, '').replace(/\/$/, '');

    let hookReturn = {
        isForceLogin: false,
        redirectTo: '/sign-in',
        redirectAfterLogin: 'default',
        bssLoading
    }

    const redirectUrl = useMemo(() => {
        if (moduleConfig['redirect_to'] === AFTER_LOGIN_REDIRECT_HOME) return '/';
        if (moduleConfig['redirect_to'] === AFTER_LOGIN_REDIRECT_PREVIOUS) return pathname;
        if (moduleConfig['redirect_to'] === AFTER_LOGIN_REDIRECT_CUSTOMURL) return moduleConfig['redirect_custom_url'];
    }, [moduleConfig?.redirect_to]);
    const alertMessage = useMemo(() => {
        if (showAlert) {
            return moduleConfig?.force_login_message ||
                formatMessage({
                    id: 'forceLogin.requireLoginMessage',
                    defaultMessage: "You need login to access this page"
                });
        }
        return false;
    }, [showAlert, moduleConfig?.force_login_message]);

    const FLSpecificPages = useMemo(() => {
        try {
            if (!moduleConfig?.force_login_specific_page) return [];
            return Object.values(JSON.parse(moduleConfig.force_login_specific_page));
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, [moduleConfig?.force_login_specific_page]);


    if (!moduleConfig.enable || moduleConfig['force_login_page_type'] === NO_FORCE_LOGIN || isSignedIn || pathname === '/sign-in') {
        return { ...hookReturn, isForceLogin: false };
    }

    // Check for restrict all page
    if (moduleConfig['force_login_page_type'] === FORCE_LOGIN_ALL_PAGE) {
        const { list_ignore_router : configIgnoreForceLoginRoutes = [] } = moduleConfig || {};
        const noForceLoginRoutes = [
            ...configIgnoreForceLoginRoutes,
            ...builtinIgnoreForceLoginRoutes
        ];

        hookReturn.isForceLogin = !noForceLoginRoutes.some(route => {
            return formatRoute(route) === formatRoute(pathname);
        });
    }
    // ===========================

    if (moduleConfig['force_login_page_type'] === FORCE_LOGIN_SPECIAL_PAGE) {
        let forceLogin = false;
        // checking Special Page list
        if (FLSpecificPages.length > 0) {
            forceLogin = FLSpecificPages.some(route => {
                const { type_url: matchingType, url } = route;
                if (matchingType === "exactly") {
                    return formatRoute(url) === formatRoute(pathname);
                } else {
                    // Contain
                    return formatRoute(pathname).includes(formatRoute(url));
                }
            });
        }

        // Search Result page, cart, checkout page
        let flSrp = pathname === SEARCH_RESULT_PAGE_ROUTE_PATH && moduleConfig?.force_login_search_result_page === true;
        let flCartPage = pathname === SEARCH_CART_ROUTE_PATH && moduleConfig?.force_login_cart_page === true;
        let flCheckoutPage = pathname === SEARCH_CHECKOUT_ROUTE_PATH && moduleConfig?.force_login_checkout_page === true;
        if (flSrp || flCartPage || flCheckoutPage) {
            forceLogin = true;
        }

        hookReturn.isForceLogin = forceLogin;
    }

    hookReturn.alertMessage = alertMessage;
    hookReturn.redirectAfterLogin = redirectUrl;
    return hookReturn;
}

export default useForceLogin;
