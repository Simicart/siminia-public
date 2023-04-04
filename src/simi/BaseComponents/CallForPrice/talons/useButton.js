import { useMemo, useCallback } from 'react';
import { getHidePriceEnable } from '../utils';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useButton = (props = {}) => {
    const { product } = props;

    const { advancedhideprice, sku } = product || {};
    const [, { toggleDrawer }] = useAppContext();
    const hidePriceEnable = getHidePriceEnable();

    const isHidePrice = useMemo(() => {
        return (
            hidePriceEnable &&
            advancedhideprice &&
            advancedhideprice.advancedhideprice_type === 'hideprice'
        );
    }, [hidePriceEnable, advancedhideprice]);

    const isCallForPrice = useMemo(() => {
        return (
            hidePriceEnable &&
            advancedhideprice &&
            advancedhideprice.advancedhideprice_type === 'callforprice'
        );
    }, [hidePriceEnable, advancedhideprice]);

    const text = useMemo(() => {
        return advancedhideprice?.advancedhideprice_text;
    }, [advancedhideprice]);

    const handleOpen = useCallback(() => {
        toggleDrawer('hidePrice.form.' + sku);
    }, [sku, toggleDrawer]);

    return {
        isHidePrice,
        isCallForPrice,
        text,
        productSku: sku,
        handleOpen
    };
};
