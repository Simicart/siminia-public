import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { XSquare, X } from 'react-feather';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
require('./styles.scss');
import { DEFAULT_WIDTH_TO_HEIGHT_RATIO } from '@magento/venia-ui/lib/util/images';

const IMAGE_WIDTH = 640;

const ProductLabel = props => {
    const { productLabel,label_tyle } = props;
    console.log('productlabel', label_tyle);

    if (!productLabel || productLabel.length == 0) {
        return null;
    }

    const src = productLabel[0].label_template;
    const styles = JSON.parse(productLabel[0].list_position);
    const width = styles.label.width;
    const height = styles.label.height;
    const widthMb = 110
    let position;
    if (!label_tyle) {

    
    if (window.innerWidth > 767) {
        switch (productLabel[0].list_position_grid) {
            case 'tl':
                position = {
                    top: 0,
                    left: 0,
                    zIndex: 3,
                    width: width,
                    height: height
                };
                break;
            case 'tc':
                position = {};
                break;
            case 'tr':
                position = {
                    top: 0,
                    left: '84%',
                    zIndex: 3,
                    width: width,
                    height: height
                };
                break;
            case 'cl':
                position = {};
                break;
            case 'cc':
                position = {};
                break;
            case 'cr':
                position = {};
                break;
            case 'bl':
                position = {
                    top: '90%',
                    left: 0,
                    zIndex: 3,
                    width: width,
                    height: height
                };
                break;
            case 'bc':
                position = {};
                break;
            case 'br':
                position = {
                    top: '90%',
                    left: '84%',
                    zIndex: 3,
                    width: width,
                    height: height
                };
                break;
        }
    } else {
        switch (productLabel[0].list_position_grid) {
            case 'tl':
                position = {
                    top: "0%",
                    left: 0,
                    zIndex: 3,
                    width: widthMb,
                    // height: height
                };
                break;
            case 'tc':
                position = {};
                break;
            case 'tr':
                position = {
                    top: "0%",
                    left: '67%',
                    zIndex: 3,
                    width: widthMb,
                    // height: height
                };
                break;
            case 'cl':
                position = {};
                break;
            case 'cc':
                position = {};
                break;
            case 'cr':
                position = {};
                break;
            case 'bl':
                position = {
                    top: '90%',
                    left: 0,
                    zIndex: 3,
                    width: widthMb,
                    // height: height
                };
                break;
            case 'bc':
                position = {};
                break;
            case 'br':
                position = {
                    top: '90%',
                    left: '69%',
                    zIndex: 3,
                    width: widthMb,
                    // height: height
                };
                break;
        }
    }
}
else {
    switch (productLabel[0].list_position_grid) {
        case 'tl':
            position = {
                top: "-42%",
                left: 0,
                zIndex: 3,
                width: widthMb,
                // height: height
            };
            break;
        case 'tc':
            position = {};
            break;
        case 'tr':
            position = {
                top: "-6%",
                left: "74%",
                zIndex: 3,
                width: 66,
                height: 96
            };
            break;
        case 'cl':
            position = {};
            break;
        case 'cc':
            position = {};
            break;
        case 'cr':
            position = {};
            break;
        case 'bl':
            position = {
                top: '90%',
                left: 0,
                zIndex: 3,
                width: widthMb,
                // height: height
            };
            break;
        case 'bc':
            position = {};
            break;
        case 'br':
            position = {
                top: '90%',
                left: '69%',
                zIndex: 3,
                width: widthMb,
                // height: height
            };
            break;
    }
}
    return (
        <React.Fragment>
            <img
                className="label-image"
                src={src}
                alt="img-haha"
                style={position}
            />
        </React.Fragment>
    );
};

export default ProductLabel;
