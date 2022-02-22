import React, {Suspense} from 'react';
import {useStyle} from '@magento/venia-ui/lib/classify';
import defaultClasses from './priceAdjustments.module.css'
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {Accordion, Section} from "@magento/venia-ui/lib/components/Accordion";
import {useIntl} from "react-intl";
import CouponCode from "../CouponCode";

export const PriceAdjustments = (props) => {
    const {classes: _classess, ...rest} = props

    const classes = useStyle(_classess, defaultClasses)
    const {formatMessage} = useIntl();

    return (
        <Accordion classes={{
            root: classes.accordRoot
        }}>
            <Section
                id={'coupon_code'}
                title={formatMessage({
                    id: 'priceAdjustments.couponCode',
                    defaultMessage: 'Coupon Code'
                })}
                classes={{
                    root: classes.sectionRoot,
                    title: classes.sectionTitle,
                    title_wrapper: classes.title_wrapper,
                    contents_container: classes.contents_container
                }}
            >
                <Suspense fallback={<LoadingIndicator/>}>
                    <CouponCode setIsCartUpdating={props.setIsCartUpdating}/>
                </Suspense>
            </Section>
        </Accordion>
    );
};
