const { Targetables } = require('@magento/pwa-buildpack');
module.exports = targets => {
    const targetables = Targetables.using(targets);

    // SignIn Page - show alert message
    const SignInPage = targetables.reactComponent('@simicart/siminia/src/simi/App/nativeInner/Customer/Login/signInPage.js');
    const useLocation = SignInPage.addImport('import { useLocation } from \'react-router-dom\';');
    const Icon = SignInPage.addImport('import Icon from \'@magento/venia-ui/lib/components/Icon\';');
    SignInPage.addImport('import { AlertCircle } from \'react-feather\';');
    const useToasts = SignInPage.addImport('import { useToasts } from \'@magento/peregrine\';');
    const useEffectSignInPage = SignInPage.addImport('import { useEffect } from \'react\';');
    SignInPage.insertAfterSource(
        'const { formatMessage } = useIntl();',
        `
    const [, { addToast, removeToast }] = ${useToasts}();
    const location = ${useLocation}();

    ${useEffectSignInPage}(() => {
        const { alertMessage = false } = location.state || {};
        let toastId;
        if (alertMessage) {
            const ErrorIcon = <${Icon} size={20} src={AlertCircle} />;
            toastId = addToast({ type: 'error', message: alertMessage, timeout: 0, icon: ErrorIcon, dismissable: true });
        }

        return () => {
            removeToast(toastId);
        };
    }, []);
        `
    );

    // SignIn component - hide register button by config
    const SignIn = targetables.reactComponent('@simicart/siminia/src/simi/App/nativeInner/Customer/Login/SignIn/signIn.js');
    const useForceLoginConfigSignIn = SignIn.addImport("import useForceLoginConfig from '@simicart/siminia/src/simi/BaseComponents/ForceLogin/talons/useForceLoginConfig';");
    const useStateSignIn = SignIn.addImport('import { useState } from \'react\';');
    const useEffectSignIn = SignIn.addImport('import { useEffect } from \'react\';');
    SignIn.insertAfterSource(
        '    const talonProps = useSignIn({\n' +
        '        getCartDetailsQuery: GET_CART_DETAILS_QUERY,\n' +
        '        setDefaultUsername,\n' +
        '        showCreateAccount,\n' +
        '        showForgotPassword\n' +
        '    });',
        `
    const { moduleConfig: flModuleConfig, loading: bssFLLoading, error: bssFFError } = ${useForceLoginConfigSignIn}();
    const [ isDisableRegister, setDisableRegister ] = ${useStateSignIn}(true);
    ${useEffectSignIn}(() => {
        if (!bssFLLoading && flModuleConfig) {
            if (flModuleConfig?.enable === true && flModuleConfig.disable_registration === true) {
                setDisableRegister(true);
            } else {
                setDisableRegister(false);
            }
        }

        return () => {}
    }, [flModuleConfig?.enable, flModuleConfig?.disable_registration]);
        `
    );
    SignIn.replaceJSX(
        '<Button onClick={handleCreateAccount}>',
        `<>{!isDisableRegister && <Button priority="normal" type="button" onClick={handleCreateAccount} data-cy="CreateAccount-initiateButton"> <FormattedMessage id={'signIn.createAccountText'} defaultMessage={'Create an Account'}/></Button>}</>`
    );

    // Create Account Page - disable create account page
    const CreateAccountPage = targetables.reactComponent("@simicart/siminia/src/simi/App/nativeInner/Customer/CreateAccountPage/createAccountPage.js");
    const useForceLoginConfigCreateAccountPage = CreateAccountPage.addImport("import useForceLoginConfig from '@simicart/siminia/src/simi/BaseComponents/ForceLogin/talons/useForceLoginConfig';");
    const LoadingCreateAccountPage = CreateAccountPage.addImport("import Loading from '@simicart/siminia/src/simi/BaseComponents/Loading';");
    CreateAccountPage.insertAfterSource(
        'const { formatMessage } = useIntl();',
        `
    const { moduleConfig: flModuleConfig, loading: bssFLLoading, error: bssFFError } = ${useForceLoginConfigCreateAccountPage}();
    if (bssFLLoading) {
        return <${LoadingCreateAccountPage} />;
    }
    if (!bssFLLoading && flModuleConfig && !bssFFError) {
        if (flModuleConfig.enable === true && flModuleConfig.disable_registration === true) {
            return "";
        }
    }
        `
    );

    // MagentoRoute intercept - checking for cms page, product page and category page
    const NoMatchRoute = targetables.reactComponent('@simicart/siminia/src/simi/App/nativeInner/NoMatch/index.js');
    const useMemoNoMatchRoute = NoMatchRoute.addImport("import { useMemo } from 'react';");
    const useHistory = NoMatchRoute.addImport('import { useHistory } from "react-router-dom";')
    const useForceLoginConfig = NoMatchRoute.addImport("import useForceLoginConfig from '@simicart/siminia/src/simi/BaseComponents/ForceLogin/talons/useForceLoginConfig';")
    const useUserContext = NoMatchRoute.addImport("import { useUserContext } from '@magento/peregrine/lib/context/user';")
    const useIntlImport = NoMatchRoute.addImport("import { useIntl } from 'react-intl';")
    NoMatchRoute.insertAfterSource(
        '}, [pathname, pageMaskedId, pathToFind, findPage]);',
        `
    const { replace } = ${useHistory}();
    const [{ isSignedIn }] = ${useUserContext}();
    const { formatMessage } = ${useIntlImport}();
    const SIGN_IN_PATH = '/sign-in';
    const NO_FORCE_LOGIN = '0';
    const AFTER_LOGIN_REDIRECT_HOME = 'home';
    const AFTER_LOGIN_REDIRECT_PREVIOUS = 'previous';
    const AFTER_LOGIN_REDIRECT_CUSTOMURL = 'customurl';
    const { moduleConfig: flModuleConfig, loading: bssFLLoading, error: bssFFError } = ${useForceLoginConfig}();
    const redirectAfterLogin = ${useMemoNoMatchRoute}(() => {
        if (flModuleConfig['redirect_to'] === AFTER_LOGIN_REDIRECT_HOME) return '/';
        if (flModuleConfig['redirect_to'] === AFTER_LOGIN_REDIRECT_PREVIOUS) return pathname;
        if (flModuleConfig['redirect_to'] === AFTER_LOGIN_REDIRECT_CUSTOMURL) return flModuleConfig['redirect_custom_url'];
    }, [ flModuleConfig?.redirect_to, pathname, flModuleConfig?.redirect_custom_url ]);

    let requireLogin = false;
    const alertMessage = ${useMemoNoMatchRoute}(() => {
        return flModuleConfig?.force_login_message || false;
    }, [ flModuleConfig?.force_login_message ]);

    // perform a redirect if necesssary
    useEffect(() => {
        if (requireLogin) {
            const state = { alertMessage };
            if (redirectAfterLogin !== 'default') {
                state.from = redirectAfterLogin;
            }
            replace(SIGN_IN_PATH, state);
        }
    }, [ pathname, replace, requireLogin, redirectAfterLogin, alertMessage ]);

    if (bssFLLoading) {
        return <Loading />;
    }

    const noForceLogin = !flModuleConfig.enable || flModuleConfig['force_login_page_type'] === NO_FORCE_LOGIN || isSignedIn || pathname === SIGN_IN_PATH;
    if (!noForceLogin && data && !bssFFError) {
        const flPdp = data?.route?.type === TYPE_PRODUCT && flModuleConfig?.force_login_product_page === true;
        const flPlp = data?.route?.type === TYPE_CATEGORY && flModuleConfig?.force_login_category_page === true;
        const flCmsPage = flModuleConfig?.force_login_cms_page === true;
        const flCmsCurrentPath = data?.route?.type === TYPE_CMS_PAGE && flCmsPage && flModuleConfig?.force_login_cms_page_ids?.includes(data?.route?.identifier);

        if (flPdp || flPlp || flCmsCurrentPath) {
            requireLogin = true;
        }
    }
        `
    );

    // Client Route Intercept - all route, other route
    const ClientRouteMatch = targetables.reactComponent('@simicart/siminia/src/override/routesNative.js');
    const useForceLoginClientRouteMatch = ClientRouteMatch.addImport("import useForceLogin from '@simicart/siminia/src/simi/BaseComponents/ForceLogin/talons/useForceLogin';");
    const RedirectClientRouteMatch = ClientRouteMatch.addImport('import { Redirect } from "react-router-dom";');
    const LoadingClientRouteMatch = ClientRouteMatch.addImport("import Loading from '@simicart/siminia/src/simi/BaseComponents/Loading';");
    ClientRouteMatch.insertAfterSource(
        'useScrollTopOnChange(pathname);',
        `
        const { alertMessage = false, isForceLogin, bssLoading, redirectTo = '/sign-in', redirectAfterLogin = 'default' } = ${useForceLoginClientRouteMatch}({ showAlert: true });
        if (bssLoading) {
            return <${LoadingClientRouteMatch} />;
        }

        if (isForceLogin === true && pathname !== '/sign-in') {
            let state = { alertMessage };
            if (redirectAfterLogin !== 'default') {
                // Keep path in memory to redirect user there when signed in
                state.from = redirectAfterLogin;
            }
            return (
                <${RedirectClientRouteMatch}
                    to={{
                        pathname: redirectTo,
                        state
                    }}
                />
            );
        }
        `
    );

    // Search auto complete intercept
    const SearchAutoComplete = targetables.reactComponent('@simicart/siminia/src/simi/App/nativeInner/Header/Component/searchAutoComplete/index.js');
    const useForceLoginConfigSearchAutoComplete = SearchAutoComplete.addImport("import useForceLoginConfig from '@simicart/siminia/src/simi/BaseComponents/ForceLogin/talons/useForceLoginConfig';")
    SearchAutoComplete.insertAfterSource(
        'const rootClassName = visible ? classes.root_visible : classes.root_hidden;',
        `
    const { moduleConfig: flModuleConfig, loading: bssFLLoading, error: bssFFError } = ${useForceLoginConfigSearchAutoComplete}();
    const FORCE_LOGIN_SPECIAL_PAGE = '2';
    const FORCE_LOGIN_ALL_PAGE = '1';
    const SEARCH_RESULT_PAGE_ROUTE_PATH = 'search.html';
    let requireLogin = false;
    if (bssFLLoading) {
        requireLogin = true
    }
    if (flModuleConfig && !bssFLLoading && !bssFFError) {
        requireLogin = false;
        if (flModuleConfig?.force_login_page_type === FORCE_LOGIN_ALL_PAGE) {
            const { list_ignore_router : configIgnoreForceLoginRoutes = [] } = flModuleConfig || {};
            requireLogin = !configIgnoreForceLoginRoutes.some(igRoute => igRoute.replace(/^\\/+/, '').replace(/\\/$/, '') === SEARCH_RESULT_PAGE_ROUTE_PATH);
        } else if (flModuleConfig?.force_login_page_type === FORCE_LOGIN_SPECIAL_PAGE) {
            requireLogin = flModuleConfig?.enable && flModuleConfig?.force_login_search_result_page === true;
        }
    }
        `
    ).insertAfterSource(
        'useEffect(() => {\n' +
        '        if (visible',
        ` && !requireLogin`
    ).insertAfterSource(
        '[debouncedRunQuery, value, visible',
        ', requireLogin'
    ).insertAfterSource(
        '} else {\n' +
        '        message = data.products.items.length + formatMessage({ id: \'Items\' });\n' +
        '    }',
        `
    if (requireLogin) {
        message = formatMessage({ id: 'You need login to access this search.' });
    }
        `
    );
}
