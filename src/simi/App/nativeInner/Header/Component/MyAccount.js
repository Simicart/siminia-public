import React, {
    useState,
    useRef,
    Suspense,
    useCallback,
    Fragment
} from 'react';
import User from 'src/simi/BaseComponents/Icon/User';
import { useHistory } from 'react-router-dom';
import { useAccountTrigger } from '@magento/peregrine/lib/talons/Header/useAccountTrigger';
import { useIntl } from 'react-intl';
import defaultClasses from './MyAccount.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import { useWindowSize } from '@magento/peregrine';

const AccountMenu = React.lazy(() => import('./AccountMenu'));

const MyAccount = props => {
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
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
            style={!isPhone ? { color: '#0058AC' } : { color: '#fff' }}
        >
            {formatMessage(
                { id: 'accountChip.chipText', defaultMessage: 'Hi, {name}' },
                { name: firstname }
            )}
        </span>
    ) : (
        formatMessage({ id: 'Account' })
    );
    const handleClick = e => {
        if (isPhone) {
            if (isSignedIn) history.push('/account-information');
            else history.push('/sign-in');
        } else if (isSignedIn) handleTriggerClick(e);
        else history.push('/sign-in');
    };
    return (
        <Fragment>
            <div
                role="presentation"
                ref={accountMenuTriggerRef}
                // onClick={e => {
                //     if (isSignedIn) handleTriggerClick(e);
                //     else history.push('/sign-in');
                // }}
                onClick={handleClick}
                className={classes.root}
            >
                <div
                    className={classes['item-icon']}
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    {!isPhone ? (
                        <User
                            style={{ width: 30, height: 30, display: 'block' }}
                        />
                    ) : isSignedIn ? (
                        <span className={classes.accountLetter}>
                            {firstname.slice(0, 1).toUpperCase()}
                        </span>
                    ) : (
                        <User
                            style={{ width: 35, height: 35, display: 'block' }}
                        />
                    )}
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
