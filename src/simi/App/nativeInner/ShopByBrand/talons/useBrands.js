import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BRANDS_LIST } from './Brand.gql';
import Identify from 'src/simi/Helper/Identify';
import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const getBrandConfig = () => {
    const {brandConfig} = Identify.getStoreConfig() || {}
    if(brandConfig) {
        return brandConfig
    }

    return null
}

const checkValidCateId = (categoryId, brandItem) => {
    let matchedCate = false
    if (brandItem.mpbrandCategories && brandItem.mpbrandCategories.length) {
        brandItem.mpbrandCategories.map(mpbrandCategory => {
            if (parseInt(mpbrandCategory.cat_id) === parseInt(categoryId))
                matchedCate = true
        })
    }
    return matchedCate
}

export const useBrands = props => {
    const brandConfiguration = getBrandConfig()
    const brandConfiguration2 = storage.getItem('simiBrandConfiguration');
    console.log("brandConfiguration2",brandConfiguration2)
    const { categoryId } = props
    //get Brand List useQuery
    const {
        data: brandsData,
        loading: brandsLoading,
        error: brandsError
    } = useQuery(GET_BRANDS_LIST, {
        variables: {
            pageSize: 199,
            currentPage: 1,
        },
        fetchPolicy:"cache-and-network"
    });
   
    const [startWith, setStartWith] = useState('');
    const [brandSearchString, setBrandSearchString] = useState('');

    let derivedErrorMessage;
    if (brandsError) {
        const errorTarget = brandsError;
        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        } else {
            // A non-GraphQL error occurred.
            derivedErrorMessage = errorTarget.message;
        }
    }

    //filter brands by dictionary
    const brandsList = useMemo(() => {
        if (brandsData && brandsData.mpbrand && brandsData.mpbrand.items) {
            let brandItems = brandsData.mpbrand.items

            const filteredItems = []
            brandItems.map(
                brandItem => {
                    if (categoryId) {
                        if (!checkValidCateId(categoryId, brandItem))
                            return
                    }
                    if (startWith && brandItem.url_key) {
                        if (brandItem.default_value.toLowerCase()[0] === startWith) {
                            filteredItems.push(brandItem)
                        }
                    } else if(startWith === '') {
                        filteredItems.push(brandItem)
                    }
                  
                }
            )
            return filteredItems
        }
        return []
    }, [brandsData, startWith]);

    //use this var for available dictionary options
    const availableChars = useMemo(() => {
        let availableChars = ''
        if (brandsData && brandsData.mpbrand && brandsData.mpbrand.items) {
            brandsData.mpbrand.items.map(brandItem => {
                if (categoryId) {
                    if (!checkValidCateId(categoryId, brandItem))
                        return
                }
                if (brandItem.url_key)
                    availableChars += brandItem.default_value.toLowerCase()[0]
            })
        }
        return availableChars
    }, [brandsData])

    //filter brands by search
    const brandSearchResult = useMemo(() => {
        if (brandsData && brandsData.mpbrand && brandsData.mpbrand.items) {
            const brandItems = brandsData.mpbrand.items
            const searchedItems = []
            brandItems.map(
                brandItem => {
                    if (categoryId) {
                        if (!checkValidCateId(categoryId, brandItem))
                            return
                    }
                    if (brandSearchString) {
                        if (
                            (brandItem.default_value.toLowerCase().indexOf(brandSearchString.toLowerCase()) !== -1) &&
                            brandItem.url_key
                        )
                            searchedItems.push(brandItem)
                    }
                }
            )
            return searchedItems
        }
        return []
    }, [brandsData, brandSearchString]);

    return {
        brandsList,
        brandsLoading,
        derivedErrorMessage,
        startWith,
        setStartWith,
        availableChars,
        brandSearchString,
        setBrandSearchString,
        brandSearchResult,
        brandConfiguration
    }
}
