import React, {Fragment, useMemo, useRef} from 'react';
import Price from '@magento/venia-ui/lib/components/Price';
import {useStyle} from "@magento/venia-ui/lib/classify";
import defaultClasses from './CrossedOutPrice.module.css'

export const CrossedOutPrice = (props) => {
    const {
        ...rest
    } = props

    const classes = useStyle(props.classes, defaultClasses)

    return (
        <Fragment>
            <Price {...rest} classes={classes}/>
        </Fragment>
    );
};
