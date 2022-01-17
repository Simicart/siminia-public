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
    CheckCircle
} from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Link } from 'react-router-dom';

const LeftMenu = props => {
    const { label } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const listMenuContent = [
        'Order History',
        'WishList',
        'Address Book',
        'Saved Payments',
        'Product Review',
        'Communications',
        'Account Information',
        'Account Subcriptions'
    ];
    const iconList = [
        <Icon className={classes.icon} size={22} src={Trello} />,
        <Icon className={classes.icon} size={22} src={Heart} />,
        <Icon className={classes.icon} size={22} src={Tag} />,
        <Icon className={classes.icon} size={22} src={Check} />,
        <Icon className={classes.icon} size={22} src={Star} />,
        <Icon className={classes.icon} size={22} src={Users} />,
        <Icon className={classes.icon} size={22} src={Info} />,
        <Icon className={classes.icon} size={22} src={CheckCircle} />
    ];
    const MenuItems = listMenuContent.map((item, index) => {
        const reformat = item.replace(/\s/g, '-');
        const urlText = reformat.toLowerCase();

        return (
            <div
                key={index}
                className={label == item ? classes.activeItem : classes.item}
            >
                {iconList[index]}
                <Link to={`/${urlText}`}>{item}</Link>
            </div>
        );
    });

    return (
        <div className={classes.wrapper}>
            {MenuItems}
            <div className={classes.logout}>
            <Link  to="/logout.html">
                {formatMessage({
                    id: 'Log out',
                    defaultMessage: 'Log out'
                })}
            </Link>

            </div>
        </div>
    );
};

export default LeftMenu;
