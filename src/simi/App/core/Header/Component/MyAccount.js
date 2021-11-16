import React, { useState, useRef, useMemo, useCallback } from 'react'
import User from "src/simi/BaseComponents/Icon/User";
import Identify from "src/simi/Helper/Identify";
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import { useHistory } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const MyAccount = props => {
    const [open, setOpen] = useState(false)
    const { classes } = props
    const history = useHistory()
    const anchorEl = useRef(null);
    const [user] = useUserContext();
    const { currentUser: { firstname }, isSignedIn } = user

    const handleLink = useCallback((link) => {
        history.push(link)
    }, [history])

    const handleToggle = useCallback(() => {
        setOpen(!open);
    }, [setOpen, open])

    const handleClose = event => {
        if (anchorEl && anchorEl.current && anchorEl.current.contains(event.target)) {
            return;
        }
        setOpen(false)
    };

    const handleMenuAccount = useCallback(link => {
        handleLink(link)
        handleToggle()
    }, [handleLink, handleToggle])

    const renderMyAccount = useMemo(() => {
        return (
            <Popper open={open} anchorEl={anchorEl.current}
                placement="bottom-start"
                transition disablePortal>
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin: 'center bottom' }}
                    >

                        <div className={classes["menu-my-account"]}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <div className={classes["list-menu-account"]}>
                                    <MenuItem className={classes["my-account-item"]} onClick={() => handleMenuAccount('/account.html')}>
                                        {Identify.__('My Account')}
                                    </MenuItem>
                                    <MenuItem className={classes["my-account-item"]} onClick={() => handleMenuAccount('/logout.html')}>
                                        {Identify.__('Logout')}
                                    </MenuItem>
                                </div>
                            </ClickAwayListener>
                        </div>
                    </Grow>
                )}
            </Popper>
        )
    }, [classes, open, anchorEl, handleMenuAccount])

    const handleClickAccount = () => {
        if (isSignedIn) {
            handleToggle()
        } else {
            handleLink('/login.html')
        }
    }

    const account = firstname ?
        <span className={classes["customer-firstname"]} style={{ color: '#0F7D37' }}>
            {`Hi, ${firstname}`}
        </span> : Identify.__('Account')
    return (
        <div style={{ position: 'relative' }} ref={anchorEl}>
            <div role="presentation" onClick={handleClickAccount}>
                <div className={classes["item-icon"]} style={{ display: 'flex', justifyContent: 'center' }}>
                    <User style={{ width: 30, height: 30, display: 'block' }} />
                </div>
                <div className={classes["item-text"]} style={{ whiteSpace: 'nowrap' }}>
                    {account}
                </div>
            </div>
            {isSignedIn ? renderMyAccount : ''}
        </div>
    );
}

export default MyAccount;
