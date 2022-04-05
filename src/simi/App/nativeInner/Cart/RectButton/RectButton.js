import React from 'react';
import defaultClass from './RectButton.module.css'
import Button from "@magento/venia-ui/lib/components/Button/button";

// red button, but is squared
export const RectButton = (props) => {
    const {children, classes, ...restProps} = props || {}

    return (
        <Button {...restProps}
                classes={defaultClass}
                type={'submit'}
        >
            {children}
        </Button>
    );
};

