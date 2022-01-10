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
    console.log('listlabel', productLabel);

    const src = listlabel[0].label_template;
    const styles = JSON.parse(listlabel[0].list_position);
    const styleLabel = listlabel[0].list_css ? parseFloat(listlabel[0].list_css.split("rotate(")[1].split("de")) : null



    const width = styles.label.width;
    const height = styles.label.height;
    const left = 800 - 114 - width
    const btTop = 800 - 114 - height
    
    const topCenterLeft = 350 - height

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
                        height: height,
                        position: "absolute",

                    };
                    break;
                case 'tc':
                    position = {};
                    break;
                case 'tr':
                    position = {
                        top: -9,
                        left: "75%",
                        zIndex: 3,
                        width: width,
                        height: height
                    };
                    break;
                case 'cl':
                    position = {
                        position: "absolute",
                        left: 0,
                        top: topCenterLeft,
                    };
                    break;
                case 'cc':
                    position = {};
                    break;
                case 'cr':
                    position = {
                        position: "absotule",
                        left: `55%`,
                        top: topCenterLeft
                    };
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
                        top: '75%',
                        left: '73%',
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
                        top: "-5px",
                        left: '67%',
                        zIndex: 3,
                        width: widthMb,
                        // height: height
                    };
                    break;
                case 'cl':
                    position = {
                        position: "absolute",
                        left: 0,
                        top: topCenterLeft,
                    };
                    break;
                case 'cc':
                    position = {};
                    break;
                case 'cr':
                    position = {
                        position: "absotule",
                        left: `55%`,
                        top: topCenterLeft
                    };
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
                        top: '75%',
                        left: '70%',
                        zIndex: 3,
                        width: "30%",
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
                    top: "-33%",
                    left: 0,
                    zIndex: 3,
                    width: widthMb,
                    position: "absolute"
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
                position = {
                    position: "absolute",
                    left: 0,
                    width: widthMb,
                };
                break;
            case 'cc':
                position = {};
                break;
            case 'cr':
                position = {
                    position: "absolute",
                    width: widthMb
                };
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
                    top: '45%',
                    left: '69%',
                    zIndex: 3,
                    width: widthMb,
                    // height: height
                };
                break;
        }
    }
    const positionLabelText = { ...position, transform: `rotate(${styleLabel}deg) translate(30px, 20px)`, zIndex: 4, position: "absolute", color: listlabel[0].label_color }
    const positionLabelTextGallery = {
        // top: 0,
        // left: 0,
        ...position,
        top: 21,
        marginLeft: 13,
        zIndex: 4,
        width: widthMb,
        position: "absolute",
        transform: `rotate(${styleLabel}deg) translate(-21px, 2px)`,
        color: listlabel[0].label_color
    }
    console.log("hahsahs", positionLabelText);
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
        <div style={!label_tyle ? positionLabelText : positionLabelTextGallery} className='productLabel'>{listlabel[0].label}</div>
        <img className="label-image" src={src} alt="img-" style={position} />

    </React.Fragment>
};

export default ProductLabel;
