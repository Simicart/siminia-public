import React, { Fragment, useCallback, Suspense } from 'react';
import { array, func, shape, string } from 'prop-types';
import Main from './App/core/Main';
import Navigation from './App/core/Navigation';
import Routes from './Routes';
import Mask from 'src/simi/BaseComponents/Mask';
import { useApp } from '@magento/peregrine/lib/talons/App/useApp';
import { useToasts } from '@magento/peregrine';
import ToastContainer from '@magento/venia-ui/lib/components/ToastContainer';
import Icon from '@magento/venia-ui/lib/components/Icon';

import {
    AlertCircle as AlertCircleIcon,
    CloudOff as CloudOffIcon,
    Wifi as WifiIcon
} from 'react-feather';
import Identify from './Helper/Identify';
import HOProgress from './ProgressBar/HOProgress';
import globalCSS from '../index.css';

const OnlineIcon = <Icon src={WifiIcon} attrs={{ width: 18 }} />;
const OfflineIcon = <Icon src={CloudOffIcon} attrs={{ width: 18 }} />;
const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const ERROR_MESSAGE = Identify.__('Sorry! An unexpected error occurred.');

const App = props => {
    const { markErrorHandled, renderError, unhandledErrors } = props;
    const [, { addToast }] = useToasts();
    // const storeConfig = Identify.getStoreConfig();
    const handleIsOffline = useCallback(() => {
        addToast({
            type: 'error',
            icon: OfflineIcon,
            message: Identify.__(
                'You are offline. Some features may be unavailable.'
            ),
            timeout: 3000
        });
    }, [addToast]);

    const handleIsOnline = useCallback(() => {
        addToast({
            type: 'info',
            icon: OnlineIcon,
            message: Identify.__('You are online.'),
            timeout: 3000
        });
    }, [addToast]);

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

    if (renderError) {
        return (
            <Fragment>
                <Main isMasked={true} />
                <Mask isActive={true} />
                <ToastContainer />
            </Fragment>
        );
    }

    return (
        <Fragment>
            <HOProgress />
            <Main isMasked={hasOverlay}>
                <Routes />
            </Main>
            <Mask isActive={hasOverlay} dismiss={handleCloseDrawer} />
            <Suspense fallback={null}>
                <Navigation />
            </Suspense>
            <ToastContainer />
        </Fragment>
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
