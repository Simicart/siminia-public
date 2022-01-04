import makeOptimizedUrl from 'src/util/makeUrl';
import Identify from './Identify';

export const getUrlBuffer = () => {
    return window.SMCONFIGS && window.SMCONFIGS.media_url_prefix
        ? window.SMCONFIGS.media_url_prefix
        : '';
};

export const resourceUrl = (path, { type, width } = {}) => {
    const urlBuffer = getUrlBuffer();
    let result = makeOptimizedUrl(path, { type, width });
    //fix error when path is not full url, when the result does not directory ./pub
    if (
        path &&
        path.indexOf('http://') === -1 &&
        path.indexOf('https://') === -1
    ) {
        //url does not have protocol
        if (urlBuffer) {
            if (result.indexOf('media%2Fcatalog%2Fproduct') !== -1) {
                result = result.replace(
                    'media%2Fcatalog%2Fproduct',
                    urlBuffer + 'media%2Fcatalog%2Fproduct'
                );
            } else if (result.indexOf('media%2Fcatalog%2Fcategory') !== -1) {
                result = result.replace(
                    'media%2Fcatalog%2Fcategory',
                    urlBuffer + 'media%2Fcatalog%2Fcategory'
                );
            }
        }
    } else {
        //url has protocol
        if (path) {
            if (result.includes('%2FStore2'))
                return result.replace('%2FStore2', '');
            else if (result.includes('%2FStore'))
                return result.replace('%2FStore', '');
            else return result;
        }
    }
    return result;
};

export const convertToSlug = Text => {
    return Text.toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};

/*
Logo Url
*/
export const logoUrl = () => {
    const magentoConfig = Identify.getStoreConfig();

    if (
        magentoConfig &&
        magentoConfig['storeConfig'] &&
        magentoConfig['storeConfig'].header_logo_src &&
        magentoConfig['storeConfig'].base_media_url
    ) {
        const url = new URL(
            './logo/' + magentoConfig['storeConfig'].header_logo_src,
            magentoConfig['storeConfig'].base_media_url
        );
        return url.href;
    }
    return 'https://www.simicart.com/skin/frontend/default/simicart2.1/images/simicart/new_logo_small.png';
};

/*
Url suffix
*/
export const cateUrlSuffix = () => {
    const savedSuffix = Identify.getDataFromStoreage(
        Identify.SESSION_STOREAGE,
        'CATEGORY_URL_SUFFIX'
    );
    if (savedSuffix) return savedSuffix;
    try {
        const storeConfig = Identify.getStoreConfig();
        const suffix = storeConfig.storeConfig.category_url_suffix;
        Identify.storeDataToStoreage(
            Identify.SESSION_STOREAGE,
            'CATEGORY_URL_SUFFIX',
            suffix
        );
        return suffix;
    } catch (err) {
        console.log(err);
    }
    return '.html';
};

export const productUrlSuffix = () => {
    const savedSuffix = Identify.getDataFromStoreage(
        Identify.LOCAL_STOREAGE,
        'PRODUCT_URL_SUFFIX'
    );
    if (savedSuffix) return savedSuffix;
    try {
        const storeConfig = Identify.getStoreConfig();
        const suffix = storeConfig.storeConfig.product_url_suffix;
        Identify.storeDataToStoreage(
            Identify.LOCAL_STOREAGE,
            'PRODUCT_URL_SUFFIX',
            suffix
        );
        return suffix;
    } catch (err) {
        console.log(err);
    }
    return '.html';
};

/*
Local url dictionary
*/

export const getDataFromUrl = url => {
    let localUrlDict = Identify.getDataFromStoreage(
        Identify.SESSION_STOREAGE,
        'LOCAL_URL_DICT'
    );
    localUrlDict = localUrlDict ? localUrlDict : {};
    return localUrlDict[url];
};

export const saveDataToUrl = (url, data) => {
    let localUrlDict = Identify.getDataFromStoreage(
        Identify.SESSION_STOREAGE,
        'LOCAL_URL_DICT'
    );
    localUrlDict = localUrlDict ? localUrlDict : {};
    if (!localUrlDict[url]) {
        localUrlDict[url] = {
            id: data.id,
            sku: data.sku,
            name: data.name,
            url_key: data.url_key,
            stock_status: data.stock_status,
            review_count: data.review_count,
            price: data.price,
            small_image: data.small_image,
            media_gallery_entries: data.media_gallery_entries,
            rating_summary: data.rating_summary,
            type_id: data.type_id,
            is_dummy_data: true
        };
        Identify.storeDataToStoreage(
            Identify.SESSION_STOREAGE,
            'LOCAL_URL_DICT',
            localUrlDict
        );
    }
};

export const saveCategoriesToDict = category => {
    if (category) {
        if (
            category.children &&
            Array.isArray(category.children) &&
            category.children.length
        ) {
            category.children.forEach(childCat => {
                saveCategoriesToDict(childCat);
            });
        }
        if (category.url_path)
            saveDataToUrl('/' + category.url_path + cateUrlSuffix(), {
                id: category.id,
                name: category.name
            });
    }
};
