import React, { Suspense } from 'react';
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent';
import { Route, Switch, useLocation } from 'react-router-dom';
import MagentoRoute from '@magento/venia-ui/lib/components/MagentoRoute';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import NoMatch from 'src/simi/App/core/NoMatch';
/**
 * only use loadable checkout when this error fixed: edit customer shipping address -> empty form (not prefilled)
 * error caused by changing drawer state -> rerender routers -> re-init checkout -> lost existing address book state
 * */
import Checkout from 'src/simi/App/core/Checkout';

const CMS = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "CMS"*/ 'src/simi/App/core/RootComponents/CMS')
            }
            {...props}
        />
    );
};

const BasicAccount = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "CAccount"*/ 'src/simi/App/core/Customer/Account')
            }
            {...props}
        />
    );
};

const BasicLogin = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BasicLogin"*/ 'src/simi/App/core/Customer/Login')
            }
            {...props}
        />
    );
};

const Cart = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "Cart"*/ 'src/simi/App/core/Cart')
            }
            {...props}
        />
    );
};

const Contact = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "Contact"*/ 'src/simi/App/core/Contact/Contact')
            }
            {...props}
        />
    );
};

const BasicProduct = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BasicProduct"*/ 'src/simi/App/core/RootComponents/Product')
            }
            {...props}
        />
    );
};

const BasicCategory = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "SimiCategory"*/ 'src/simi/App/core/RootComponents/Category')
            }
            {...props}
        />
    );
};

const BasicSearch = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BasicSearch"*/ 'src/simi/App/core/RootComponents/Search')
            }
            {...props}
        />
    );
};

const Logout = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "Logout"*/ 'src/simi/App/core/Customer/Logout')
            }
            {...props}
        />
    );
};

const ResetPassword = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "ResetPassword"*/ 'src/simi/App/core/Customer/ResetPassword')
            }
            {...props}
        />
    );
};

const PaypalExpress = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "PaypalExpress"*/ 'src/simi/App/core/Payment/Paypalexpress')
            }
            {...props}
        />
    );
};

const PPfailure = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "PaypalExpress"*/ 'src/simi/App/core/Payment/Paypalexpress/PPfailure')
            }
            {...props}
        />
    );
};

const Routes = props => {
    const theme = props.theme ? props.theme : 'core';
    const { pathname } = useLocation();
    useScrollTopOnChange(pathname);
    //no HomePage -> pagebuilder home page
    let HomePage = false;
    let Login = BasicLogin;
    let Account = BasicAccount;
    let Product = BasicProduct;
    let Search = BasicSearch;
    let Category = BasicCategory;

    return (
        <Suspense fallback={null}>
            <Switch>
                {/*
                 * Client-side routes are injected by BabelRouteInjectionPlugin here.
                 * Siminia's are defined in packages/siminia/src/targets/siminia-intercept.js
                 */}
                <Route
                    exact
                    path="/search.html"
                    render={props => <Search key="search_page" {...props} />}
                />
                <Route
                    exact
                    path="/cart.html"
                    render={props => <Cart key="cart" {...props} />}
                />
                <Route
                    exact
                    path="/product.html"
                    render={props => (
                        <Product key="product_detail" {...props} />
                    )}
                />
                <Route
                    exact
                    path="/category.html"
                    render={props => <Product key="category_page" {...props} />}
                />
                <Route
                    exact
                    path="/checkout.html"
                    render={props => <Checkout key="checkout" {...props} />}
                />
                <Route
                    exact
                    path="/login.html"
                    render={props => <Login key="login" {...props} />}
                />
                <Route
                    exact
                    path="/logout.html"
                    render={props => <Logout key="logout" {...props} />}
                />
                <Route
                    exact
                    path="/customer/account/createPassword"
                    render={props => (
                        <ResetPassword
                            key="customer_reset_password"
                            {...props}
                        />
                    )}
                />
                <Route
                    exact
                    path="/account.html"
                    render={props => (
                        <Account key="dashboard" page="dashboard" {...props} />
                    )}
                />
                <Route
                    exact
                    path="/addresses.html/:id?"
                    render={props => (
                        <Account
                            key="address-book"
                            page="address-book"
                            {...props}
                        />
                    )}
                />
                <Route
                    exact
                    path="/new-address.html/:addressId?"
                    render={props => (
                        <Account
                            key="new-address-book"
                            page="new-address-book"
                            {...props}
                        />
                    )}
                />
                <Route
                    exact
                    path="/orderhistory.html"
                    render={props => (
                        <Account key="my-order" page="my-order" {...props} />
                    )}
                />
                <Route
                    exact
                    path="/orderdetails.html/:orderId"
                    render={props => (
                        <Account
                            key="order-detail"
                            page="order-detail"
                            {...props}
                        />
                    )}
                />
                <Route
                    exact
                    path="/newsletter.html"
                    render={props => (
                        <Account
                            key="newsletter"
                            page="newsletter"
                            {...props}
                        />
                    )}
                />
                <Route
                    exact
                    path="/profile.html"
                    render={props => (
                        <Account key="edit" page="edit" {...props} />
                    )}
                />
                <Route
                    exact
                    path="/wishlist.html"
                    render={props => (
                        <Account key="wishlist" page="wishlist" {...props} />
                    )}
                />
                <Route
                    exact
                    path="/my-compare-products.html"
                    render={props => (
                        <Account
                            key="wishlist"
                            page="compare-products"
                            {...props}
                        />
                    )}
                />
                <Route
                    exact
                    path="/contact.html"
                    render={props => <Contact key="contact" {...props} />}
                />
                <Route
                    exact
                    path="/paypal_express.html"
                    render={props => (
                        <PaypalExpress key="ppExpress" {...props} />
                    )}
                />
                <Route
                    exact
                    path="/paypal_express_failure.html"
                    render={props => (
                        <PPfailure key="ppExpressFailure" {...props} />
                    )}
                />
                {/* <MagentoRoute /> */}
                {/*
                 * The Route below is purposefully nested with the MagentoRoute above.
                 * MagentoRoute renders the CMS page, and HomePage adds a stylesheet.
                 * HomePage would be obsolete if the CMS could deliver a stylesheet.
                 */}
                <Route
                    render={props => (
                        <NoMatch
                            {...props}
                            Product={Product}
                            Category={Category}
                            CMS={CMS}
                        />
                    )}
                />
            </Switch>
        </Suspense>
    );
};

export default Routes;
