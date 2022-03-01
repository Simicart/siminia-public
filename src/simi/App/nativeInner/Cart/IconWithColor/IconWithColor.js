import React, {Fragment, useMemo} from 'react';
import {configColor} from "../../../../Config";
import Icon from '@magento/venia-ui/lib/components/Icon';
import {useStyle} from "@magento/venia-ui/lib/classify";

const IconWithColor = (props) => {
    const {
        color = configColor.icon_color,
        ...rest
    } = props

    const styleObj = useMemo(() => {
        return {stroke: color ? color : '#333'}
    }, [color])

    const currentStyle = useStyle(props.style, styleObj)


    return (
        <Fragment>
            <Icon {...rest} style={currentStyle}/>
        </Fragment>
    );
};

export default IconWithColor;
