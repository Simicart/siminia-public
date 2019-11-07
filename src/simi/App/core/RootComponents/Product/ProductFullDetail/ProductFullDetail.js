import React, { Component, Suspense } from 'react';
import { arrayOf, bool, number, shape, string, object } from 'prop-types';
import {smoothScrollToView} from 'src/simi/Helper/Behavior'
import Loading from 'src/simi/BaseComponents/Loading'
import { Colorbtn, Whitebtn } from 'src/simi/BaseComponents/Button'
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import ProductImage from './ProductImage';
import Quantity from './ProductQuantity';
import isProductConfigurable from 'src/util/isProductConfigurable';
import Identify from 'src/simi/Helper/Identify';
import TitleHelper from 'src/simi/Helper/TitleHelper'
import {prepareProduct} from 'src/simi/Helper/Product'
import ProductPrice from '../Component/Productprice';
import { addToCart as simiAddToCart } from 'src/simi/Model/Cart';
import { addToWishlist as simiAddToWishlist } from 'src/simi/Model/Wishlist';
import {configColor} from 'src/simi/Config'
import {showToastMessage} from 'src/simi/Helper/Message';
import ReactHTMLParse from 'react-html-parser';
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb"
import { TopReview, ReviewList, NewReview } from './Review/index'
import SocialShare from 'src/simi/BaseComponents/SocialShare';
import Description from './Description';
import Techspec from './Techspec';
import LinkedProduct from './LinkedProduct';

const ConfigurableOptions = React.lazy(() => import('./Options/ConfigurableOptions'));
const CustomOptions = React.lazy(() => import('./Options/CustomOptions'));
const BundleOptions = React.lazy(() => import('./Options/Bundle'));
const GroupedOptions = React.lazy(() => import('./Options/GroupedOptions'));
const DownloadableOptions = React.lazy(() => import('./Options/DownloadableOptions'));

require('./productFullDetail.scss');

class ProductFullDetail extends Component {  
    state = {
        optionCodes: new Map(),
        optionSelections: new Map(),
    };
    quantity = 1
      
    static getDerivedStateFromProps(props, state) {
        const { configurable_options } = props.product;
        const optionCodes = new Map(state.optionCodes);
        // if this is a simple product, do nothing
        if (!isProductConfigurable(props.product) || !configurable_options) {
            return null;
        }
        // otherwise, cache attribute codes to avoid lookup cost later
        for (const option of configurable_options) {
            optionCodes.set(option.attribute_id, option.attribute_code);
        }
        return { optionCodes };
    }

    setQuantity = quantity => this.quantity = quantity;

    prepareParams = () => {
        const { props, state, quantity } = this;
        const { optionSelections } = state;
        const { product } = props;

        const params = {product: String(product.id), qty: quantity?String(quantity):'1'}
        if (this.customOption) {
            const customOptParams = this.customOption.getParams()
            if (customOptParams && customOptParams.options) {
                params['options'] = customOptParams.options
            } else
                this.missingOption = true
        }
        if (this.bundleOption) {
            const bundleOptParams = this.bundleOption.getParams()
            if (bundleOptParams && bundleOptParams.bundle_option_qty && bundleOptParams.bundle_option) {
                params['bundle_option'] = bundleOptParams.bundle_option
                params['bundle_option_qty'] = bundleOptParams.bundle_option_qty
            }
        }
        if (this.groupedOption) {
            const groupedOptionParams = this.groupedOption.getParams()
            if (groupedOptionParams && groupedOptionParams.super_group) {
                params['super_group'] = groupedOptionParams.super_group
            }
        }
        if (this.downloadableOption) {
            const downloadableOption = this.downloadableOption.getParams()
            if (downloadableOption && downloadableOption.links) {
                params['links'] = downloadableOption.links
            } else
                this.missingOption = true
        }
        if (optionSelections && optionSelections.size) { //configurable option
            if (this.isMissingConfigurableOptions) {
                this.missingOption = true
            }
            const super_attribute = {}
            optionSelections.forEach((value, key) => {
                super_attribute[String(key)] = String(value)
            })
            params['super_attribute'] = super_attribute
        }
        return params
    }

