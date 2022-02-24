import React from 'react';
import defaultClass from './RectOutlineButton.module.css'
import Button from "@magento/venia-ui/lib/components/Button/button";
import {configColor} from "../../../../Config";

export const RectOutlineButton = (props) => {
    const {children, classes,  ...restProps} = props || {}

    return (
        <Button {...restProps}
                classes={defaultClass}
                type={'submit'}
                style={{
                    color: configColor.button_background,
                    borderColor: configColor.button_text_color
                }}
        >
            {children}
        </Button>
    );
};

