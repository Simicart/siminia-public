import React from 'react';
import { shape, string } from 'prop-types';

import { useCurrencySwitcher } from '@magento/peregrine/lib/talons/Header/useCurrencySwitcher';

import { useStyle } from '@magento/venia-ui/lib/classify.js';
import CurrencySymbol from '@magento/venia-ui/lib/components/CurrencySymbol';
import defaultClasses from './currencySwitcher.module.css';
import SwitcherItem from '@magento/venia-ui/lib/components/Header/switcherItem.js';
import Shimmer from '@magento/venia-ui/lib/components/Header/currencySwitcher.shimmer';
import { FormattedMessage, useIntl } from 'react-intl';

const CurrencySwitcher = props => {
    const {
        handleSwitchCurrency,
        currentCurrencyCode,
        availableCurrencies,
        currencyMenuRef,
        currencyMenuTriggerRef,
        currencyMenuIsOpen,
        handleTriggerClick
    } = useCurrencySwitcher();
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);
    const menuClassName = currencyMenuIsOpen ? classes.menu_open : classes.menu;

    const currencySymbol = {
        currency: classes.symbol
    };

    if (!availableCurrencies) return <Shimmer />;

    if (availableCurrencies.length === 1) return null;

    const currencies = availableCurrencies.map(code => {
        return (
            <li key={code} className={classes.menuItem}>
                <SwitcherItem
                    active={code === currentCurrencyCode}
                    onClick={handleSwitchCurrency}
                    option={code}
                >
                    <CurrencySymbol
                        classes={currencySymbol}
                        currencyCode={code}
                        currencyDisplay={'narrowSymbol'}
                    />
                    {code}
                </SwitcherItem>
            </li>
        );
    });

    return (
        <div className={classes.root}>
            {currencyMenuIsOpen && <div className={classes.modal}/>}
            <div
                className={classes.trigger}
                aria-label={currentCurrencyCode}
                onClick={handleTriggerClick}
                ref={currencyMenuTriggerRef}
            >
                <span>

                {formatMessage({id: 'Currency'})}
                </span>
                <span className={classes.label}>
                    <CurrencySymbol
                        classes={currencySymbol}
                        currencyCode={currentCurrencyCode}
                        currencyDisplay={'narrowSymbol'}
                    />
                    {currentCurrencyCode}
                </span>
            </div>
            <div ref={currencyMenuRef} className={menuClassName}>
                <ul>{currencies}</ul>
            </div>
        </div>
    );
};

export default CurrencySwitcher;

CurrencySwitcher.propTypes = {
    classes: shape({
        root: string,
        trigger: string,
        menu: string,
        menu_open: string,
        menuItem: string,
        symbol: string
    })
};
