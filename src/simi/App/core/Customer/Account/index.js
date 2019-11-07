import React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Identify from "src/simi/Helper/Identify";
import defaultClasses from './style.scss'
import LogoutIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Logout'
import CloseIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Close'
import MenuIcon from 'src/simi/BaseComponents/Icon/Menu'
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb"
import classify from 'src/classify';
import {Link} from 'react-router-dom'
import { compose } from 'redux';
import { connect } from 'src/drivers';
import Dashboard from './Page/Dashboard';
import Wishlist from './Page/Wishlist'
import Newsletter from './Page/Newsletter';
import AddressBook from './Page/AddressBook';
import Profile from './Page/Profile';
import MyOrder from './Page/OrderHistory';
import OrderDetail from './Page/OrderDetail';

class CustomerLayout extends React.Component{

    constructor(props) {
        super(props);
        const width = window.innerWidth;
        const isPhone = width < 1024
        this.state = {
            page: 'dashboard',
            isPhone,
            firstname: '',
            customer: null
        }
        this.pushTo = '/';
    }

    setIsPhone(){
        const obj = this;
        window.onresize = function () {
            const width = window.innerWidth;
            const isPhone = width < 1024
            if(obj.state.isPhone !== isPhone){
                obj.setState({isPhone: isPhone})
            }
        }
    }

    getMenuConfig = () => {
        const menuConfig = [
            {
                title : 'My Account',
                url : '/account.html',
                page : 'dashboard',
                enable : true,
                sort_order : 10
            },
            {
                title : 'My Orders',
                url : '/orderhistory.html',
                page : 'my-order',
                enable : true,
                sort_order : 20
            },
            {
                title : 'Account Information',
                url : '/profile.html',
                page : 'edit-account',
                enable : true,
                sort_order : 30
            },
            {
                title : 'Newsletter',
                url : '/newsletter.html',
                page : 'newsletter',
                enable : true,
                sort_order : 40
            },
            {
                title : 'Address Book',
                url : '/addresses.html',
                page : 'address-book',
                enable : true,
                sort_order : 50
            },
            {
                title : 'Favourites',
                url : '/wishlist.html',
                page : 'wishlist',
                enable : true,
                sort_order : 60
            }
        ]
        return menuConfig
    }

    handleToggleMenu = ()=>{
        $('list-menu-item').slideToggle('fast')
        $('menu-toggle').find('svg').toggleClass('hidden')
    }

    handleLink = (link) => {
        this.props.history.push(link)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.page || nextProps.page === prevState.page) {
            return null
        }
        return {page: nextProps.page}
    }

    redirectExternalLink = (url) => {
        if(url){
            Identify.windowOpenUrl(url)
        }
        return null;
    }

    renderMenu = () => {
        const {firstname, lastname} = this.props
        const menuConfig = this.getMenuConfig()
        const {page} = this.state;
        const menu = menuConfig.map(item => {
            const active = item.page.toString().indexOf(page) > -1 || (page === 'order-detail' && item.page === 'my-order') ? 'active' : '';

            return item.enable ?
                <MenuItem key={item.title}
                          onClick={()=> item.page ==='webtrack-login' ? this.redirectExternalLink(item.url) : this.handleLink(item.url)}
                          className={`'customer-menu-item' ${item.page} ${active}`}>
                    <div className="menu-item-title">
                        {Identify.__(item.title)}
                    </div>
                </MenuItem> : null
        },this)
        return(
            <div className="dashboard-menu">
                <div className="menu-header">
                    <div className="welcome-customer">
                        {Identify.__("Welcome, %s").replace('%s', firstname + ' ' + lastname)}
                    </div>
                    <div role="presentation" className="menu-logout" onClick={()=>this.handleLink('/logout.html')}>
                        <div className="hidden-xs">{Identify.__('Log out')}</div>
                        <LogoutIcon color={`#D7282F`} style={{width:18,height:18,marginRight:8, marginLeft:10}}/>
                    </div>
                    <div role="presentation" className="menu-toggle" onClick={()=>this.handleToggleMenu()}>
                        <MenuIcon color={`#fff`} style={{width:30,height:30, marginTop: 1}}/>
                        <CloseIcon className={`hidden`} color={`#fff`} style={{width:16,height:16, marginTop:7, marginLeft: 9, marginRight: 5}}/>
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

    renderContent = ()=>{
        const {page} = this.state;
        const { firstname, lastname, email, extension_attributes } = this.props;
        const data = {
            firstname,
            lastname,
            email,
            extension_attributes
        }
        let content = null;
        switch (page) {
            case 'dashboard':
                content = <Dashboard customer={data} history={this.props.history} isPhone={this.state.isPhone}/>
                break;
            case 'address-book':
                content = <AddressBook />
                break;
            case 'edit':
                content = <Profile data={data} history={this.props.history} isPhone={this.state.isPhone}/>
                break;
            case 'my-order':
                content = <MyOrder data={data} isPhone={this.state.isPhone} history={this.props.history}/>
                break;
            case 'newsletter':
                content = <Newsletter />
                break;
            case 'order-detail':
                content = <OrderDetail  history={this.props.history} isPhone={this.state.isPhone}/>
                break;
            case 'wishlist':
                content = <Wishlist history={this.props.history} />
                break;
            default :
                content = 'customer dashboard 2'
        }
        return content;
    }

    componentDidMount(){
        this.setIsPhone()
        $('body').addClass('body-customer-dashboard')
    }

    componentWillUnmount(){
        $('body').removeClass('body-customer-dashboard')
    }

    render() {
        const {page}= this.state;
        const {isSignedIn, history} = this.props
        this.pushTo = '/login.html';
        if(!isSignedIn){
            history.push(this.pushTo);
            return ''
        }

        return (
            <React.Fragment>
                <div className={`customer-dashboard ${page}`} style={{minHeight:window.innerHeight-200}}>
                    <BreadCrumb history={this.props.history} breadcrumb={[{name:'Home', link:'/'},{name:'Account'}]}/>
                    <div className='container'>
                        <div className="dashboard-layout">
                            {this.renderMenu()}
                            <div className='dashboard-content'>
                                {this.renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>

        );
    }
}

const mapStateToProps = ({ user }) => {
    const { currentUser, isSignedIn } = user
    const { firstname, lastname, email } = currentUser;
    return {
        firstname,
        lastname,
        email,
        isSignedIn
    };
}

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps
    )
)(CustomerLayout);
