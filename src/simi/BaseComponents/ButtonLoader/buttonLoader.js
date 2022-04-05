import React, { useRef } from 'react';

import defaultClasses from './buttonLoader.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';

const ButtonLoader = props => {
    const {
        classes: propClasses,
    } = props;
    const classes = useStyle(propClasses, defaultClasses);

    return (
        <Button
            priority="high"
            className={classes.loader_button + ' ' + propClasses}
            disabled={true}
        >
            <div className={classes.loader} />
        </Button>
    );
};

export default ButtonLoader;
