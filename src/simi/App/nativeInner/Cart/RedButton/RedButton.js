import React from 'react';
import defaultClass from './RedButton.module.css'
import Button from "@magento/venia-ui/lib/components/Button/button";
import {configColor} from "../../../../Config";

export const RedButton = (props) => {
    const {children, classes, ...restProps} = props || {}

    return (
        <Button {...restProps}
                classes={defaultClass}
                type={'submit'}
                style={{
                    backgroundColor: configColor.button_background,
                    color: configColor.button_text_color
                }}
        >
            {children}
        </Button>
    );
};

