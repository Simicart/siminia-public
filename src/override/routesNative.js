import React, { Suspense } from 'react';
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent';
import { Route, Switch, useLocation, useParams } from 'react-router-dom';
//import MagentoRoute from '@magento/venia-ui/lib/components/MagentoRoute';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import NoMatch, { endPoint } from '../simi/App/nativeInner/NoMatch';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import Loader from '../simi/App/nativeInner/Loader'
import PageBuilderComponent from '../simi/App/core/TapitaPageBuilder/PageBuilderComponent';
//import Login from 'src/simi/App/core/Customer/Login';
const Login = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "Login"*/ 'src/simi/App/nativeInner/Customer/Login')
            }
            {...props}
        />
    );
};
//import CreateAccountPage from '@magento/venia-ui/lib/components/CreateAccountPage';
const CreateAccountPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "CreateAccountPage"*/ 'src/simi/App/nativeInner/Customer/CreateAccountPage')
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
                import(/* webpackChunkName: "ForgotPasswordPage"*/ 'src/simi/App/nativeInner/Customer/ForgotPasswordPage')
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
                import(/* webpackChunkName: "OrderHistoryPage"*/ 'src/simi/App/nativeInner/OrderHistoryPage')
            }
            {...props}
        />
    );
};

const AccountSettingPage = props => {
    return (
        <LazyComponent
            component={() =>
                import( 'src/simi/App/nativeInner/AccountSettingPage')
            }
            {...props}
        />
    );
};

const OrderDetailPage = props => {
    return (
        <LazyComponent
            component={() => import('src/simi/App/nativeInner/OrderDetailPage')}
            {...props}
        />
    );
};
const RewardPointsPage = props => {
    return (
        <LazyComponent
            component={() =>
                import('src/simi/App/nativeInner/RewardPoint/RewardPointDataPage')
            }
            {...props}
        />
    );
};
const RewardTransactions = props => {
    return (
        <LazyComponent
            component={() =>
                import('src/simi/App/nativeInner/RewardPoint/RewardTransactions')
            }
            {...props}
        />
    );
};
//import MyAccountPage from '@magento/venia-ui/lib/components/AccountInformationPage';
const MyAccountPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "AccountInformationPage"*/ '/src/simi/App/nativeInner/MyAccountPage')
            }
            {...props}
        />
    );
};

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
                import(/* webpackChunkName: "AccountSubcriptionPage"*/ '/src/simi/App/nativeInner/AccountSubcriptionPage')
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
                import(/* webpackChunkName: "AddressBookPage"*/ '/src/simi/App/nativeInner/AddressBookPage')
            }
            {...props}
        />
    );
};
const AddNewAddress = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "AddressBookPage"*/ '/src/simi/App/nativeInner/AddressBookPage/AddNewAddress')
            }
            {...props}
        />
    );
};
const ProductReviewPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "ProductReviewPage"*/ '/src/simi/App/nativeInner/ProductReviewPage')
            }
            {...props}
        />
    );
};
const ProductAlertPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "ProductReviewPage"*/ '/src/simi/App/nativeInner/ProductAlertPage/ProductAlertPage.js')
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
                import(/* webpackChunkName: "WishlistPage"*/ '/src/simi/App/nativeInner/WishlistPage')
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
                import(/* webpackChunkName: "Checkout"*/ 'src/simi/App/nativeInner/Checkout')
            }
            {...props}
        />
    );
};

const BasicSearch = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BasicSearch"*/ 'src/simi/App/nativeInner/RootComponents/Search')
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
                import(/* webpackChunkName: "CheckoutSuccess"*/ 'src/simi/App/nativeInner/CheckoutSuccess')
            }
            {...props}
        />
    );
};

const CheckoutFailure = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "CheckoutFailure"*/ 'src/simi/App/core/CheckoutFailure')
            }
            {...props}
        />
    );
};

const ContactPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "ContactPage"*/ 'src/simi/App/core/ContactPage')
            }
            {...props}
        />
    );
};
const CommunicationsPage = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "CommunicationsPage"*/ '/src/simi/App/core/CommunicationsPage')
            }
            {...props}
        />
    );
};

const Brands = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "Brands"*/ 'src/simi/App/nativeInner/ShopByBrand/components/brands')
            }
            {...props}
        />
    );
};

const BrandDetails = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BrandDetails"*/ 'src/simi/App/nativeInner/ShopByBrand/components/branddetails/index.js')
            }
            {...props}
        />
    );
};

const BrandCategory = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BrandCategory"*/ 'src/simi/App/nativeInner/ShopByBrand/components/category/index.js')
            }
            {...props}
        />
    );
};
const CategoryList = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "CategoryList"*/ 'src/simi/App/nativeInner/CategoryList/index.js')
            }
            {...props}
        />
    );
};
const MyGiftCard = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "CategoryList"*/ 'src/simi/App/nativeInner/GiftCard/components/GiftCardDashboard')
            }
            {...props}
        />
    );
};

