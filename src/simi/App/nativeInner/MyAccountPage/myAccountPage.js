import React, { useRef } from 'react';
import defaultClasses from './myAccountPage.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { FormattedMessage, useIntl } from 'react-intl';
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
    HelpCircle
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
    'Help Center'
];
const signInRequired = [
    'Address Book',
    'Product Review',
    'Wishlist',
    'Account Information',
    'Account Subcriptions',
    'Reward Points'
];

const MyAccountPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();
    const orderSize = useRef();
    const iconList = [
        <Icon className={classes.icon} size={22} src={MapPin} />,
        <Icon className={classes.icon} size={22} src={Star} />,
        <Icon className={classes.icon} size={22} src={Heart} />,
        <Icon className={classes.icon} size={22} src={Settings} />,
        <Icon className={classes.icon} size={22} src={Info} />,
        <Icon className={classes.icon} size={22} src={UserCheck} />,
        <Icon className={classes.icon} size={22} src={Gift} />,
        <Icon className={classes.icon} size={22} src={Users} />,
        <Icon className={classes.icon} size={22} src={HelpCircle} />
    ];

    const MyOrders = (
        <div className={classes.accMyOrder}>
            <div
                className={
                    isSignedIn
                        ? classes.accMyOrderT
                        : `${classes.accMyOrderT} ${classes.disabled}`
                }
            >
                <span>Order</span>
                <Link to="/order-history">View All</Link>
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
                        state: {id:"Pending"}
                    }}
                >
                    <span>
                        <MdPendingActions />
                    </span>
                    <span>Pending</span>
                </Link>
                <Link
                    to={{
                        pathname: '/order-history',
                        state: {id:"Completed"}
                    }}
                >
                    <span>
                        <MdIncompleteCircle />
                    </span>
                    <span>Completed</span>
                </Link>
                <Link
                    to={{
                        pathname: '/order-history',
                        state: {id:"Canceled"}
                        
                    }}
                >
                    <span>
                        <MdOutlineCancelPresentation />
                    </span>
                    <span>Canceled</span>
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
    // const handle = (e) => {

    //         e.preventDefault();

    // }
    const Services = servicesList.map((service, index) => {
        const reformat = service.replace(/\s/g, '-');
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
                <span>{service}</span>
            </Link>
        );
    });

    return (
        <div className={classes.myAccountPageRoot}>
            {MyOrders}
            <div className={classes.accServices}>
                <div className={classes.accServicesTitle}>Services</div>
                <div className={classes.accServicesContent}>{Services}</div>
            </div>
            <div className={classes.imgContainer}>
                <img src={require('./images/image.png')} alt="images" />
            </div>
            {isSignedIn ? LogOutBtn : null}
        </div>
    );
};

export default MyAccountPage;
