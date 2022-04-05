import React, { Fragment, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { string } from 'prop-types';
import { useProduct } from '@simicart/siminia/src/simi/talons/ProductFullDetail/useProduct.js';

import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { ProductBuilderFullDetail } from '@simicart/siminia/src/simi/App/core/ProductFullDetail';
import ProductFullDetail from '../../ProductFullDetail';
import { prepareProduct } from 'src/simi/Helper/Product';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';
import ProductShimmer from './product.shimmer';
import DEFAULT_OPERATIONS from './product.gql';

let requestedPbPages = false;
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();
const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;
import Seo from '@simicart/siminia/src/simi/App/core/Seo';

const isMobileSite = window.innerWidth <= 450;
/*
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */

const Product = props => {
    const { __typename: productType, pbFinderProps } = props;
    const talonProps = useProduct({
        operations: DEFAULT_OPERATIONS,
        mapProduct
    });

    const { error, loading, product: originalProduct } = talonProps;
    const { loading: pbLoading, findPage, allPages } = pbFinderProps;
    const product = originalProduct ? prepareProduct(originalProduct) : false;
    useEffect(() => {
        if (!pbLoading && !allPages && !requestedPbPages) {
            requestedPbPages = true;
            findPage();
        }
    }, [pbLoading, allPages]);

    let foudThepage = useMemo(() => {
        if (
            product &&
            allPages &&
            allPages.data &&
            allPages.data.catalog_builder_page &&
            allPages.data.catalog_builder_page.items
        ) {
            let pbPages = JSON.parse(
                JSON.stringify(allPages.data.catalog_builder_page.items)
            );

            pbPages = pbPages.filter((item, itemIndx) => {
                if (storeCode && item.storeview_visibility) {
                    const storeViews = item.storeview_visibility
                        .trim()
                        .split(',');
                    if (!storeViews.includes(storeCode)) return false;
                }
                if (item.apply_to) {
                    let apply_to = item.apply_to.replace(/\s/g, '');
                    apply_to = apply_to.split(',');
                    if (apply_to.length) {
                        item.apply_by = apply_to[0];
                        if (
                            apply_to[0] === 'product_sku' &&
                            apply_to.includes(product.sku) &&
                            product.sku
                        ) {
                            return true;
                        } else if (
                            apply_to[0] === 'product_type' &&
                            apply_to.includes(product.__typename) &&
                            product.__typename
                        ) {
                            return true;
                        } else if (
                            apply_to[0] === 'category_id' &&
                            product.categories &&
                            product.categories.length
                        ) {
                            let matchTheCate = false;
                            product.categories.every(category => {
                                if (
                                    category.id &&
                                    apply_to.includes(String(category.id))
                                ) {
                                    matchTheCate = true;
                                    return false;
                                }
                                return true;
                            });
                            if (matchTheCate) return true;
                        }
                    }
                } else {
                    return true;
                }
                return false;
            });
            pbPages.sort((el1, el2) => {
                if (el1.apply_by) {
                    if (el2.apply_by) {
                        //if equal, then compare priority below
                        if (el2.apply_by !== el1.apply_by) {
                            //if not equal, SKU > product type > category ids
                            const valueTable = {
                                product_sku: 5,
                                product_type: 4,
                                category_id: 3
                            };
                            return (
                                valueTable[el2.apply_by] -
                                valueTable[el1.apply_by]
                            );
                        }
                    } else {
                        //if one has and one does not have apply_by, then use the one with apply_by
                        return -1;
                    }
                } else if (el2.apply_by) {
                    return 1;
                }
                return parseInt(el2.priority) - parseInt(el1.priority);
            });
            if (pbPages.length && pbPages[0]) return pbPages[0];
        }
    }, [allPages, product]);

    //handle when preview - onsite
    let pageMaskedId;
    if (location && location.search) {
        const previewMID = location.search.indexOf('pbPreviewMaskedId=');
        if (previewMID !== -1) {
            pageMaskedId = location.search.substring(previewMID + 18);
            if (foudThepage) foudThepage = false;
        }
    }

    if (pbLoading || !allPages || (loading && !product))
        return <ProductShimmer />;
    if (error && !product) return <ErrorView />;
    if (!product) {
        return (
            <h1>
                <FormattedMessage
                    id={'product.outOfStockTryAgain'}
                    defaultMessage={
                        'This Product is currently out of stock. Please try again later.'
                    }
                />
            </h1>
        );
    }

    return (
        <div style={isMobileSite ? {} : { backgroundColor: 'white' }}>
            <div className={`${!isMobileSite ? 'container' : 'bg-color'} `}>
                <Seo pageType="PRODUCT" />
                <StoreTitle>{product.name}</StoreTitle>
                <Meta name="description" content={product.meta_description} />
                {foudThepage || pageMaskedId ? (
                    <ProductBuilderFullDetail
                        product={product}
                        pageData={foudThepage}
                        maskedId={pageMaskedId}
                    />
                ) : (
                    <ProductFullDetail product={product} />
                )}
            </div>
        </div>
    );
};

Product.propTypes = {
    __typename: string.isRequired
};

export default Product;