    addToCart = () => {
        const { props } = this;
        const {  product } = props;
        if (product && product.id) {
            this.missingOption = false
            const params = this.prepareParams()
            if (this.missingOption) {
                showToastMessage(Identify.__('Please select the options required (*)'));
                return
            }
            showFogLoading()
            simiAddToCart(this.addToCartCallBack, params)
        }
    };

    addToCartCallBack = (data) => {
        hideFogLoading()
        if (data.errors) {
            this.showError(data)
        } else {
            this.showSuccess(data)
            this.props.updateItemInCart()
        }
    }

    addToWishlist = () => {
        const {product, isSignedIn, history} = this.props
        if (!isSignedIn) {
            history.push('/login.html')
        } else if (product && product.id) {
            this.missingOption = false
            const params = this.prepareParams()
            showFogLoading()
            simiAddToWishlist(this.addToWishlistCallBack, params)
        }
    }

    addToWishlistCallBack = (data) => {
        hideFogLoading()
        if (data.errors) {
            this.showError(data)
        } else {
            this.props.toggleMessages([{
                type: 'success',
                message: Identify.__('Product was added to your wishlist'),
                auto_dismiss: true
            }])
        }
    }

    showError(data) {
        if (data.errors.length) {
            const errors = data.errors.map(error => {
                return {
                    type: 'error',
                    message: error.message,
                    auto_dismiss: true
                }
            });
            this.props.toggleMessages(errors)
        }
    }

    showSuccess(data) {
        if (data.message) {
            this.props.toggleMessages([{
                type: 'success',
                message: Array.isArray(data.message)?data.message[0]:data.message,
                auto_dismiss: true
            }])
        }
    }

    handleConfigurableSelectionChange = (optionId, selection) => {
        this.setState(({ optionSelections }) => ({
            optionSelections: new Map(optionSelections).set(
                optionId,
                Array.from(selection).pop()
            )
        }));
    };

    get isMissingConfigurableOptions() {
        const { product } = this.props;
        const { configurable_options } = product;
        const numProductOptions = configurable_options.length;
        const numProductSelections = this.state.optionSelections.size;
        return numProductSelections < numProductOptions;
    }

    get fallback() {
        return <Loading />;
    }

    get productOptions() {
        const { fallback, handleConfigurableSelectionChange, props } = this;
        const { configurable_options, simiExtraField, type_id, is_dummy_data } = props.product;
        const isConfigurable = isProductConfigurable(props.product);
        if (is_dummy_data)
            return <Loading />
        return (
            <Suspense fallback={fallback}>
                {
                    isConfigurable &&
                    <ConfigurableOptions
                        options={configurable_options}
                        onSelectionChange={handleConfigurableSelectionChange}
                    />
                }
                {
                    type_id === 'bundle' &&
                    <BundleOptions 
                        key={Identify.randomString(5)}
                        app_options={simiExtraField.app_options}
                        product_id={this.props.product.entity_id}
                        ref={e => this.bundleOption = e}
                        parent={this}
                    />
                }
                {
                    type_id === 'grouped' &&
                    <GroupedOptions 
                        key={Identify.randomString(5)}
                        app_options={props.product.items?props.product.items:[]}
                        product_id={this.props.product.entity_id}
                        ref={e => this.groupedOption = e}
                        parent={this}
                    />
                }
                {
                    type_id === 'downloadable' &&
                    <DownloadableOptions 
                        key={Identify.randomString(5)}
                        app_options={simiExtraField.app_options}
                        product_id={this.props.product.entity_id}
                        ref={e => this.downloadableOption = e}
                        parent={this}
                    />
                }
                {
                    ( simiExtraField && simiExtraField.app_options && simiExtraField.app_options.custom_options) &&
                    <CustomOptions 
                        key={Identify.randomString(5)}
                        app_options={simiExtraField.app_options}
                        product_id={this.props.product.entity_id}
                        ref={e => this.customOption = e}
                        parent={this}
                    />
                }
            </Suspense>
        );
    }

