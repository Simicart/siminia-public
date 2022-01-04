import React, { Suspense } from 'react';
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent';
import { Route, Switch, useLocation } from 'react-router-dom';
//import MagentoRoute from '@magento/venia-ui/lib/components/MagentoRoute';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import NoMatch from '../simi/App/core/NoMatch';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import Login from 'src/simi/App/core/Customer/Login';
// const Login = props => {
//     return (
//         <LazyComponent
//             component={() =>
//                 import(/* webpackChunkName: "Login"*/ 'src/simi/App/core/Customer/Login')
//             }
//             {...props}
//         />
//     );
// };
//import CreateAccountPage from '@magento/venia-ui/lib/components/CreateAccountPage';
const CreateAccountPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "CreateAccountPage"*/ 'src/simi/App/core/Customer/CreateAccountPage')
            }
            {...props}
        />
    );
};
//import ForgotPasswordPage from '@magento/venia-ui/lib/components/ForgotPasswordPage';
const ForgotPasswordPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "ForgotPasswordPage"*/ 'src/simi/App/core/Customer/ForgotPasswordPage')
            }
            {...props}
        />
    );
};
//import OrderHistoryPage from '@magento/venia-ui/lib/components/OrderHistoryPage';
const OrderHistoryPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "OrderHistoryPage"*/ 'src/simi/App/core/OrderHistoryPage')
            }
            {...props}
        />
    );
};

const OrderDetailPage = props => {
    return <LazyComponent 
        component={() => import('src/simi/App/core/OrderDetailPage')}
        {...props}    
    />
}

//import AccountInformationPage from '@magento/venia-ui/lib/components/AccountInformationPage';
const AccountInformationPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "AccountInformationPage"*/ '/src/simi/App/core/AccountInformationPage')
            }
            {...props}
        />
    );
};
const AccountSubcriptionPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "AccountSubcriptionPage"*/ '/src/simi/App/core/AccountSubcriptionPage')
            }
            {...props}
        />
    );
};
//import AddressBookPage from '@magento/venia-ui/lib/components/AddressBookPage';
const AddressBookPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "AddressBookPage"*/ '/src/simi/App/core/AddressBookPage')
            }
            {...props}
        />
    );
};
const ProductReviewPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "ProductReviewPage"*/ '/src/simi/App/core/ProductReviewPage')
            }
            {...props}
        />
    );
};
//import WishlistPage from '@magento/venia-ui/lib/components/WishlistPage';
const WishlistPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "WishlistPage"*/ '/src/simi/App/core/WishlistPage')
            }
            {...props}
        />
    );
};
//import Checkout from 'src/simi/App/core/Checkout';
const Checkout = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "Checkout"*/ 'src/simi/App/core/Checkout')
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

const CheckoutSuccess = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "CheckoutSuccess"*/ 'src/simi/App/core/CheckoutSuccess')
            }
            {...props}
        />
    );
};

const Routes = props => {
    const { pathname } = useLocation();
    useScrollTopOnChange(pathname);
    //no HomePage -> pagebuilder home page
    const HomePage = false;
    const Search = BasicSearch;

    return (
        <Suspense fallback={fullPageLoadingIndicator}>
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
                    path="/cart"
                    render={props => (
                        <LazyComponent
                            component={() =>
                                import(/* webpackChunkName: "Cart"*/ 'src/simi/App/core/Cart')
                            }
                            {...props}
                        />
                    )}
                />
                <Route
                    exact
                    path="/checkout"
                    render={props => <Checkout {...props} />}
                />
                <Route
                    exact
                    path="/sign-in"
                    render={props => <Login {...props} />}
                />
                <Route
                    exact
                    path="/create-account"
                    render={props => <CreateAccountPage {...props} />}
                />
                <Route
                    exact
                    path="/forgot-password"
                    render={props => <ForgotPasswordPage {...props} />}
                />
                <Route
                    exact
                    path="/logout.html"
                    render={props => <Logout {...props} />}
                />
                <Route
                    exact
                    path="/customer/account/createPassword"
                    render={props => (
                        <LazyComponent
                            component={() =>
                                import(/* webpackChunkName: "ResetPassword"*/ '@magento/venia-ui/lib/components/MyAccount/ResetPassword')
                            }
                            {...props}
                        />
                    )}
                />
                <Route
                    exact
                    path="/address-book"
                    render={props => <AddressBookPage {...props} />}
                />
                <Route
                    exact
                    path="/order-history"
                    render={props => <OrderHistoryPage {...props} />}
                />
                <Route 
                    exact
                    path="/order-history/:orderId"
                    render={props => <OrderDetailPage {...props} />}
                />
                <Route
                    exact
                    path="/product-review"
                    render={props => <ProductReviewPage {...props} />}
                />
                <Route
                    exact
                    path="/saved-payments"
                    render={props => (
                        <LazyComponent
                            component={() =>
                                import(/* webpackChunkName: "SavedPaymentsPage"*/ '@magento/venia-ui/lib/components/SavedPaymentsPage')
                            }
                            {...props}
                        />
                    )}
                />
                <Route
                    exact
                    path="/communications"
                    render={props => (
                        <LazyComponent
                            component={() =>
                                import(/* webpackChunkName: "CommunicationsPage"*/ '@magento/venia-ui/lib/components/CommunicationsPage')
                            }
                            {...props}
                        />
                    )}
                />
                <Route
                    exact
                    path="/account-information"
                    render={props => <AccountInformationPage {...props} />}
                />
                <Route
                    exact
                    path="/account-subcriptions"
                    render={props => <AccountSubcriptionPage {...props} />}
                />
                <Route
                    exact
                    path="/wishlist"
                    render={props => <WishlistPage {...props} />}
                />
                <Route
                    exact
                    path="/checkout-success"
                    render={props => <CheckoutSuccess {...props} />}
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
                {HomePage ? (
                    <Route
                        exact
                        path="/"
                        render={props => <HomePage {...props} />}
                    />
                ) : (
                    ''
                )}
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
                        />
                    )}
                />
            </Switch>
        </Suspense>
    );
};

export default Routes;
const availableRoutes = [];
export { availableRoutes };