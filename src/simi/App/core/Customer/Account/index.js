import React, { useState, useEffect } from 'react';
import { Redirect } from 'src/drivers';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Identify from "src/simi/Helper/Identify";
import LogoutIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Logout'
import CloseIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Close'
import MenuIcon from 'src/simi/BaseComponents/Icon/Menu'
/* import BreadCrumb from "src/simi/BaseComponents/BreadCrumb" */
import Dashboard from './Page/Dashboard';
import Wishlist from './Page/Wishlist'
import Newsletter from './Page/Newsletter';
import AddressBook from './Page/AddressBook';
import NewAddressBook from './Page/AddressBook/NewAddress';
import Profile from './Page/Profile';
import MyOrder from './Page/OrderHistory';
import OrderDetail from './Page/OrderDetail';
import { useWindowSize } from '@magento/peregrine';
import { useMyDashboard } from 'src/simi/talons/MyAccount/useMyDashboard';

const menuConfig = [
    {
        title: Identify.__('My Account'),
        url: '/account.html',
        page: 'dashboard',
        enable: true,
        sort_order: 10
    },
    {
        title: Identify.__('My Orders'),
        url: '/orderhistory.html',
        page: 'my-order',
        enable: true,
        sort_order: 20
    },
    {
        title: Identify.__('Account Information'),
        url: '/profile.html',
        page: 'edit-account',
        enable: true,
        sort_order: 30
    },
    {
        title: Identify.__('Newsletter'),
        url: '/newsletter.html',
        page: 'newsletter',
        enable: true,
        sort_order: 40
    },
    {
        title: Identify.__('Address Book'),
        url: '/addresses.html',
        page: 'address-book',
        enable: true,
        sort_order: 50
    },
    {
        title: Identify.__('Favorites'),
        url: '/wishlist.html',
        page: 'wishlist',
        enable: true,
        sort_order: 60
    }
];

const CustomerLayout = props => {
    const { history, /* firstname, lastname, email, isSignedIn, */ match } = props;

    const [page, setPage] = useState('dashboard');
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;

    const talonProps = useMyDashboard({});
    const { firstname, lastname, email, isSignedIn } = talonProps;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    const handleToggleMenu = () => {
        $('.list-menu-item').slideToggle('fast')
        $('.menu-toggle').find('svg').toggleClass('hidden')
    }

    const handleLink = (link) => {
        history.push(link)
    };

    if (props.page !== page) {
        // page changed since last render. Update isScrollingDown.
        setPage(props.page);
    }

    const redirectExternalLink = (url) => {
        if (url) {
            Identify.windowOpenUrl(url)
        }
        return null;
    }

    const renderMenu = () => {

        const menu = menuConfig.filter(({ enable }) => enable === true).map((item, idx) => {
            const active = item.page.toString().indexOf(page) > -1 || (page === 'order-detail' && item.page === 'my-order') || (page === 'new-address-book' && item.page === 'address-book') ? 'active' : '';

            return <MenuItem key={idx}
                onClick={() => handleLink(item.url)}
                className={`customer-menu-item ${item.page} ${active}`}>
                <div className="menu-item-title">
                    {Identify.__(item.title)}
                </div>
            </MenuItem>
        }, this);

        return (
            <div className="dashboard-menu">
                <div className="menu-header">
                    <div className="welcome-customer">
                        {`${Identify.__("Welcome")} ${firstname} ${lastname}`}
                    </div>
                    <div role="presentation" className="menu-logout" onClick={() => handleLink('/logout.html')}>
                        <div className="hidden-xs">{Identify.__('Log out')}</div>
                        <LogoutIcon color={`#D7282F`} style={{ width: 18, height: 18, marginRight: 8, marginLeft: 10 }} />
                    </div>
                    <div role="presentation" className="menu-toggle" onClick={handleToggleMenu}>
                        <MenuIcon color={`#fff`} style={{ width: 30, height: 30, marginTop: 1 }} />
                        <CloseIcon className={`hidden`} color={`#fff`} style={{ width: 16, height: 16, marginTop: 7, marginLeft: 9, marginRight: 5 }} />
                    </div>
                </div>
                <div className="list-menu-item">
                    <MenuList className='list-menu-item-content'>
                        {menu}
                    </MenuList>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        const data = {
            firstname,
            lastname,
            email
        }
        let content = null;
        switch (page) {
            case 'address-book':
                content = <AddressBook history={history} />
                break;
            case 'new-address-book':
                content = <NewAddressBook history={history} isPhone={isPhone} addressId={match.params.addressId} />
                break;
            case 'edit':
                content = <Profile data={data} history={history} isPhone={isPhone} />
                break;
            case 'my-order':
                content = <MyOrder />
                break;
            case 'newsletter':
                content = <Newsletter />
                break;
            case 'order-detail':
                content = <OrderDetail history={history} orderId={match.params.orderId} />
                break;
            case 'wishlist':
                content = <Wishlist history={history} />
                break;
            default:
                content = <Dashboard customer={data} history={history} isPhone={isPhone} />
                break;
        }
        return content;
    }

    useEffect(() => {
        $('body').addClass('body-customer-dashboard');
        return () => {
            $('body').removeClass('body-customer-dashboard');
        };
    }, []);

    /* const breadcrumb = [{ name: 'Home', link: '/' }, { name: 'Account' }]; */

    return <div className={`customer-dashboard ${page}`} style={{ minHeight: window.innerHeight - 200 }}>
        {/* <BreadCrumb history={history} breadcrumb={breadcrumb} /> */}
        <div className='container'>
            <div className="dashboard-layout">
                {renderMenu()}
                <div className='dashboard-content'>
                    {renderContent()}
                </div>
            </div>
        </div>
    </div>;
}

export default CustomerLayout;
