import React from 'react';
import ReactDOM from 'react-dom';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { formatPrice } from 'src/simi/Helper/Pricing';
import { useIntl } from 'react-intl';
import defaultClasses from './productLabel.module.css';

const ProductLabel = props => {
    const { productLabel } = props;
    console.log('productLabel', productLabel);
    const classes = useStyle(defaultClasses, props.classes);

    const renderLabel = () => {
        return productLabel.map((label, index) => {
            return (
                <div
                    key={index}
                    style={{
                        top:label.image_data?.top,
                        left:label.image_data?.left,
                        height: label.image_data?.heightOrigin,
                        width: label.image_data?.widthOrigin
                    }}
                    className={classes.label}
                >
                    <img alt={label.name} src={label.file} />
                </div>
            );
        });
    };

    return <div className={classes.wrapper}>{renderLabel()}</div>;
};

export default ProductLabel;
