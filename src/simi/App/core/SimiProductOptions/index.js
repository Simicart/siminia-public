import React from 'react';
import { mergeClasses } from 'src/classify';
import { shape, string } from 'prop-types';

import defaultClasses from './index.module.css';
import { CustomOption } from './CustomOption';
import { DownloadableOptions } from './DownloadOption';
import { GroupedOptions } from './GroupedOptions';
import { BundleOptions } from './BundleOptions/BundleOptions';

const SimiProductOptions = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    //switch option by type here

    const productType = props.product.__typename;
    switch (productType) {
        case 'SimpleProduct':
            return <CustomOption {...props} />;
        case 'DownloadableProduct':
            return <DownloadableOptions {...props} />;
        case 'GroupedProduct':
            return <GroupedOptions {...props} />;
        case 'BundleProduct':
            return <BundleOptions {...props} />;
        default:
            return <div className={classes.root}>Other Types</div>;
    }
};

SimiProductOptions.propTypes = {
    classes: shape({ root: string })
};
SimiProductOptions.defaultProps = {};
export default SimiProductOptions;
