import Identify from './Identify';

export const analyticClickGTM = (name, id, price) => {
    try {
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'productClick',
                'ecommerce': {
                    'click': {
                        'products': [{
                            'name': name,
                            'id': id,
                            'price': price,
                        }]
                    }
                },
            });
        }
    } catch (err) { }
}

export const analyticAddCartGTM = (name, id, price) => {
    try {
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'addToCart',
                'ecommerce': {
                    'add': {
                        'products': [{
                            'name': name,
                            'id': id,
                            'price': price,
                            'quantity': 1
                        }]
                    }
                }
            });
        }
    } catch (err) { }
}

export const analyticRemoveCartGTM = (name, id, price, qty = 1) => {
    try {
        if (window.dataLayer) {
            // Measure the removal of a product from a shopping cart.
            window.dataLayer.push({
                'event': 'removeFromCart',
                'ecommerce': {
                    'remove': {                                 // 'remove' actionFieldObject measures.
                        'products': [{                          //  removing a product to a shopping cart.
                            'name': name,
                            'id': id,
                            'price': price,
                            'quantity': qty
                        }]
                    }
                }
            });
        }
    } catch (err) { }
}


export const analyticsViewDetailsGTM = (product) => {
    if (window.dataLayer) {
        const { simiExtraField } = product;
        const { attribute_values } = simiExtraField;
        const { entity_id, price, name } = attribute_values;
        dataLayer.push({
            'ecommerce': {
                'event': 'productDetailView',
                'detail': {
                    'products': [{
                        'name': name,
                        'id': entity_id || 0,
                        'price': price || 0
                    }]
                },
                'event': 'product_detail_view'
            }
        });
    }
}

export const analyticPurchaseGTM = (dataOrder) => {
    try {
        if (window.dataLayer) {
            dataLayer.push({
                'ecommerce': {
                    'purchase': {
                        'actionField': {
                            'id': dataOrder.increment_id,
                            'affiliation': 'SimiCart Store',
                            'revenue': dataOrder.total.grand_total_incl_tax,
                            'tax': dataOrder.total.tax,
                            'shipping': dataOrder.total.shipping_hand_incl_tax,
                        },
                        'products': dataOrder.order_items
                    }
                }
            });
        }
    } catch (err) { }
}

export const analyticImpressionsGTM = (products, category = '', list_name = '') => {
    try {
        if (window.dataLayer) {
            const storeConfig = Identify.getStoreConfig();
            const rootCate = (storeConfig && storeConfig.categories && storeConfig.categories.items && storeConfig.categories.items[0]) ?
                storeConfig.categories.items[0] : {};
            const config = storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config || {};
            const currency = storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.currency || 'USD';
            let brands = new Map();
            if (config.brands) {
                config.brands.map((item) => {
                    brands.set(item.option_id, item.name);
                    return item;
                });
            }
            let categories = new Map();
            if (rootCate.children) {
                rootCate.children.map((item) => {
                    categories.set(item.id, item);
                    return item;
                });
                categories.set(rootCate.id, rootCate);
            }
            let impressions = [];
            for (let i = 0, len = products.length; i < len; i++) {
                let extraAttributes = products[i].simiExtraField && products[i].simiExtraField.attribute_values || {};
                let price = products[i].price && (products[i].price.minimalPrice || products[i].price.regularPrice) || {};
                let catIds = extraAttributes.category_ids || [];
                let _p_cat = products[i].categories && products[i].categories.pop() || categories.get(parseInt(catIds.pop()));
                let brandId = extraAttributes.brand || '';
                let brand = brands.get(brandId);
                let impressObj = {
                    'name': products[i].name,       // Name or ID is required.
                    'id': products[i].id,
                    'brand': brand || '',
                    'category': category || _p_cat && _p_cat.name || 'Default Category',
                    'list': list_name,
                    'position': (i + 1)
                }
                if (price.amount) impressObj.price = price.amount && price.amount.value;
                impressions.push(impressObj);
            }
            window.dataLayer.push({
                'ecommerce': {
                    'currencyCode': currency,
                    'impressions': impressions
                }
            });
        }
    } catch (err) { }
}