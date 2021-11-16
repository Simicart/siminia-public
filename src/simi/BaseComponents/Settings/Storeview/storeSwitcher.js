import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import Check from 'src/simi/BaseComponents/Icon/TapitaIcons/SingleSelect';
import { useStoreSwitcher } from 'src/simi/talons/Header/useStoreSwitcher';
import ListItemNested from 'src/simi/BaseComponents/MuiListItem/Nested';
import MenuItem from 'src/simi/BaseComponents/MenuItem';
import { configColor } from 'src/simi/Config';

const StoreSwitcher = props => {
    const { classes, storeviewLabel, opendefault, className } = props;

    const talonProps = useStoreSwitcher();

    const {
        handleSwitchStore,
        currentStoreName,
        availableStores,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick
    } = talonProps;

    if (!availableStores || availableStores.size <= 1) return null;

    const stores = [];

    availableStores.forEach((store, code) => {
        const isSelected = store.isCurrent;
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
        const storeItem = (
            <div
                className={`${classes['store-item']} store-item ${
                    isSelected ? 'selected' : 'not-selected'
                }`}
                style={{ display: 'flex' }}
            >
                <div className={`${classes['selected']} selected`}>
                    {selectedSign}
                </div>
                <div className={`${classes['store-name']} store-name`}>
                    {store.storeName}
                </div>
            </div>
        );
        stores.push(
            <div
                role="presentation"
                key={code}
                style={{ marginLeft: 5, marginRight: 5 }}
                onClick={() => handleSwitchStore(code)}
                className={`store-item-ctn ${isSelected && 'selected'}`}
            >
                <MenuItem
                    title={storeItem}
                    className={className}
                    divider={stores.length !== availableStores.size - 1}
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
                        {storeviewLabel
                            ? storeviewLabel
                            : Identify.__('Language')}
                    </div>
                }
                className={className}
                opendefault={opendefault}
            >
                {stores}
            </ListItemNested>
        </div>
    );
};

export default StoreSwitcher;
