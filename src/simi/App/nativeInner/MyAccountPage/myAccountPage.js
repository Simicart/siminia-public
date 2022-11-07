import React, { useRef } from 'react';
import defaultClasses from './myAccountPage.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { FormattedMessage, useIntl } from 'react-intl';
import CacheHelper from 'src/simi/Helper/CacheHelper';

import {
    MdPendingActions,
    MdIncompleteCircle,
    MdOutlineCancelPresentation
} from 'react-icons/md';
import {
    Trash2,
    Map,
    Trello,
    Heart,
    Tag,
    Check,
    Users,
    Info,
    Star,
    CheckCircle,
    MapPin,
    Settings,
    UserCheck,
    Gift,
    HelpCircle,
    CreditCard,
    Pocket, 
    Bell
} from 'react-feather';
import { Link } from 'react-router-dom';
import Icon from '@magento/venia-ui/lib/components/Icon';

const servicesList = [
    'Address Book',
    'Product Review',
    'Wishlist',
    'Account Setting',
    'Account Information',
    'Account Subcriptions',
    'Reward Points',
    'Contact Us',
    'Saved Payments',
    'Product Alert'
];
const signInRequired = [
    'Address Book',
    'Product Review',
    'Wishlist',
    'Account Information',
    'Account Subcriptions',
    'Reward Points',
    'Product Alert'
];
const giftCard = [
    "My Gift Cards",
];

const MyAccountPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();
    const orderSize = useRef();
    
    const giftCardEnabled =
        window.SMCONFIGS &&
        window.SMCONFIGS.plugins &&
        window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD &&
        parseInt(window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD) === 1;

    let iconList = [
        <Icon className={classes.icon} size={22} src={MapPin} />,
        <Icon className={classes.icon} size={22} src={Star} />,
        <Icon className={classes.icon} size={22} src={Heart} />,
        <Icon className={classes.icon} size={22} src={Settings} />,
        <Icon className={classes.icon} size={22} src={Info} />,
        <Icon className={classes.icon} size={22} src={UserCheck} />,
        <Icon className={classes.icon} size={22} src={Gift} />,
        <Icon className={classes.icon} size={22} src={Users} />,
        <Icon className={classes.icon} size={22} src={Pocket} />,
        <Icon className={classes.icon} size={22} src={Bell} />
    ];

    const giftCardIconList = [        
        <Icon className={classes.icon} size={22} src={CreditCard} />,
    ];

    let mergeServicesList = [...servicesList]

    if (giftCardEnabled) {
        mergeServicesList = servicesList.concat(giftCard);
        iconList = iconList.concat(giftCardIconList);
    }

    const cleanCache = () => {
        CacheHelper.clearCaches();
        window.location.reload();
    };

    const MyOrders = (
        <div className={classes.accMyOrder}>
            <div
                className={
                    isSignedIn
                        ? classes.accMyOrderT
                        : `${classes.accMyOrderT} ${classes.disabled}`
                }
            >
                <span>{formatMessage({ id: 'Order' })}</span>
                <Link to="/order-history">
                    {formatMessage({ id: 'View all',defaultMessage:'View All' })}
                </Link>
            </div>
            <div
                className={
                    isSignedIn
                        ? classes.accMyOrderB
                        : `${classes.accMyOrderB} ${classes.disabled}`
                }
            >
                <Link
                    to={{
                        pathname: '/order-history',
                        state: { id: 'Pending' }
                    }}
                >
                    <span>
                        <MdPendingActions />
                    </span>
                    <span>
                        {formatMessage({
                            id: 'Pending'
                        })}
                    </span>
                </Link>
                <Link
                    to={{
                        pathname: '/order-history',
                        state: { id: 'Complete' }
                    }}
                >
                    <span>
                        <MdIncompleteCircle />
                    </span>
                    <span>
                        {formatMessage({
                            id: 'Complete'
                        })}
                    </span>
                </Link>
                <Link
                    to={{
                        pathname: '/order-history',
                        state: { id: 'Canceled' }
                    }}
                >
                    <span>
                        <MdOutlineCancelPresentation />
                    </span>
                    <span>
                        {formatMessage({
                            id: 'Canceled'
                        })}
                    </span>
                </Link>
            </div>
        </div>
    );
    const LogOutBtn = (
        // <div className={classes.logout}>
        <Link className={classes.logout} to="/logout.html">
            {formatMessage({
                id: 'Log out',
                defaultMessage: 'Log out'
            })}
        </Link>
        // </div>
    );

    const Services = mergeServicesList.map((service, index) => {
        const reformat =
            service !== 'Contact Us'
                ? service.replace(/\s/g, '-')
                : 'contact.html';
        const urlText = reformat.toLowerCase();
        return (
            <Link
                to={`/${urlText}`}
                key={index}
                className={
                    isSignedIn
                        ? classes.servicesItem
                        : signInRequired.includes(service)
                        ? `${classes.servicesItem} ${classes.disabled}`
                        : classes.servicesItem
                }
            >
                <span>{iconList[index]}</span>
                <span>{formatMessage({ id: service })}</span>
            </Link>
        );
    });

    return (
        <div className={classes.myAccountPageRoot}>
            {MyOrders}
            <div className={classes.accServices}>
                <div className={classes.accServicesTitle}>
                    {formatMessage({ id: 'Your account',defaultMessage:'Your Account' })}
                </div>
                <div className={classes.accServicesContent}>{Services}</div>
            </div>

            {isSignedIn ? LogOutBtn : null}
        </div>
    );
};

export default MyAccountPage;
