import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
// import {isSupportedProductType as isSupported} from '@magento/peregrine/lib/util/isSupportedProductType';
import { isSupportedProductType as isSupported } from '../../../../util/isSupportedProductType';

import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '../../../talons/ProductFullDetail/productFullDetail.gql';
import { formatCustomOptions } from '../../core/SimiProductOptions/CustomOption/utils/formatCustomOptions';
import { mergeCustomOption } from '../../core/SimiProductOptions/CustomOption/utils/mergeCustomOption';
import { useSubOptions } from '../../../talons/ProductFullDetail/useSubOptions';
import { isDownloadableLinkRequired } from '../../core/SimiProductOptions/DownloadOption/utils/isDownloadableLinkRequired';

import { GET_PRODUCT_UPSELL_CROSSSELL_QUERY } from '../../../talons/ProductFullDetail/upsellAndCrossell.gql';
import {
    getDisplayPrice,
    getFromToBundlePrice
} from '../../../talons/ProductFullDetail/getDisplayPrice';
import { GET_RELATED_PRODUCT_QUERY } from '../../../talons/ProductFullDetail/relatedProduct.gql';

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();
const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    for (const {
        attribute_id,
        attribute_code
    } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    for (const { attribute_id } of product.configurable_options) {
        initialOptionSelections.set(attribute_id, undefined);
    }

    return initialOptionSelections;
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options.length;
    const numProductSelections = Array.from(optionSelections.values()).filter(
        value => !!value
    ).length;

    return numProductSelections < numProductOptions;
};

const getIsOutOfStock = (product, optionCodes, optionSelections) => {
    const { stock_status, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (isConfigurable && optionsSelected) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        return item.product.stock_status === OUT_OF_STOCK_CODE;
    }
    return stock_status === OUT_OF_STOCK_CODE;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable || !optionsSelected) {
        value = media_gallery_entries;
    } else {
        // If any of the possible variants matches the selection add that
        // variant's image to the media gallery. NOTE: This _can_, and does,
        // include variants such as size. If Magento is configured to display
        // an image for a size attribute, it will render that image.
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item
            ? [...item.product.media_gallery_entries, ...media_gallery_entries]
            : media_gallery_entries;
    }

    return value;
};

// We only want to display breadcrumbs for one category on a PDP even if a
// product has multiple related categories. This function filters and selects
// one category id for that purpose.
const getBreadcrumbCategoryId = categories => {
    // Exit if there are no categories for this product.
    if (!categories || !categories.length) {
        return;
    }
    const breadcrumbSet = new Set();
    categories.forEach(({ breadcrumbs }) => {
        // breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_id }) =>
            breadcrumbSet.add(category_id)
        );
    });

    // Until we can get the single canonical breadcrumb path to a product we
    // will just return the first category id of the potential leaf categories.
    const leafCategory = categories.find(
        category => !breadcrumbSet.has(category.id)
    );

    // If we couldn't find a leaf category then just use the first category
    // in the list for this product.
    return leafCategory.id || categories[0].id;
};

/**
 * @param {GraphQLDocument} props.addConfigurableProductToCartMutation - configurable product mutation
 * @param {GraphQLDocument} props.addSimpleProductToCartMutation - configurable product mutation
 * @param {Object.<string, GraphQLDocument>} props.operations - collection of operation overrides merged into defaults
 * @param {Object} props.product - the product, see RootComponents/Product
 *
 * @returns {{
 *  breadcrumbCategoryId: string|undefined,
 *  errorMessage: string|undefined,
 *  handleAddToCart: func,
 *  handleSelectionChange: func,
 *  handleSetQuantity: func,
 *  isAddToCartDisabled: boolean,
 *  isSupportedProductType: boolean,
 *  mediaGalleryEntries: array,
 *  productDetails: object,
 *  quantity: number
 * }}
 */
