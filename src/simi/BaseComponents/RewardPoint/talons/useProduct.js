import { useMemo } from 'react';
import {
    getRewardPointIcon,
    getRewardPointActive,
    getRewardPointProductPage,
    getRewardPointCatePage
} from '../utils';

export const useProduct = props => {
    const { item, type } = props;

    const rewardPointIcon = getRewardPointIcon();

    const active = useMemo(() => {
        let result = getRewardPointActive();

        if (!result) {
            return false;
        }

        switch (type) {
            case 'list':
                result = getRewardPointCatePage();
                break;
            case 'detail':
                result = getRewardPointProductPage();
                break;
            default:
                break;
        }

        return result;
    });

    const productPoint = useMemo(() => {
        return item?.reward_point?.product_point || {};
    }, [item]);

    const point = useMemo(() => {
        return productPoint?.point || null;
    }, [productPoint]);

    const message = useMemo(() => {
        return productPoint?.message || null;
    }, [productPoint]);

    return {
        active,
        icon: rewardPointIcon,
        point,
        message
    };
};
