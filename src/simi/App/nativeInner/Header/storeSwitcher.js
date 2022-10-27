import React from 'react';
import { shape, string } from 'prop-types';

import { useStoreSwitcher } from 'src/simi/App/nativeInner/talons/Header/useStoreSwitcher';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './storeSwitcher.module.css';
import SwitcherItem from '@magento/venia-ui/lib/components/Header/switcherItem';
import Shimmer from './storeSwitcher.shimmer';
import CountryFlag from 'src/simi/BaseComponents/CountryFlag'

const StoreSwitcher = props => {
    const {
        availableStores,
        currentGroupName,
        currentStoreName,
        currentLocale,
        handleSwitchStore,
        storeGroups,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick
    } = useStoreSwitcher();

    console.log(currentLocale)

    const classes = useStyle(defaultClasses, props.classes);
    const menuClassName = storeMenuIsOpen ? classes.menu_open : classes.menu;

    if (!availableStores) return <Shimmer />;

    if (availableStores.size <= 1) return null;

    const groups = [];
    const hasOnlyOneGroup = storeGroups.size === 1;

    storeGroups.forEach((group, key) => {
        const stores = [];
        group.forEach(({ storeGroupName, storeName, isCurrent, code }) => {
            let label;
            if (hasOnlyOneGroup) {
                label = `${storeName}`;
            } else {
                label = `${storeGroupName} - ${storeName}`;
            }
            stores.push(
                <li key={code} className={classes.menuItem}>
                    <SwitcherItem
                        active={isCurrent}
                        onClick={handleSwitchStore}
                        option={code}
                    >
                        {label}
                    </SwitcherItem>
                </li>
            );
        });

        groups.push(
            <ul className={classes.groupList} key={key}>
                {stores}
            </ul>
        );
    });

    let triggerLabel;
    if (hasOnlyOneGroup) {
        triggerLabel = `${currentStoreName}`;
    } else {
        triggerLabel = `${currentGroupName} - ${currentStoreName}`;
    }

    let countryCode = null
    if(currentLocale && typeof currentLocale === 'string') {
        const currentLocaleArr = currentLocale.split('_')
        if(Array.isArray(currentLocaleArr) && currentLocaleArr.length > 1) {
            countryCode = currentLocaleArr[1]
        }
    }

    return (
        <div className={classes.root}>
            <button
                className={classes.trigger}
                aria-label={currentStoreName}
                onClick={handleTriggerClick}
                ref={storeMenuTriggerRef}
            >
                {countryCode && <div className={classes.countryFlag}><CountryFlag alpha2={countryCode} /></div>}
                <span className={classes.label}>{triggerLabel}</span>
            </button>
            <div ref={storeMenuRef} className={menuClassName}>
                <div className={classes.groups}>{groups}</div>
            </div>
        </div>
    );
};

export default StoreSwitcher;

StoreSwitcher.propTypes = {
    classes: shape({
        groupList: string,
        groups: string,
        menu: string,
        menu_open: string,
        menuItem: string,
        root: string,
        trigger: string
    })
};
