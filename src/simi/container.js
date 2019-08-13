import { connect } from 'src/drivers';

import appActions, { closeDrawer } from 'src/actions/app';
import App from './app';

const mapStateToProps = ({ app, unhandledErrors }) => {
    const { hasBeenOffline, isOnline } = app
    return {
        hasBeenOffline,
        isOnline,
        unhandledErrors
    }
};
const { markErrorHandled } = appActions;
const mapDispatchToProps = { closeDrawer, markErrorHandled };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
