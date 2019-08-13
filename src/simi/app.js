import React, { Component, Fragment } from 'react';
import { array, bool, func } from 'prop-types';

import Main from 'src/simi/App/core/Main';
import Mask from 'src/simi/BaseComponents/Mask';
import Navigation from 'src/simi/App/core/Navigation';
import OnlineIndicator from 'src/components/OnlineIndicator';
import ErrorNotifications from './errorNotifications';
import renderRoutes from './renderRoutes';
import errorRecord from 'src/util/createErrorRecord';

class App extends Component {
    static propTypes = {
        hasBeenOffline: bool,
        isOnline: bool,
        closeDrawer: func.isRequired,
        markErrorHandled: func.isRequired,
        unhandledErrors: array
    };

    static get initialState() {
        return {
            renderError: null
        };
    }

    shouldComponentUpdate(nextProps){
        //avoid re-render with duplicated error
        let update = true
        if (nextProps.unhandledErrors && nextProps.unhandledErrors.length) {
            const newErrLength = nextProps.unhandledErrors.length
            if (
                nextProps.unhandledErrors[newErrLength-1] &&
                this.unhandledErrors &&
                this.unhandledErrors[newErrLength-2] &&
                this.unhandledErrors[newErrLength-2].loc === nextProps.unhandledErrors[newErrLength-1].loc
                )
                update = false
            this.unhandledErrors = nextProps.unhandledErrors
        }
        return update
    }
    
    get errorFallback() {
        const { renderError } = this.state;
        if (renderError) {
            const errors = [
                errorRecord(renderError, window, this, renderError.stack)
            ];
            return (
                <Fragment>
                    <Main isMasked={true} />
                    <Mask isActive={true} />
                    <ErrorNotifications
                        errors={errors}
                        onDismissError={this.recoverFromRenderError}
                    />
                </Fragment>
            );
        }
    }

    get onlineIndicator() {
        const { hasBeenOffline, isOnline } = this.props;

        // Only show online indicator when
        // online after being offline
        return hasBeenOffline ? <OnlineIndicator isOnline={isOnline} /> : null;
    }

    // Defining this static method turns this component into an ErrorBoundary,
    // which can re-render a fallback UI if any of its descendant components
    // throw an exception while rendering.
    // This is a common implementation: React uses the returned object to run
    // setState() on the component. <App /> then re-renders with a `renderError`
    // property in state, and the render() method below will render a fallback
    // UI describing the error if the `renderError` property is set.
    static getDerivedStateFromError(renderError) {
        return { renderError };
    }

    recoverFromRenderError = () => window.location.reload();

    state = App.initialState;

    render() {
        const { errorFallback } = this;
        if (errorFallback) {
            return errorFallback;
        }
        const {
            closeDrawer,
            markErrorHandled,
            unhandledErrors
        } = this.props;
        const { onlineIndicator } = this;
        
        return (
            <Fragment>
                <Main>
                    {onlineIndicator}
                    {renderRoutes()}
                </Main>
                <Mask dismiss={closeDrawer} />
                <Navigation />
                <ErrorNotifications
                    errors={unhandledErrors}
                    onDismissError={markErrorHandled}
                />
            </Fragment>
        );
    }
}

export default App;
