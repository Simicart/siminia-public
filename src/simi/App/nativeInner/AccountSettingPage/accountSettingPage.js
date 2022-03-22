import React from 'react';
import defaultClasses from './accountSettingPage.module.css';
import StoreSwitcher from './storeSwitcher';
import CurrencySwitcher from './currencySwitcher';
import Identify from 'src/simi/Helper/Identify';
import { useStyle } from '@magento/venia-ui/lib/classify';

const AccountSettingPage = props => {
    const storeConfig = Identify.getStoreConfig();
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div>
            <div className={classes.switchersContainer}>
                {storeConfig ? (
                    <div className={classes.switchers}>
                        <StoreSwitcher />
                        <CurrencySwitcher />
                    </div>
                ) : (
                    <div style={{ height: 37 }} />
                )}
            </div>
        </div>
    );
};

export default AccountSettingPage;
