import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { array, func, shape, string } from 'prop-types';
import Main from './App/nativeInner/Main';
import Navigation from './App/nativeInner/Navigation';
import Routes from '@magento/venia-ui/lib/components/Routes';
import Mask from 'src/simi/BaseComponents/Mask';
import { useApp } from '@magento/peregrine/lib/talons/App/useApp';
import { useToasts } from '@magento/peregrine';
import ToastContainer from '@magento/venia-ui/lib/components/ToastContainer';
import Icon from '@magento/venia-ui/lib/components/Icon';
import {
    HeadProvider,
    StoreTitle
} from '@magento/venia-ui/lib/components/Head';
import useDelayedTransition from './talons/useDelayedTransition';
import { configColor } from './Config';
import { Helmet } from 'react-helmet';

import {
    AlertCircle as AlertCircleIcon,
    CloudOff as CloudOffIcon,
    Wifi as WifiIcon
} from 'react-feather';
import globalCSS from '../index.module.css';

const OnlineIcon = <Icon src={WifiIcon} attrs={{ width: 18 }} />;
const OfflineIcon = <Icon src={CloudOffIcon} attrs={{ width: 18 }} />;
const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const App = props => {
    const { markErrorHandled, renderError, unhandledErrors } = props;
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    //if comment out this, should uncomment saveDataToUrl at: src/simi/BaseComponents/GridItem/item.js
    // and saveCategoriesToDict at src/override/localeProvider.js
    // use custom useDelayedTransition to fix megamenu always make globalThis.avoidDelayedTransition true.
    useDelayedTransition();

    const ERROR_MESSAGE = formatMessage({
        id: 'app.errorUnexpected',
        defaultMessage: 'Sorry! An unexpected error occurred.'
    });

    const handleIsOffline = useCallback(() => {
        addToast({
            type: 'error',
            icon: OfflineIcon,
            message: formatMessage({
                id: 'app.errorOffline',
                defaultMessage:
                    'You are offline. Some features may be unavailable.'
            }),
            timeout: 3000
        });
    }, [addToast, formatMessage]);

    const handleIsOnline = useCallback(() => {
        addToast({
            type: 'info',
            icon: OnlineIcon,
            message: formatMessage({
                id: 'app.infoOnline',
                defaultMessage: 'You are online.'
            }),
            timeout: 3000
        });
    }, [addToast, formatMessage]);

    const handleError = useCallback(
        (error, id, loc, handleDismissError) => {
            const errorToastProps = {
                icon: ErrorIcon,
                message: `${ERROR_MESSAGE}\nDebug: ${id} ${loc}`,
                onDismiss: remove => {
                    handleDismissError();
                    remove();
                },
                timeout: 15000,
                type: 'error'
            };

            addToast(errorToastProps);
        },
        [ERROR_MESSAGE, addToast]
    );

    const talonProps = useApp({
        handleError,
        handleIsOffline,
        handleIsOnline,
        markErrorHandled,
        renderError,
        unhandledErrors
    });

    const { hasOverlay, handleCloseDrawer } = talonProps;
    const mainComponent = useMemo(
        () => <Main>{renderError ? '' : <Routes />}</Main>,
        [renderError]
    );
    if (renderError) {
        return (
            <HeadProvider>
                <StoreTitle />
                {mainComponent}
                <Mask isActive={true} />
                <ToastContainer />
            </HeadProvider>
        );
    }

    return (
        <HeadProvider>
            {!!configColor && (
                <Helmet
                    style={[
                        {
                            cssText: `
                        html {
                            --venia-global-color-button: ${
                                configColor.button_background
                            };
                            --venia-global-color-button-text: ${
                                configColor.button_text_color
                            };
                            --venia-global-key-color: ${
                                configColor.key_color
                            };
                            --venia-top-menu-icon-color: ${
                                configColor.top_menu_icon_color
                            }
                        }
                    `
                        }
                    ]}
                />
            )}
            {/* move StoreTitle to main to avoid querying too many APIs
            <StoreTitle />*/}
            {mainComponent}
            <Mask isActive={hasOverlay} dismiss={handleCloseDrawer} />
            <Navigation />
            <ToastContainer />
        </HeadProvider>
    );
};

App.propTypes = {
    markErrorHandled: func.isRequired,
    renderError: shape({
        stack: string
    }),
    unhandledErrors: array
};

App.globalCSS = globalCSS;

export default App;
