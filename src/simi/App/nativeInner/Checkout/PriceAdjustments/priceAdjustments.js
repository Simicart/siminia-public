import React, { Suspense, useState } from 'react';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import {useBottomNotification} from "src/simi/App/nativeInner/Cart/bottomNotificationHook";

const CorePriceAdjustments = React.lazy(() => import('src/simi/App/core/Cart/PriceAdjustments'));

const CartPriceAdjustments  = React.lazy(() => import('src/simi/App/nativeInner/Cart/PriceAdjustments'));

const PriceAdjustments = props => {
    
    const {
        component: notiComponent,
        makeNotification
    } = useBottomNotification()

    const {isMobile} = props

    if(isMobile) {
        return (
            <React.Fragment>
                <Suspense fallback={<LoadingIndicator />}>
                    <CartPriceAdjustments {...props} makeNotification={makeNotification}/>
                </Suspense>
                {notiComponent}
            </React.Fragment>
      
        )
    }

    return  (
        <Suspense fallback={<LoadingIndicator />}>
            <CorePriceAdjustments {...props} />
        </Suspense>
    )
};

export default PriceAdjustments;

