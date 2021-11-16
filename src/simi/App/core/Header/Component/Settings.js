import React from 'react'
import Identify from "src/simi/Helper/Identify";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import Storeview from "src/simi/BaseComponents/Settings/Storeview/index";
import Currency from "src/simi/BaseComponents/Settings/Currency/index";
import CountryFlag from 'src/simi/BaseComponents/CountryFlag'

class Settings extends React.Component {
    state = {
        openCurrency: false,
        openStoreview: false,
    };

    handleToggleCurrency = () => {
        this.setState({ openCurrency: !this.state.openCurrency, openStoreview: false });
    };

    handleToggleStoreview = () => {
        this.setState({ openStoreview: !this.state.openStoreview, openCurrency: false });
    };

    handleClose = event => {
        if (this.state.openStoreview && this.storeAnchorEl.contains(event.target)) {
            return;
        }
        if (this.state.openCurrency && this.currencyAnchorEl.contains(event.target)) {
            return;
        }

        this.setState({ openCurrency: false, openStoreview: false });
    };

    renderStoreviewOptions = () => {
        const open = this.state.openStoreview;
        const { classes } = this.props
        const storeViewOptions = <Storeview
            classes={classes} className={classes['storeview-item']}
            opendefault={true} />
            
        if (!storeViewOptions)
            return false
        return (
            <Popper open={open} anchorEl={this.storeAnchorEl}
                placement="bottom-start"
                transition disablePortal>
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin: 'center bottom' }}
                    >

                        <div className={classes["menu-settings"]}>
                            <ClickAwayListener onClickAway={this.handleClose}>
                                <div className={classes["list-menu-settings"]}>
                                    {storeViewOptions}
                                </div>
                            </ClickAwayListener>
                        </div>
                    </Grow>
                )}
            </Popper>
        )
    }


    renderCurrencyOptions = () => {
        const open = this.state.openCurrency;
        const { classes } = this.props
        const currencyOptions = <Currency classes={classes} opendefault={true} />
        if (!currencyOptions)
            return false
        return (
            <Popper open={open} anchorEl={this.currencyAnchorEl}
                placement="bottom-start"
                transition disablePortal>
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin: 'center bottom' }}
                    >

                        <div className={classes["menu-settings"]}>
                            <ClickAwayListener onClickAway={this.handleClose}>
                                <div className={classes["list-menu-settings"]}>
                                    {currencyOptions}
                                </div>
                            </ClickAwayListener>
                        </div>
                    </Grow>
                )}
            </Popper>
        )
    }

    render() {
        const { props } = this
        const { classes } = props
        const storeConfig = Identify.getStoreConfig();
        try {
            const placeHolder = (
                <React.Fragment>
                    <div className={classes['right-bar-item']} id="header-storeview-switch" style={{ opacity: 0 }}>
                        <div className={classes["item-text"]} style={{ whiteSpace: 'nowrap' }}>
                            {Identify.__('Language')}
                        </div>
                    </div>
                    <div className={classes['right-bar-item']} id="header-currency-switch" style={{ opacity: 0 }}>
                        <div className={classes["item-text"]} style={{ whiteSpace: 'nowrap' }}>
                            {Identify.__('Currency')}
                        </div>
                    </div>
                </React.Fragment>
            )
            if (!storeConfig || !storeConfig.simiStoreConfig)
                return placeHolder
            let storeViewOptions = false
            if (storeConfig && storeConfig.availableStores && (storeConfig.availableStores.length > 1)) {
                storeViewOptions = this.renderStoreviewOptions()
            }

            const { locale_identifier } = storeConfig.simiStoreConfig.config.base
            const countryCode = locale_identifier.split('_')
            const storeIcon = (
                <div className={classes["storeview_ic"]}>
                    <CountryFlag alpha2={countryCode[1]} />
                </div>
            )

            const hasCurrencyConfig = storeConfig.simiStoreConfig.config.base.currencies.length > 1;
            const currencyIcon = <div className={classes["currency_ic"]}> {storeConfig.simiStoreConfig.currency} </div>
            return (
                <React.Fragment>
                    {storeViewOptions ?
                        <div className={classes['right-bar-item']} id="header-storeview-switch">
                            <div style={{ position: 'relative' }} ref={node => {
                                this.storeAnchorEl = node;
                            }}>
                                <div role="presentation" onClick={() => this.handleToggleStoreview()}>
                                    <div className={classes["item-icon"]} style={{ display: 'flex', justifyContent: 'center' }}>
                                        {storeIcon}
                                    </div>
                                    <div className={classes["item-text"]} style={{ whiteSpace: 'nowrap' }}>
                                        {Identify.__('Language')}
                                    </div>
                                </div>
                                {storeViewOptions}
                            </div>
                        </div> : ''}
                    {hasCurrencyConfig ?
                        <div className={classes['right-bar-item']} id="header-currency-switch">
                            <div style={{ position: 'relative' }} ref={node => {
                                this.currencyAnchorEl = node;
                            }}>
                                <div role="presentation" onClick={() => this.handleToggleCurrency()}>
                                    <div className={classes["item-icon"]} style={{ display: 'flex', justifyContent: 'center' }}>
                                        {currencyIcon}
                                    </div>
                                    <div className={classes["item-text"]} style={{ whiteSpace: 'nowrap' }}>
                                        {Identify.__('Currency')}
                                    </div>
                                </div>
                                {this.renderCurrencyOptions()}
                            </div>
                        </div> : ''}
                </React.Fragment>
            );
        } catch (err) {
            console.warn(err)
        }
        return placeHolder
    }
}

export default Settings;