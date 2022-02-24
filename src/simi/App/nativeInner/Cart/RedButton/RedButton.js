import React from 'react';
import defaultClass from './RedButton.module.css'
import Button from "@magento/venia-ui/lib/components/Button/button";

export const RedButton = (props) => {
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

