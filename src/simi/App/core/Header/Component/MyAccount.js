import React, {
    Suspense,
    Fragment
} from 'react';
import User from 'src/simi/BaseComponents/Icon/User';
import { useHistory } from 'react-router-dom';
import { useAccountTrigger } from '@magento/peregrine/lib/talons/Header/useAccountTrigger';
import { useIntl } from 'react-intl';
import defaultClasses from './MyAccount.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify.js';

const AccountMenu = React.lazy(() => import('./AccountMenu'));

const MyAccount = props => {
    const history = useHistory();
    const { formatMessage } = useIntl();
    const { classes: propClasses, userData: user } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const {
        currentUser: { firstname },
        isSignedIn
    } = user;

    const talonProps = useAccountTrigger();
    const {
        accountMenuIsOpen,
        accountMenuRef,
        accountMenuTriggerRef,
        setAccountMenuIsOpen,
        handleTriggerClick
    } = talonProps;

    const account = firstname ? (
        <span
            className={classes['customer-firstname']}
            style={{ color: '#0058AC' }}
        >
            {formatMessage(
                { id: 'accountChip.chipText', defaultMessage: 'Hi, {name}' },
                { name: firstname }
            )}
        </span>
    ) : (
        formatMessage({ id: 'Account' })
    );
    return (
        <Fragment>
            <div
                role="presentation"
                ref={accountMenuTriggerRef}
                onClick={e => {
                    if (isSignedIn) handleTriggerClick(e);
                    else history.push('/sign-in');
                }}
            >
                <div
                    className={classes['item-icon']}
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <User style={{ width: 35, height: 35, display: 'block' }} />
                </div>
                <div
                    className={classes['item-text']}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {account}
                </div>
            </div>
            {isSignedIn ? (
                <Suspense fallback={null}>
                    <AccountMenu
                        classes={{
                            root: classes['accountMenuRoot'] + ' container',
                            root_open:
                                classes['accountMenuRootOpen'] + ' container'
                        }}
                        ref={accountMenuRef}
                        accountMenuIsOpen={accountMenuIsOpen}
                        setAccountMenuIsOpen={setAccountMenuIsOpen}
                    />
                </Suspense>
            ) : (
                ''
            )}
        </Fragment>
    );
};

export default MyAccount;
