import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './productLabel.module.css';
import Identify from '../../../Helper/Identify';

const ProductLabel = props => {
    const { productLabel, page } = props;
    const storeConfig = Identify.getStoreConfig();
    const { bssProductLabelStoreConfig } = storeConfig || {};
    const classes = useStyle(defaultClasses, props.classes);
    const notDisplayLabel = bssProductLabelStoreConfig?.not_display_label_on?.split(',') || []
    if (
        !productLabel ||
        productLabel.length == 0 ||
        bssProductLabelStoreConfig?.active === 0
        || notDisplayLabel.includes(page)
    ) {
        return null;
    }


    const listLabel = [...productLabel].sort((a, b) =>
        a.priority < b.priority ? -1 : 1
    );
    const now = new Date();
    const dateNow =
        now.getFullYear() +
        '-' +
        ('00' + (now.getMonth() + 1)).slice(-2) +
        '-' +
        ('00' + now.getDate()).slice(-2) +
        ' ' +
        ('00' + now.getHours()).slice(-2) +
        ':' +
        ('00' + now.getMinutes()).slice(-2) +
        ':' +
        ('00' + now.getSeconds()).slice(-2);

    return (
        <>
            {bssProductLabelStoreConfig?.display_multiple_label === '1' ? (
                listLabel.map(label => {
                    return (
                        <>
                            {label.valid_start_date <= dateNow &&
                                label.valid_end_date >= dateNow &&
                                label.active && (
                                    <div
                                        key={label.id}
                                        style={{
                                            top: `${label.image_data?.top}%`,
                                            left: `${label.image_data?.left}%`,
                                            height: `${
                                                label.image_data?.height
                                            }%`,
                                            width: `${
                                                label.image_data?.width
                                            }%`,
                                            backgroundImage: `url(${
                                                label.file
                                            })`
                                        }}
                                        className={classes.label}
                                    />
                                )}
                        </>
                    );
                })
            ) : (
                <>
                    {listLabel[0].valid_start_date <= dateNow &&
                        listLabel[0].valid_end_date >= dateNow &&
                        listLabel[0].active && (
                            <div
                                style={{
                                    top: `${listLabel[0].image_data?.top}%`,
                                    left: `${listLabel[0].image_data?.left}%`,
                                    height: `${
                                        listLabel[0].image_data?.height
                                    }%`,
                                    width: `${listLabel[0].image_data?.width}%`,
                                    backgroundImage: `url(${listLabel[0].file})`
                                }}
                                className={classes.label}
                            />
                        )}
                </>
            )}
        </>
    );
};

export default ProductLabel;
