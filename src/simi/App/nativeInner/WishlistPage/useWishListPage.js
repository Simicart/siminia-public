import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/WishlistPage/wishlistItem.gql.js';


export const useWishlistPage = () => {
    const {cartItem} = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operation)
    const {
        addWishlistItemToCartMutation
        
    } = operations;
    
    const [addAllToCart, {
        error,
        loading
    }] = useMutation(addWishlistItemToCartMutation, {
        variables: {
            cartId,
            cartItem
        }
    })

}