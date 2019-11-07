import React from 'react'
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent'
import Account from 'src/simi/App/core/Customer/Account'

const Home = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Home"*/'src/simi/App/core/RootComponents/CMS/Home')} {...props}/>
}

const Checkout = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Checkout"*/'src/simi/App/core/Checkout')} {...props}/>
}

const Thankyou = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Thankyou"*/'src/simi/App/core/Checkout/Thankyou')} {...props}/>
}

const Login = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Login"*/'src/simi/App/core/Customer/Login')} {...props}/>
}

const Cart = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Cart"*/'src/simi/App/core/Cart')} {...props}/>
}

const Contact = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Contact"*/'src/simi/App/core/Contact/Contact')} {...props}/>
}

const Product = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "SimiProduct"*/'src/simi/App/core/RootComponents/Product')} {...props}/>
}

const Search = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Search"*/'src/simi/App/core/RootComponents/Search')} {...props}/>
}

const Logout = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Logout"*/'src/simi/App/core/Customer/Logout')} {...props}/>
}

const PaypalExpress = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "PaypalExpress"*/'src/simi/App/core/Payment/Paypalexpress')} {...props}/>
}

const NoMatch = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "NoMatch"*/'src/simi/App/core/NoMatch')} {...props}/>
}


const router = {
    home : {
        path: '/',
        render : (location) => <Home {...location}/>
    },
    search_page: {
        path: '/search.html',
        render : (props) => <Search {...props}/>
    },
    cart : {
        path : '/cart.html',
        component : (location)=><Cart {...location}/>
    },
    product_detail : {
        path: '/product.html',
        render : (location) => <Product {...location}/>
    },
    category_page : {
        path: '/category.html',
        render : (location) => <Product {...location}/>
    },
    checkout : {
        path: '/checkout.html',
        render : (location) => <Checkout {...location}/>
    },
    thankyou : {
        path: '/thankyou.html',
        render : (location) => <Thankyou {...location}/>
    },
    login : {
        path: '/login.html',
        render : (location) => <Login {...location}/>
    },
    logout : {
        path: '/logout.html',
        render : (location) => <Logout {...location}/>
    },
    account : {
        path: '/account.html',
        render : (location) => <Account {...location} page='dashboard'/>
    },
    address_book : {
        path : '/addresses.html/:id?',
        render : location => <Account {...location} page={`address-book`} />
    },
    oder_history : {
        path : '/orderhistory.html',
        render : location => <Account {...location} page={`my-order`} />
    },
    order_history_detail : {
        path : '/orderdetails.html/:orderId',
        render : location => <Account {...location} page={`order-detail`} />
    },
    newsletter : {
        path : '/newsletter.html',
        render : location => <Account {...location} page={`newsletter`} />
    },
    profile : {
        path : '/profile.html',
        render : location => <Account {...location} page={`edit`} />
    },
    wishlist : {
        path: '/wishlist.html',
        render : (location) => <Account {...location} page={`wishlist`}/>
    },
    contact: {
        path: '/contact.html',
        render : location => <Contact {...location} page={`contact`}/>
    },
    contact: {
        path: '/paypal_express.html',
        render : location => <PaypalExpress {...location} page={`contact`}/>
    },
    noMatch: {
        component : location => <NoMatch {...location} />
    }
}
export default router;