export const useProductFullDetail = props => {
    const {
        addConfigurableProductToCartMutation,
        addSimpleProductToCartMutation,
        product,
        noRelatedQuery
    } = props;

    const hasDeprecatedOperationProp = !!(
        addConfigurableProductToCartMutation || addSimpleProductToCartMutation
    );

    const operations = mergeOperations(defaultOperations, props.operations);
    const [alertMsg, setAlertMsg] = useState(-1);
    const [updatePrice, setUpdatePrice] = useState(null);

    const productType = product.__typename;

    const isSupportedProductType =
        isSupported(productType) || productType === 'DownloadableProduct';

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();
    // const { formatMessage } = useIntl();

    const { data: storeConfigData } = useQuery(
        operations.getWishlistConfigQuery,
        {
            fetchPolicy: 'cache-first'
        }
    );

    const [
        addBundleProductToCart,
        { error: errorAddingBundleProduct, loading: isAddBundleLoading }
    ] = useMutation(operations.addBundleProductToCartMutation);

    const [
        addDownloadableProductToCart,
        {
            error: errorAddingDownloadableProduct,
            loading: isAddDownloadableLoading
        }
    ] = useMutation(operations.addDownloadableProductToCartMutation);

    const [
        addProductToCart,
        {
            error: errorAddingProductToCart,
            loading: isAddProductLoading,
            data: dataAddingProductToCart,
            // called: calledAddingProductToCart
        }
    ] = useMutation(operations.addProductToCartMutation);
    
    const urlKey = product.url_key;

    // have to query separately because query depth exceed in original query
    const { data: upsellCrosssellData } = useQuery(
        GET_PRODUCT_UPSELL_CROSSSELL_QUERY,
        {
            variables: {
                urlKey: urlKey
            },
            skip: noRelatedQuery === true
        }
    );

    const upsellProducts =
        upsellCrosssellData && upsellCrosssellData.products.items.length > 0
            ? upsellCrosssellData.products.items[0].upsell_products
            : [];
    const crosssellProducts =
        upsellCrosssellData && upsellCrosssellData.products.items.length > 0
            ? upsellCrosssellData.products.items[0].crosssell_products
            : [];

    const { data: relatedProductData } = useQuery(GET_RELATED_PRODUCT_QUERY, {
        variables: {
            urlKey: urlKey
        },
        skip: noRelatedQuery === true
    });

    const relatedProducts =
        relatedProductData && relatedProductData.products.items.length > 0
            ? relatedProductData.products.items[0].related_products
            : [];

    const breadcrumbCategoryId = useMemo(
        () => getBreadcrumbCategoryId(product.categories),
        [product.categories]
    );

    const derivedOptionSelections = useMemo(
        () => deriveOptionSelectionsFromProduct(product),
        [product]
    );

    const [optionSelections, setOptionSelections] = useState(
        derivedOptionSelections
    );

    const {
        options: customOptions,
        getCurrentValue: getCurrentCustomValue,
        handleOptionsChange: handleCustomOptionsChange
    } = useSubOptions();

    const fCus = useMemo(() => formatCustomOptions(customOptions), [
        customOptions
    ]);

    const isAllRequiredCustomFieldFilled = useMemo(() => {
        const requiredCustomOption = (product.options || []).filter(
            x => x.required
        );
        const requiredOptionUid = requiredCustomOption.map(
            option => option.uid
        );
        return requiredOptionUid.reduce((acc, uid) => {
            return acc && !!customOptions[uid];
        }, true);
        // return fCus.length >= requiredCustomOptionLength;
    }, [product.options, customOptions]);

    const [groupedOptions, setGroupedOptions] = useState({});

    const handleGroupedOptionsChange = (id, qty) => {
        const quantity = Number(qty);
        setGroupedOptions(prevState => {
            prevState[id] = [quantity];
            return { ...prevState };
        });
    };

    const fGroup = useMemo(() => formatCustomOptions(groupedOptions), [
        groupedOptions
    ]);

    const bundleQty = {};
    if (product && product.items) {
        product.items.map(item => {
            const key = item.option_id;
            bundleQty[key] = '1';
        });
    }

    const originalBundleOptions = {
        quantity: bundleQty,
        option_value: {}
    };

    const [bundleOptions, setBundleOptions] = useState(originalBundleOptions);

    const fBundleOption = useMemo(() => bundleOptions.option_value, [
        bundleOptions
    ]);

    const getCurrentBundleValue = keyId => valueId =>
        (bundleOptions.option_value[keyId] || []).includes(valueId);

    const handleBundleChangeQty = (id, qty) => {
        const quantity = Number(qty);
        setBundleOptions(prevState => {
            prevState.quantity[id] = String(quantity);
            return { ...prevState };
        });
    };

    const handleBundleChangeOptions = (id, value, isMultiple = false) => {
        setBundleOptions(prevState => {
            const chosenArr = prevState.option_value[id];
            if (!chosenArr || chosenArr.length === 0) {
                prevState.option_value[id] = [value];
            } else {
                const chosen = chosenArr.includes(value);
                if (chosen) {
                    if (isMultiple) {
                        prevState.option_value[id] =
                            chosenArr.length > 1
                                ? chosenArr.filter(x => x !== value)
                                : null;
                    } else {
                        prevState.option_value[id] = null;
                    }
                } else {
                    if (isMultiple) {
                        prevState.option_value[id] = chosenArr.concat(value);
                    } else {
                        if (value) {
                            prevState.option_value[id] = [value];
                        } else {
                            prevState.option_value[id] = null;
                        }
                    }
                }
            }
            return { ...prevState };
        });
    };

    const resetBundleOption = () => setBundleOptions(originalBundleOptions);

    const {
        options: downloadableOptions,
        getCurrentValue: getCurrentDownloadableValue,
        handleOptionsChange: handleDownloadableOptionsChange
    } = useSubOptions();

    const selectedDownloadLink = useMemo(() => {
        return Object.values(downloadableOptions)
            .filter(x => !!x)
            .reduce((acc, cur) => acc.concat(cur), []);
    }, [downloadableOptions]);

    const isAllRequiredDownloadableFieldFilled = isDownloadableLinkRequired(
        product
    )
        ? selectedDownloadLink.length > 0 // at least 1 entry is filled
        : true;

    const derivedOptionCodes = useMemo(
        () => deriveOptionCodesFromProduct(product),
        [product]
    );
    const [optionCodes] = useState(derivedOptionCodes);

    const isMissingOptions = useMemo(
        () => getIsMissingOptions(product, optionSelections),
        [product, optionSelections]
    );

    const isOutOfStock = useMemo(
        () => getIsOutOfStock(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const mediaGalleryEntries = useMemo(
        () => getMediaGalleryEntries(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    // The map of ids to values (and their uids)
    // For example:
    // { "179" => [{ uid: "abc", value_index: 1 }, { uid: "def", value_index: 2 }]}
    const attributeIdToValuesMap = useMemo(() => {
        const map = new Map();
        // For simple items, this will be an empty map.
        const options = product.configurable_options || [];
        for (const { attribute_id, values } of options) {
            map.set(attribute_id, values);
        }
        return map;
    }, [product.configurable_options]);

    // An array of selected option uids. Useful for passing to mutations.
    // For example:
    // ["abc", "def"]
    const selectedOptionsArray = useMemo(() => {
        const selectedOptions = [];

        optionSelections.forEach((value, key) => {
            const values = attributeIdToValuesMap.get(key);

            const selectedValue = values.find(
                item => item.value_index === value
            );

            if (selectedValue) {
                selectedOptions.push(selectedValue.uid);
            }
        });
        return selectedOptions;
    }, [attributeIdToValuesMap, optionSelections]);

    const handleAddToCart = useCallback(
        async formValues => {
            const { quantity } = formValues;
            /*
                @deprecated in favor of general addProductsToCart mutation. Will support until the next MAJOR.
             */
            if (hasDeprecatedOperationProp) {
                /* no deprecated operation supported anymore */
                console.error('Unsupported product type. Cannot add to cart.');
            } else {
                const _variables = {
                    cartId,
                    product: {
                        sku: product.sku,
                        quantity
                    },
                    entered_options: [
                        {
                            uid: product.uid,
                            value: product.name
                        }
                    ]
                };

                const variables = isAllRequiredCustomFieldFilled
                    ? mergeCustomOption(_variables, fCus)
                    : _variables;

                if (selectedOptionsArray.length) {
                    variables.product.selected_options = selectedOptionsArray;
                }
                if (productType === 'DownloadableProduct') {
                    // downloadable graph is different, so we need to modify variables shape
                    const downloadableVariable = {
                        ...variables,
                        product: {
                            data: {
                                ..._variables.product
                            },
                            downloadable_product_links: selectedDownloadLink.map(
                                id => ({
                                    link_id: id
                                })
                            )
                        }
                    };

                    try {
                        await addDownloadableProductToCart({
                            variables: downloadableVariable
                        });
                        setAlertMsg(true);
                    } catch (e) {
                        console.warn(e);
                    }
                } else if (product.items && productType === 'BundleProduct') {
                    const params = {
                        product: String(product.id),
                        qty: quantity ? String(quantity) : '1'
                    };

                    const bundleOption = {
                        bundle_option: fBundleOption,
                        bundle_option_qty: bundleOptions.quantity
                    };
                    if (
                        bundleOption &&
                        bundleOption.bundle_option &&
                        bundleOption.bundle_option_qty
                    ) {
                        params['bundle_option'] = bundleOption.bundle_option;
                        params['bundle_option_qty'] =
                            bundleOption.bundle_option_qty;
                    }
                    let variableParams = {
                        cartId,
                        quantity: Number(params.qty),
                        sku: product.sku
                    };
                    const opts = [];
                    const { bundle_option, bundle_option_qty } = params;
                    for (const i in bundle_option) {
                        const bundleValue =
                            bundle_option[i] instanceof Array
                                ? bundle_option[i]
                                : [String(bundle_option[i])];
                        const objOpt = {
                            id: Number(i),
                            quantity: Number(bundle_option_qty[i]),
                            value: bundleValue
                        };
                        opts.push(objOpt);
                    }
                    variableParams = {
                        cartId,
                        quantity: params.qty,
                        sku: product.sku,
                        bundleOptions: opts
                    };
                    await addBundleProductToCart({
                        variables: variableParams
                    });
                    setAlertMsg(true);
                } else if (product.items && productType === 'GroupedProduct') {
                    const { items } = product;
                    variables.product = [];
                    for (const i of items) {
                        const { product, qty } = i;
                        const { sku, id } = product;
                        const val = fGroup.filter(i => i.uid == id);
                        const value = val[0] ? Number(val[0].value) : qty;
                        variables.product.push({
                            quantity: value,
                            sku: sku
                        });
                    }
                    // const data = await addProductToCart({ variables });

                    return;
                } else {
                    variables.product = [variables.product];
                    try {
                        const { data } = await addProductToCart({ variables });
                        if (
                            !(
                                data &&
                                data.addProductsToCart &&
                                data.addProductsToCart.user_errors &&
                                Array.isArray(
                                    data.addProductsToCart.user_errors
                                ) &&
                                data.addProductsToCart.user_errors.length > 0
                            )
                        ) {
                            setAlertMsg(true);
                        }
                    } catch {
                        return;
                    }
                }
            }
        },
        [
            addProductToCart,
            addBundleProductToCart,
            addDownloadableProductToCart,
            cartId,
            hasDeprecatedOperationProp,
            product,
            productType,
            selectedOptionsArray,
            selectedDownloadLink,
            fCus,
            fGroup,
            isAllRequiredCustomFieldFilled,
            fBundleOption,
            bundleOptions
        ]
    );

    const goToCartPage = () => {
        window.location.pathname = '/cart';
    };

    const handleBuyNow = useCallback(
        async formValues => {
            const { quantity } = formValues;

            /*
                @deprecated in favor of general addProductsToCart mutation. Will support until the next MAJOR.
             */
            if (hasDeprecatedOperationProp) {
                /* no deprecated operation supported anymore */
                console.error('Unsupported product type. Cannot add to cart.');
            } else {
                const _variables = {
                    cartId,
                    product: {
                        sku: product.sku,
                        quantity
                    },
                    entered_options: [
                        {
                            uid: product.uid,
                            value: product.name
                        }
                    ]
                };

                const variables = isAllRequiredCustomFieldFilled
                    ? mergeCustomOption(_variables, fCus)
                    : _variables;

                if (selectedOptionsArray.length) {
                    variables.product.selected_options = selectedOptionsArray;
                }
                if (productType === 'DownloadableProduct') {
                    // downloadable graph is different, so we need to modify variables shape
                    const downloadableVariable = {
                        ...variables,
                        product: {
                            data: {
                                ..._variables.product
                            },
                            downloadable_product_links: selectedDownloadLink.map(
                                id => ({
                                    link_id: id
                                })
                            )
                        }
                    };

                    try {
                        await addDownloadableProductToCart({
                            variables: downloadableVariable
                        });
                        goToCartPage();
                    } catch (e) {
                        console.warn(e);
                    }
                } else if (product.items && productType === 'BundleProduct') {
                    const params = {
                        product: String(product.id),
                        qty: quantity ? String(quantity) : '1'
                    };

                    const bundleOption = {
                        bundle_option: fBundleOption,
                        bundle_option_qty: bundleOptions.quantity
                    };
                    if (
                        bundleOption &&
                        bundleOption.bundle_option &&
                        bundleOption.bundle_option_qty
                    ) {
                        params['bundle_option'] = bundleOption.bundle_option;
                        params['bundle_option_qty'] =
                            bundleOption.bundle_option_qty;
                    }
                    let variableParams = {
                        cartId,
                        quantity: Number(params.qty),
                        sku: product.sku
                    };
                    const opts = [];
                    const { bundle_option, bundle_option_qty } = params;
                    for (const i in bundle_option) {
                        const bundleValue =
                            bundle_option[i] instanceof Array
                                ? bundle_option[i]
                                : [String(bundle_option[i])];
                        const objOpt = {
                            id: Number(i),
                            quantity: Number(bundle_option_qty[i]),
                            value: bundleValue
                        };
                        opts.push(objOpt);
                    }
                    variableParams = {
                        cartId,
                        quantity: params.qty,
                        sku: product.sku,
                        bundleOptions: opts
                    };
                    await addBundleProductToCart({
                        variables: variableParams
                    });
                    goToCartPage();
                } else if (product.items && productType === 'GroupedProduct') {
                    const { items } = product;
                    variables.product = [];
                    for (const i of items) {
                        const { product, qty } = i;
                        const { sku, id } = product;
                        const val = fGroup.filter(i => i.uid == id);
                        const value = val[0] ? Number(val[0].value) : qty;
                        variables.product.push({
                            quantity: value,
                            sku: sku
                        });
                    }
                    await addProductToCart({ variables });
                    goToCartPage();
                    return;
                } else {
                    variables.product = [variables.product];
                    try {
                        const { data } = await addProductToCart({ variables });
                        if (
                            !(
                                data &&
                                data.addProductsToCart &&
                                data.addProductsToCart.user_errors &&
                                Array.isArray(
                                    data.addProductsToCart.user_errors
                                ) &&
                                data.addProductsToCart.user_errors.length > 0
                            )
                        ) {
                            goToCartPage();
                        }
                   
                    } catch {
                        return;
                    }
                }
            }
        },
        [
            addProductToCart,
            addBundleProductToCart,
            addDownloadableProductToCart,
            cartId,
            hasDeprecatedOperationProp,
            product,
            productType,
            selectedOptionsArray,
            selectedDownloadLink,
            fCus,
            fGroup,
            isAllRequiredCustomFieldFilled,
            fBundleOption,
            bundleOptions
        ]
    );

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
        },
        [optionSelections]
    );

    const handleUpdateQuantity = useCallback(
        quantity => {
            const { price_tiers } = product;
            if (
                productType !== 'ConfigurableProduct' &&
                price_tiers &&
                Array.isArray(price_tiers) &&
                price_tiers.length > 0
            ) {
                const findPriceTier = price_tiers.find(priceTier => {
                    if (
                        priceTier.quantity &&
                        priceTier.quantity >= parseInt(quantity)
                    ) {
                        return true;
                    }

                    return false;
                });

                if (
                    findPriceTier &&
                    findPriceTier.final_price &&
                    findPriceTier.final_price.value
                ) {
                    setUpdatePrice(findPriceTier.final_price);
                } else {
                    setUpdatePrice(null);
                }
            }
        },
        [product, productType]
    );

    // original price + price of options
    const extraPrice = useMemo(
        () =>
            getDisplayPrice({
                product,
                optionCodes,
                optionSelections,
                customOptions,
                bundleOptions,
                downloadableOptions,
                groupedOptions
            }),
        [
            product,
            optionCodes,
            optionSelections,
            customOptions,
            bundleOptions,
            downloadableOptions,
            groupedOptions
        ]
    );

    const productPrice =
        productType === 'BundleProduct'
            ? getFromToBundlePrice({ product })
            : updatePrice
            ? updatePrice
            : extraPrice;

    const switchExtraPriceForNormalPrice = [
        'DownloadableProduct',
        'GroupedProduct'
    ].includes(productType);

    // Normalization object for product details we need for rendering.
    const productDetails = {
        description: product.description,
        name: product.name,
        price: productPrice,
        sku: product.sku
    };

    const derivedErrorMessage = useMemo(
        () =>
            deriveErrorMessage([
                errorAddingProductToCart,
                errorAddingDownloadableProduct,
                errorAddingBundleProduct
            ]),
        [
            errorAddingProductToCart,
            errorAddingBundleProduct,
            errorAddingDownloadableProduct
        ]
    );

    const userErrorsMessage = useMemo(() => {
        const { addProductsToCart } = dataAddingProductToCart || {};
        if (
            addProductsToCart &&
            addProductsToCart.user_errors &&
            Array.isArray(addProductsToCart.user_errors) &&
            addProductsToCart.user_errors.length > 0
        ) {
            return addProductsToCart.user_errors.map(
                user_error => user_error.message
            );
        }

        return [];
    },[dataAddingProductToCart]);

    const wishlistItemOptions = useMemo(() => {
        const options = {
            quantity: 1,
            sku: product.sku
        };

        if (productType === 'ConfigurableProduct') {
            options.selected_options = selectedOptionsArray;
        }

        return options;
    }, [product, productType, selectedOptionsArray]);

    const wishlistButtonProps = {
        // buttonText: isSelected =>
        //     isSelected
        //         ? formatMessage({
        //             id: 'wishlistButton.addedText',
        //             defaultMessage: 'Added to Favorites'
        //         })
        //         : formatMessage({
        //             id: 'wishlistButton.addText',
        //             defaultMessage: 'Add to Favorites'
        //         }),
        item: wishlistItemOptions,
        storeConfig: storeConfigData ? storeConfigData.storeConfig : {}
    };

    return {
        breadcrumbCategoryId,
        errorMessage: derivedErrorMessage,
        userErrorsMessage,
        handleAddToCart,
        handleBuyNow,
        handleSelectionChange,
        isOutOfStock,
        isAddProductLoading,
        isAddToCartDisabled:
            isOutOfStock ||
            isMissingOptions ||
            isAddProductLoading ||
            isAddDownloadableLoading ||
            isAddBundleLoading ||
            !isAllRequiredCustomFieldFilled ||
            !isAllRequiredDownloadableFieldFilled,
        isSupportedProductType,
        mediaGalleryEntries,
        shouldShowWishlistButton:
            isSignedIn &&
            storeConfigData &&
            !!storeConfigData.storeConfig.magento_wishlist_general_is_enabled,
        productDetails,
        wishlistButtonProps,
        wishlistItemOptions,
        customOptions,
        groupedOptions,
        bundleOptions,
        handleBundleChangeOptions,
        handleBundleChangeQty,
        resetBundleOption,
        handleCustomOptionsChange,
        handleGroupedOptionsChange,
        handleUpdateQuantity,
        getCurrentCustomValue,
        getCurrentBundleValue,
        optionSelections,
        optionCodes,
        downloadableOptions,
        getCurrentDownloadableValue,
        handleDownloadableOptionsChange,
        extraPrice,
        productType,
        switchExtraPriceForNormalPrice,
        upsellProducts,
        crosssellProducts,
        relatedProducts,
        setAlertMsg,
        alertMsg
    };
};
