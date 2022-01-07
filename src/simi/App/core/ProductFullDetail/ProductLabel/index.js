import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { XSquare, X } from 'react-feather';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
require('./styles.scss');


const IMAGE_WIDTH = 640;



const ProductLabel = props => {
    const { productLabel, label_tyle } = props;


    if (!productLabel || productLabel.length == 0) {
        return null;
    }


    const listlabel = [...productLabel].sort((a, b) => (a.priority > b.priority) ? 1 : -1)
    console.log('listlabel', listlabel[0].list_css);
    console.log('listlabel', listlabel[0].list_position);

    const src = listlabel[0].label_template;
    const styles = JSON.parse(listlabel[0].list_position);
    const styleLabel = "div {background-color: blue}"
    const width = styles.label.width;
    const height = styles.label.height;
    const left = 800 - 114 - width
    const btTop = 800 - 114 - height
    const widthMb = 80
    let position;
    if (!label_tyle) {

        if (window.innerWidth > 767) {
            switch (listlabel[0].list_position_grid) {
                case 'tl':
                    position = {
                        top: -6,
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
                        left: left,
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
                        top: btTop,
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
            switch (listlabel[0].list_position_grid) {
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
        switch (listlabel[0].list_position_grid) {
            case 'tl':
                position = {
                    top: "-37%",
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
                    top: '44%',
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
    if (!listlabel[0].label) {

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
    }
    return <React.Fragment>
       
        <div style={position} className='productLabel'>{listlabel[0].label}</div>
        <img className="label-image" src={src} alt="img-" style={position} />
        
    </React.Fragment>
};

export default ProductLabel;