    breadcrumb = (product) => {
        return <BreadCrumb breadcrumb={[{name:'Home',link:'/'},{name:product.name}]} history={this.props.history}/>
    }
    
    render() {
        hideFogLoading()
        const { addToCart, productOptions, props, state, addToWishlist } = this;
        const { optionCodes, optionSelections, } = state
        const product = prepareProduct(props.product)
        const { type_id, name, simiExtraField } = product;
        const short_desc = (product.short_description && product.short_description.html)?product.short_description.html:''
        const hasReview = simiExtraField && simiExtraField.app_reviews && simiExtraField.app_reviews.number
        return (
            <div className="container product-detail-root">
                {this.breadcrumb(product)}
                {TitleHelper.renderMetaHeader({
                    title: product.meta_title?product.meta_title:product.name?product.name:'',
                    desc: product.meta_description?product.meta_description:product.description?product.description:''
                })}
                <div className="title">
                    <h1 className="product-name">
                        <span>{ReactHTMLParse(name)}</span>
                    </h1>
                </div>
                <div className="image-carousel">
                    <ProductImage 
                        optionCodes={optionCodes}
                        optionSelections={optionSelections}
                        product={product}
                    />
                </div>
                <div className="main-actions">
                    {hasReview ? <div className="top-review"><TopReview app_reviews={product.simiExtraField.app_reviews}/></div> : ''}
                    <div role="presentation" className="review-btn" onClick={()=>smoothScrollToView($('#product-detail-new-review'))}>
                        {hasReview ? Identify.__('Submit Review') : Identify.__('Be the first to review this product')}
                    </div>
                    <div className="product-price">
                        <ProductPrice ref={(price) => this.Price = price} data={product} configurableOptionSelection={optionSelections}/>
                    </div>
                    <div className="product-short-desc">{ReactHTMLParse(short_desc)}</div>
                    <div className="options">{productOptions}</div>
                    <div className="cart-actions">
                        {
                            type_id !== 'grouped' &&
                            <Quantity
                                initialValue={this.quantity}
                                onValueChange={this.setQuantity}
                            />
                        }
                        <div 
                            className="add-to-cart-ctn" 
                            style={{
                                borderColor:  configColor.button_background, borderWidth: '1px', borderStyle: 'solid'
                            }}>
                            <Colorbtn 
                                style={{backgroundColor: configColor.button_background, color: configColor.button_text_color}}
                                className="add-to-cart-btn"
                                onClick={addToCart}
                                text={Identify.__('Add to Cart')}/>
                        </div>
                    </div>
                    <div className="wishlist-actions">
                        <Whitebtn 
                            className="add-to-wishlist-btn"
                            onClick={addToWishlist}
                            text={Identify.__('Add to Favourites')}/>
                    </div>
                    <div className="social-share"><SocialShare id={product.id} className="social-share-item" /></div>
                </div>
                {product.description && <div className="description"><Description product={product}/></div>}
                {(simiExtraField && simiExtraField.additional && simiExtraField.additional.length) ?
                    <div className="techspec"><Techspec product={product}/></div> : ''}
                <div className="review-list"><ReviewList product_id={product.id}/></div>
                <div className="new-review" id="product-detail-new-review">
                    <NewReview product={product} toggleMessages={this.props.toggleMessages}/>
                </div>
                <LinkedProduct product={product} link_type="related" history={this.props.history}/>
                <LinkedProduct product={product} link_type="crosssell" history={this.props.history}/>
            </div>
        );
    }
}

ProductFullDetail.propTypes = {
    product: shape({
        __typename: string,
        id: number,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: object
    }).isRequired
};

export default ProductFullDetail;