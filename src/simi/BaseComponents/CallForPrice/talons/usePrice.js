import { useMemo } from 'react';
import { getHidePriceEnable } from '../utils';

export const usePrice = (props = {}) => {
    const { product } = props;

    const hidePriceEnable = getHidePriceEnable();

    const { advancedhideprice } = product || {};

    const isHidePrice = useMemo(() => {
        return (
            hidePriceEnable &&
            advancedhideprice && 
            !!advancedhideprice.advancedhideprice_text &&
            !!advancedhideprice.advancedhideprice_type
        );
    }, [hidePriceEnable, advancedhideprice]);

    return {
        isHidePrice
    };
};
