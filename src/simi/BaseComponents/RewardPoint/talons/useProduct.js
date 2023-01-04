import { useMemo } from "react"
import { getRewardPointIcon, getRewardPointActive } from '../utils';

export const useProduct = (props) => {
    const { item } = props
    const rewardPointActive = getRewardPointActive();
    const rewardPointIcon = getRewardPointIcon()

    const productPoint = useMemo(() => {
        return item?.reward_point?.product_point || {}
    }, [item])

    const point = useMemo(() => {
        return productPoint?.point || null
    }, [productPoint])

    const message = useMemo(() => {
        return productPoint?.message || null
    }, [productPoint])

    return {
        active: rewardPointActive,
        icon: rewardPointIcon,
        point,
        message
    }
}