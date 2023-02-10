import React, { useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import defaultClasses from './leftMenu.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import {
    Trash2,
    User,
    Trello,
    Heart,
    Tag,
    Check,
    Users,
    Info,
    Star,
    CheckCircle,
    DollarSign,
    Gift,
    CreditCard,
    Bell,
    LogOut
} from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Link } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const LeftMenu = props => {
    const [userData] = useUserContext();

    const {
        currentUser: { firstname, lastname }
    } = userData;
    
    const { label } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const rewardPointEnabled =
        window.SMCONFIGS &&
        window.SMCONFIGS.plugins &&
        window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
        parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;
    const giftCardEnabled = true   //get store config variable later

    let listMenuContent = [
        {
            name: 'Order History',
            id: 'Order History',
            url: '/order-history'
        },

        {
            name: 'WishList',
            id: 'WishList',
            url: '/wishlist'
        },
        {
            name: 'Address Book',
            id: 'Address Book',
            url: '/address-book'
        },
        // {
        //     name: 'Saved Payments',
        //     id: 'Saved Payments',
        //     url: '/saved-payments'
        // },

        // {
        //     name: 'Product Review',
        //     id: 'Product Review',
        //     url: '/product-review'
        // },
        // {
        //     name: 'Communications',
        //     id: 'Communications',
        //     url: '/communications'
        // },

        {
            name: 'Account Information',
            id: 'Account Information',
            url: '/account-information'
        },
        {
            name: 'Account Subcriptions',
            id: 'Account Subcriptions',
            url: '/account-subcriptions'
        },

        {
            name: 'Product Alert',
            id: 'Product Alert',
            url: '/product-alert'
        }
    ];
    const rewardMenuContent = [
        {
            name: 'Reward Points',
            id: 'Reward Points',
            url: '/reward-points'
        },
        {
            name: 'Reward Transactions',
            id: 'Reward Transactions',
            url: '/reward-transactions'
        }
    ];
    const giftCardContent = [
        {
            name: 'My Gift Cards',
            id: 'My Gift Cards',
            url: '/my-gift-cards'
        }
    ];
    let iconList = [
        <Icon className={classes.icon} size={22} src={Trello} />,
        <Icon className={classes.icon} size={22} src={Heart} />,
        <Icon className={classes.icon} size={22} src={Tag} />,
        <Icon className={classes.icon} size={22} src={Check} />,
        <Icon className={classes.icon} size={22} src={Star} />,
        <Icon className={classes.icon} size={22} src={Users} />,
        <Icon className={classes.icon} size={22} src={Info} />,
        <Icon className={classes.icon} size={22} src={CheckCircle} />,
        <Icon className={classes.icon} size={22} src={Bell} />
    ];
    const rewardIconList = [
        <Icon className={classes.icon} size={22} src={DollarSign} />,
        <Icon className={classes.icon} size={22} src={Gift} />
    ];
    const giftCardIconList = [
        <Icon className={classes.icon} size={22} src={CreditCard} />
    ];
    if (rewardPointEnabled) {
        listMenuContent = listMenuContent.concat(rewardMenuContent);
        iconList = iconList.concat(rewardIconList);
    }
    if (giftCardEnabled) {
        listMenuContent = listMenuContent.concat(giftCardContent);
        iconList = iconList.concat(giftCardIconList);
    }
    const MenuItems = listMenuContent.map((item, index) => {
        const reformat = item.name.replace(/\s/g, '-');
        const urlText = reformat.toLowerCase();
        return (
            <div
                key={index}
                className={label == item.name ? classes.activeItem : classes.item}
            >
                {/* {iconList[index]} */}
                <Link to={`/${urlText}`}>
                    <FormattedMessage id={item.id} defaultMessage={item.name} />
                </Link>
            </div>
        );
    });

    return (
        <div className={classes.wrapper}>
            <div className={classes.welcome}>
                <span>
                    {formatMessage({
                        id: 'Welcome,',
                        defaultMessage: 'Welcome,'
                    })}
                </span>
                <span>{firstname}{' '}{lastname}</span>
            </div>
            <div className={classes.logout}>
                <Link to="/logout.html">
                    {formatMessage({
                        id: 'Log out',
                        defaultMessage: 'Log out'
                    })}
                </Link>
                <Icon className={classes.icon} size={22} src={LogOut} />
            </div>
            {MenuItems}
        </div>
    );
};

export default LeftMenu;
