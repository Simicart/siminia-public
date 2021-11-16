import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { useCurrencySwitcher } from 'src/simi/talons/Header/useCurrencySwitcher';
import { configColor } from 'src/simi/Config';
import ListItemNested from 'src/simi/BaseComponents/MuiListItem/Nested';
import MenuItem from 'src/simi/BaseComponents/MenuItem';
import Check from 'src/simi/BaseComponents/Icon/TapitaIcons/SingleSelect';

const CurrencySwitcher = props => {
    const { classes, currencyLabel, opendefault, className } = props;
    const talonProps = useCurrencySwitcher();

    const {
        handleSwitchCurrency,
        currentCurrencyCode,
        availableCurrencies,
        currencyMenuRef,
        currencyMenuTriggerRef,
        currencyMenuIsOpen,
        handleTriggerClick
    } = talonProps;

    if (!availableCurrencies || availableCurrencies.length === 1) return null;

    const currencies = availableCurrencies.map((currency, index) => {
        const isSelected = currency.value === currentCurrencyCode;
        const selectedSign = isSelected ? (
            <Check
                color={configColor.button_background}
                style={{ width: 18, height: 18, marginInlineEnd: 5 }}
            />
        ) : (
            <span
                className={`${classes['not-selected']} not-selected`}
                style={{
                    borderColor: configColor.menu_text_color,
                    width: 18,
                    height: 18,
                    marginInlineEnd: 5,
                    display: 'inline-block'
                }}
            />
        );
        const currencyItem = (
            <span
                className={`${
                    classes['currency-item']
                } currency-item  ${isSelected && 'selected'}`}
                style={{ display: 'flex' }}
            >
                <div className={`${classes['selected']} selected`}>
                    {selectedSign}
                </div>
                <div className={`${classes['currency-name']} currency-name`}>
                    {currency.title}
                </div>
            </span>
        );
        return (
            <div
                role="presentation"
                key={index}
                style={{ marginLeft: 5, marginRight: 5 }}
                onClick={() => handleSwitchCurrency(currency.value)}
                className={`store-item-ctn ${
                    isSelected ? 'selected' : 'not-selected'
                }`}
            >
                <MenuItem
                    title={currencyItem}
                    className={className}
                    divider={index !== availableCurrencies.length - 1}
                />
            </div>
        );
    });

    return (
        <div className={className}>
            <ListItemNested
                primarytext={
                    <div
                        className={`${classes['menu-title']} menu-title`}
                        style={{ color: configColor.menu_text_color }}
                    >
                        {currencyLabel
                            ? currencyLabel
                            : Identify.__('Currency')}
                    </div>
                }
                className={className}
                opendefault={opendefault}
            >
                {currencies}
            </ListItemNested>
        </div>
    );
};

export default CurrencySwitcher;