const Faq = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "HomePage"*/ 'src/simi/App/nativeInner/Faq/HomePage')
            }
            {...props}
        />
    );
};
const FaqCategory = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "FaqCategory"*/ 'src/simi/App/nativeInner/Faq/Category')
            }
            {...props}
        />
    );
};
const Article = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "Article"*/ 'src/simi/App/nativeInner/Faq/Article')
            }
            {...props}
        />
    );
};
const BlogHome = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BlogHome"*/ 'src/simi/App/nativeInner/Blog/home')
            }
            {...props}
        />
    );
};
const BlogCategory = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BlogCategory"*/ 'src/simi/App/nativeInner/Blog/category')
            }
            {...props}
        />
    );
};
const BlogPost = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BlogPost"*/ 'src/simi/App/nativeInner/Blog/post/index.js')
            }
            {...props}
        />
    );
};
const BlogTag = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BlogTag"*/ 'src/simi/App/nativeInner/Blog/tag/index.js')
            }
            {...props}
        />
    );
};
const BlogTopic = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BlogTopic"*/ 'src/simi/App/nativeInner/Blog/topic/index.js')
            }
            {...props}
        />
    );
};
const BlogArchive = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BlogArchive"*/ 'src/simi/App/nativeInner/Blog/month/index.js')
            }
            {...props}
        />
    );
};
const BlogAuthor = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "BlogAuthor"*/ 'src/simi/App/nativeInner/Blog/author/index.js')
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
        <Suspense fallback={<Loader />}>
            <Switch>
                {/*
                 * Client-side routes are injected by BabelRouteInjectionPlugin here.
                 * Siminia's are defined in packages/siminia/src/targets/siminia-intercept.js
                 */}
                <Route
                    exact
                    path="/pbpreview/:pbMaskedId"
                    render={props => (
                        <div className="pagebuilder-component-ctn">
                            <PageBuilderComponent
                                key="pb-preview"
                                endPoint={endPoint}
                                maskedId={
                                    props.match && props.match.params.pbMaskedId
                                        ? props.match.params.pbMaskedId
                                        : ''
                                }
                                toPreview={true}
                            />
                        </div>
                    )}
                />
                <Route
                    exact
                    path="/categories"
                    render={props => <CategoryList {...props} />}
                />
                <Route
                    exact
                    path="/search.html"
                    render={props => <Search key="search_page" {...props} />}
                />
                <Route
                    exact
                    path="/contact.html"
                    render={props => <ContactPage {...props} />}
                />
                <Route
                    exact
                    path="/cart"
                    render={props => (
                        <LazyComponent
                            component={() =>
                                import(/* webpackChunkName: "Cart"*/ 'src/simi/App/nativeInner/Cart')
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
                    path="/brands.html"
                    render={props => <Brands {...props} />}
                />
                <Route
                    exact
                    path="/brands/category/:categoryUrl?"
                    render={props => <BrandCategory {...props} />}
                />
                <Route
                    exact
                    path="/brands/:brandUrl?"
                    render={props => <BrandDetails {...props} />}
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
                    path="/blog.html"
                    render={props => <BlogHome {...props} />}
                />
                <Route
                    exact
                    path="/blog/category/:categoryUrl?"
                    render={props => <BlogCategory {...props} />}
                />
                <Route
                    exact
                    path="/blog/post/:postUrl?"
                    render={props => <BlogPost {...props} />}
                />
                <Route
                    exact
                    path="/blog/tag/:tagUrl?"
                    render={props => <BlogTag {...props} />}
                />
                <Route
                    exact
                    path="/blog/topic/:topicUrl?"
                    render={props => <BlogTopic {...props} />}
                />
                <Route
                    exact
                    path="/blog/month/:monthUrl?"
                    render={props => <BlogArchive {...props} />}
                />
                <Route
                    exact
                    path="/blog/author/:authorUrl?"
                    render={props => <BlogAuthor {...props} />}
                />
                <Route
                    exact
                    path="/faq.html"
                    render={props => <Faq {...props} />}
                />
                <Route
                    exact
                    path="/faq/category/:categoryUrl?"
                    render={props => <FaqCategory {...props} />}
                />
                <Route
                    exact
                    path="/faq/article/:articleUrl?"
                    render={props => <Article {...props} />}
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
                    path="/new-address"
                    render={props => <AddNewAddress {...props} />}
                />
                <Route
                    exact
                    path="/order-history"
                    render={props => <OrderHistoryPage {...props} />}
                />
                <Route
                    exact
                    path="/account-setting"
                    render={props => <AccountSettingPage {...props} />}
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
                    path="/product-alert"
                    render={props => <ProductAlertPage {...props} />}
                />
                <Route
                    exact
                    path="/saved-payments"
                    render={props => (
                        <LazyComponent
                            component={() =>
                                import(/* webpackChunkName: "SavedPaymentsPage"*/ 'src/simi/App/nativeInner/SavedPaymentsPage/index.js')
                            }
                            {...props}
                        />
                    )}
                />
                <Route
                    exact
                    path="/reward-points"
                    render={props => <RewardPointsPage {...props} />}
                />
                <Route
                    exact
                    path="/reward-transactions"
                    render={props => <RewardTransactions {...props} />}
                />
                <Route
                    exact
                    path="/my-gift-cards"
                    render={props => <MyGiftCard {...props} />}
                />
                
                <Route
                    exact
                    path="/communications"
                    render={props => <CommunicationsPage {...props} />}
                />
                <Route
                    exact
                    path="/account-information"
                    render={props => <AccountInformationPage {...props} />}
                />
                <Route
                    exact
                    path="/my-account"
                    render={props => <MyAccountPage {...props} />}
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
                    path="/checkout/onepage/success"
                    render={props => <CheckoutSuccess {...props} />}
                />
                <Route
                    exact
                    path="/checkout/onepage/error"
                    render={props => <CheckoutFailure {...props} />}
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
                        <div style={{ minHeight: '100vh' }}>
                            <NoMatch {...props} />
                        </div>
                    )}
                />
            </Switch>
        </Suspense>
    );
};

export default Routes;
const availableRoutes = [];
export { availableRoutes };
