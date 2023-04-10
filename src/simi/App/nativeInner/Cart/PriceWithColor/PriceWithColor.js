import React, {Fragment, useMemo, useRef} from 'react';
import Price from '@magento/venia-ui/lib/components/Price';
import {Helmet} from 'react-helmet';
import {useStyle} from "@magento/venia-ui/lib/classify";
import {configColor} from "../../../../Config";
import {randomString} from "../../../../Helper/String";


export const PriceWithColor = (props) => {
    const {
        color = props.color ? props.color : '#767676',
        ...rest
    } = props

    const uniqueId = useRef('price_' + randomString()).current

    const derivedClasses = useMemo(() => color ? {
            currency: uniqueId,
            integer: uniqueId,
            decimal: uniqueId,
            fraction: uniqueId
        } : null,
        [color, uniqueId]
    )

    const classes = useStyle(props.classes, derivedClasses)

    const styleStr = useMemo(
        () => `.${uniqueId}{color: ${color}}`,
        [uniqueId, color]
    )

    return (
        <Fragment>
            <Helmet>
                <style>{styleStr}</style>
            </Helmet>
            <Price {...rest} classes={classes}/>
        </Fragment>
    );
};

