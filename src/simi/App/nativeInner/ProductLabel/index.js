import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './productLabel.module.css';
import Identify from '../../../Helper/Identify';

const ProductLabel = props => {
    const { productLabel, page, productOutStock } = props;
    const storeConfig = Identify.getStoreConfig();
    const { bssProductLabelStoreConfig } = storeConfig || {};
    const classes = useStyle(defaultClasses, props.classes);
    const notDisplayLabel =
        bssProductLabelStoreConfig?.not_display_label_on?.split(',') || [];
    if (
        !productLabel ||
        productLabel.length == 0 ||
        bssProductLabelStoreConfig?.active === '0' ||
        notDisplayLabel.includes(page)
    ) {
        return null;
    }

    if (
        productOutStock &&
        bssProductLabelStoreConfig?.display_only_out_of_stock_label === 1
    ) {
        if(productLabel.length === 0){
            return '';
        }
    }

    const listLabel = [...productLabel].sort((a, b) =>
        a.priority < b.priority ? -1 : 1
    );

    return (
        <>
            {bssProductLabelStoreConfig?.display_multiple_label === 1 ? (
                listLabel.map((label, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                top: `${label.image_data?.top}%`,
                                left: `${label.image_data?.left}%`,
                                height: `${label.image_data?.height}%`,
                                width: `${label.image_data?.width}%`,
                                backgroundImage: `url(${label.image})`
                            }}
                            className={classes.label}
                        />
                    );
                })
            ) : (
                <div
                    style={{
                        top: `${listLabel[0].image_data?.top}%`,
                        left: `${listLabel[0].image_data?.left}%`,
                        height: `${listLabel[0].image_data?.height}%`,
                        width: `${listLabel[0].image_data?.width}%`,
                        backgroundImage: `url(${listLabel[0].image})`
                    }}
                    className={classes.label}
                />
            )}
        </>
    );
};

export default ProductLabel;
