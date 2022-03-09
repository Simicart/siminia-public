import {isProductConfigurable} from '@magento/peregrine/lib/util/isProductConfigurable';
import {findMatchingVariant} from '@magento/peregrine/lib/util/findMatchingProductVariant';
import {
    getInternalCustomOptionValueObject
} from '../../App/core/SimiProductOptions/CustomOption/utils/getInternalCustomOptionValueObject';

export const getConfigurablePrice = settings => {
    const {product, optionCodes, optionSelections} = settings;
    let value;

    const {variants} = product;
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

        value = item
            ? item.product.price.regularPrice.amount
            : product.price.regularPrice.amount;
    } else {
        value = product.price.regularPrice.amount;
    }

    return value;
};

export const getFromToBundlePrice = settings => {
    const {product} = settings;
    const originalPriceObject = product.price.regularPrice.amount;

    const items = product.items;

    const getFirstOption = (items, sortFunction) => {
        return items
            .map(item => {
                if (item.required !== true) {
                    return 0;
                }
                const options = item.options;
                try {
                    const result = options
                        .map(
                            option =>
                                option.product.price_range.minimum_price
                                    .final_price.value
                        )
                        .sort(sortFunction);
                    const resultKeys = Object.keys(result);
                    return result &&
                    resultKeys &&
                    resultKeys.length &&
                    result[resultKeys[0]]
                        ? result[resultKeys[0]]
                        : 0;
                } catch (err) {
                    console.warn(err);
                    return 0;
                }
            })
            .reduce((acc, cur) => acc + cur, 0);
    };

    const fromPrice = getFirstOption(items, (a, b) => a - b); // smallest option
    const toPrice = getFirstOption(items, (a, b) => b - a); // biggest option

    return {...originalPriceObject, fromValue: fromPrice, toValue: toPrice};
};

export const getAdditionalPriceFromSubCustomOption = (option, basePrice) => {
    const {price_type, price} = option;
    if (price_type === 'FIXED') {
        return price;
    } else {
        // percent price
        return basePrice * (price / 100);
    }
};

export const getCustomPrice = settings => {
    const {product, customOptions: chosenCustomOptions} = settings;

    const originalPriceObject = product.price.regularPrice.amount;

    const regularPrice = product.price.regularPrice;
    const regularAmount = regularPrice.amount.value;

    // this will be different from regularPrice on product with discount
    const minimumPrice = product.price.minimalPrice;
    const minimumAmount = minimumPrice.amount.value;

    const customOptions = product.options || [];
    const chosenCustomOptionUidArray = Object.keys(chosenCustomOptions).filter(
        key => !!chosenCustomOptions[key]
    );

    const matchingSelectedOptions = customOptions
        .filter(option => chosenCustomOptionUidArray.includes(option.uid))
        .map(option => getInternalCustomOptionValueObject(option));

    const additionalPrice = matchingSelectedOptions.reduce((acc, cur) => {
        const {key, value: option} = cur;

        if (option instanceof Array) {
            // multi value
            const selectedSubOptions = option.filter(op => {
                return (
                    (chosenCustomOptions[key] || []).includes(
                        op.option_type_id
                    ) ||
                    (chosenCustomOptions[key] || []).includes(
                        String(op.option_type_id)
                    )
                );
            });
            return (
                acc +
                selectedSubOptions.reduce((acc_1, op) => {
                    return (
                        acc_1 +
                        getAdditionalPriceFromSubCustomOption(op, regularAmount)
                    );
                }, 0)
            );
        } else {
            try {
                return (
                    acc +
                    getAdditionalPriceFromSubCustomOption(option, regularAmount)
                );
            } catch (e) {
                return acc;
            }
        }
    }, 0);

    return {
        ...originalPriceObject,
        value: minimumAmount + additionalPrice,
        baseValue: regularAmount
    };
};

export const getBundlePrice = settings => {
    const {product, bundleOptions} = settings;
    const originalPriceObject = product.price.regularPrice.amount;

    const {option_value, quantity} = bundleOptions;
    const bundles = product.items;

    const currentPrice = Object.entries(option_value)
        .filter(([_, b]) => !!b)
        .map(([optionId, choiceId]) => {
            try {
                const price = bundles
                    .find(option => option.option_id === parseInt(optionId))
                    .options.find(choice => choice.id === parseInt(choiceId))
                    .product.price_range.minimum_price.final_price.value;

                return price * (parseInt(quantity[optionId]) || 0);
            } catch (e) {
                console.warn(e);
                return 0;
            }
        })
        .reduce((acc, cur) => acc + cur, 0);

    return {...originalPriceObject, value: currentPrice};
};

export const getDownloadablePrice = settings => {
    const {product, downloadableOptions} = settings;
    const originalPriceObject = product.price.regularPrice.amount;

    const downloadableLinks = product.downloadable_product_links;

    const selectedDownloadable = Object.values(downloadableOptions)
        .filter(v => !!v)
        .map(downloadOptionId =>
            downloadableLinks.find(
                link => parseInt(link.id) === parseInt(downloadOptionId)
            )
        );

    const additionalDownloadablePrice = selectedDownloadable.reduce(
        (acc, cur) => {
            return acc + cur.price;
        },
        0
    );

    return {...originalPriceObject, value: additionalDownloadablePrice};
};

export const getGroupedPrice = settings => {
    const {product, groupedOptions} = settings;
    const originalPriceObject = product.price.regularPrice.amount;

    const groups = product.items;

    const additionalPrice = Object.entries(groupedOptions)
        .filter(x => x[1]) // not null
        .map(([id, quantityArr]) => {
            const qtyKeys = Object.keys(quantityArr);
            if (qtyKeys && qtyKeys[0] && quantityArr[qtyKeys[0]] > 0) {
                const targetedGroup = groups.find(
                    group => parseInt(group.product.id) === parseInt(id)
                );
                try {
                    return (
                        targetedGroup.product.price_range.minimum_price
                            .final_price.value * quantityArr[qtyKeys[0]]
                    );
                } catch (e) {
                    console.warn(e);
                    return 0;
                }
            } else {
                return 0;
            }
        })
        .reduce((acc, cur) => {
            return acc + cur;
        }, 0);

    return {...originalPriceObject, value: additionalPrice};
};

export const getDisplayPrice = settings => {
    const {product} = settings;
    const productType = product.__typename;

    switch (productType) {
        case 'ConfigurableProduct':
            return getConfigurablePrice(settings);
        case 'SimpleProduct':
            return getCustomPrice(settings);
        case 'BundleProduct':
            return getBundlePrice(settings);
        case 'DownloadableProduct':
            return getDownloadablePrice(settings);
        case 'GroupedProduct':
            return getGroupedPrice(settings);
        default:
            return getConfigurablePrice(settings);
    }
};
