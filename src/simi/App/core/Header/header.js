import React, { Suspense } from 'react'
import Identify from "src/simi/Helper/Identify";
import WishList from 'src/simi/BaseComponents/Icon/WishList'
import MenuIcon from 'src/simi/BaseComponents/Icon/Menu'
import ToastMessage from 'src/simi/BaseComponents/Message/ToastMessage'
import TopMessage from 'src/simi/BaseComponents/Message/TopMessage'
import NavTrigger from './Component/navTrigger'
import CartTrigger from './cartTrigger'
import defaultClasses from './header.css'
import { mergeClasses } from 'src/classify'
import { Link } from 'src/drivers';
import HeaderNavigation from './Component/HeaderNavigation'
import MyAccount from './Component/MyAccount'
import Settings from './Component/Settings'
import { withRouter } from 'react-router-dom';
import { logoUrl } from 'src/simi/Helper/Url';
import SearchForm from './Component/SearchForm';
require('./header.scss');

class Header extends React.Component{
    constructor(props) {
        super(props);
        this._mounted = true;
        const isPhone = window.innerWidth < 1024 ;
        this.state = {isPhone}
        this.classes = mergeClasses(defaultClasses, this.props.classes)
    }

    setMinPhone = () => {
        const width = window.innerWidth;
        const isPhone = width < 1024;
        if (this.state.isPhone !== isPhone){
            this.setState({isPhone})
        }
    }

    componentDidMount(){
        window.addEventListener('resize', this.setMinPhone);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setMinPhone);
    }


    renderLogo = () => {
        const {isPhone} = this.state;
        const storeConfig = Identify.getStoreConfig();
        const storeName =
            storeConfig && storeConfig.storeConfig
                ? storeConfig.storeConfig.store_name
                : '';
        return (
            <div className={`${this.classes['search-icon']} ${this.classes['header-logo']}`} >
                <Link to='/'>
                    <img
                        src={logoUrl()}
                        alt={storeName} style={!isPhone?{width: 240, height: 40}:{width: 180, height: 30}}/>
                </Link>
            </div>
        )
    }

    renderSearchForm = () => {
        return(
            <div className={`${this.classes['header-search']} header-search ${Identify.isRtl() ? this.classes['header-search-rtl'] : ''}`}>
                <SearchForm history={this.props.history} />
            </div>
        )
    }

    renderRightBar = () => {
        const {classes} = this
        return(
            <div className={`${classes['right-bar']} ${Identify.isRtl() ? 'right-bar-rtl' : ''}`}>
                {
                    !this.state.isPhone && <Settings classes={classes}/>
                }
                <div className={classes['right-bar-item']} id="my-account">
                    <MyAccount classes={classes}/>
                </div>
                <div
                    className={classes['right-bar-item']} id="wish-list"
                >
                    <Link to={'/wishlist.html'}>
                        <div className={classes['item-icon']} style={{display: 'flex', justifyContent: 'center'}}>
                            <WishList style={{width: 30, height: 30, display: 'block'}} />
                        </div>
                        <div className={classes['item-text']}>
                            {Identify.__('Favourites')}
                        </div>
                    </Link>
                </div>
                <div className={`${classes['right-bar-item']} ${Identify.isRtl() ? 'right-bar-item-rtl' : ''}`}>
                    <CartTrigger classes={classes}/>
                </div>
            </div>
        )
    }

    renderViewPhone = () => {
        return(
            <div>
                <div className="container">
                    <div className={this.classes['header-app-bar']}>
                        <NavTrigger>
                            <MenuIcon color="#333132" style={{width:30,height:30}}/>
                        </NavTrigger>
                        {this.renderLogo()}
                        <div className={this.classes['right-bar']}>
                            <div className={this.classes['right-bar-item']}>
                                <CartTrigger />
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderSearchForm()}
                <div id="id-message">
                    <TopMessage history={this.props.history}/>
                    <ToastMessage/>
                </div>
            </div>


        )
    }

    render(){
        this.classes = mergeClasses(defaultClasses, this.props.classes);
        if(this.state.isPhone){
            return this.renderViewPhone()
        }
        const storeConfig = Identify.getStoreConfig();
        return(
            <React.Fragment>
                <div className="container">
                    <div className={this.classes['header-app-bar']}>
                        {this.renderLogo()}
                        {storeConfig && this.renderSearchForm()}
                        {storeConfig && this.renderRightBar()}
                    </div>
                </div>
                {(window.innerWidth >= 1024 && storeConfig)  ? <HeaderNavigation classes={this.classes}/> : ''}
                <div id="id-message">
                    <TopMessage history={this.props.history}/>
                    <ToastMessage/>
                </div>
            </React.Fragment>
        )
    }
}
export default (withRouter)(Header)
