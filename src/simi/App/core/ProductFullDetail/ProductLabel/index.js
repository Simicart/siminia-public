import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { XSquare, X } from 'react-feather';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { callbackify } from 'util';
require('./styles.scss');



const ProductLabel = props => {
    const { productLabel, label_tyle, imageWidth } = props;

    if (!productLabel || productLabel.length == 0) {
        return null;
    }
    console.log("wwwww", imageWidth);

    const listlabel = [...productLabel].sort((a, b) =>
        a.priority > b.priority ? 1 : -1
    );

    const src = listlabel[0].label_template;
    const styles = JSON.parse(listlabel[0].list_position);
    const styleLabel = listlabel[0].list_css
        ? parseFloat(listlabel[0].list_css.split('rotate(')[1].split('de'))
        : null;
    console.log('haha', listlabel[0]);

    const width = styles.label.width;
    const height = styles.label.height;
    
    const btTop = 800 - 114 - height;

    const topCenterLeft = 340 - height;

    const widthMb = 120;
    const heightInGallery = 120;
    //-----------------------------------------

    const topText = -6 + height / 2 - 14;
    const topTextMb = -6 + widthMb / 2 - 29;
    const labelColor = listlabel[0].label_color;
    const fontSize = parseInt(listlabel[0].label_font_size);
    const left = imageWidth - width 
    const leftMb = window.innerWidth > 423 ? 240 - width*0.6 : (240 - width*0.6)/2 

    //-----------------------------------------

    let position;
    let positionText;
    if (!label_tyle) {
        if (window.innerWidth > 767) {
            switch (listlabel[0].list_position_grid) {
                case 'tl': {
                    position = {
                        top: 0,
                        left: 0,
                        zIndex: 2,
                        width: width,
                        height: height,
                        position: 'absolute'
                    };
                    positionText = {
                        top: topText,
                        left: 0,
                        zIndex: 3,
                        color: labelColor,
                        fontSize: fontSize,
                        transform: `rotate(${styleLabel}deg)  translate(50%, 0%)`,
                        position: 'absolute',
                        lineHeight: `${40}px`,
                    };
                    break;
                }
                case 'tc':
                    position = {};
                    break;
                case 'tr':
                    position = {
                        top: '0%',
                        left: left,
                        zIndex: 2,
                        height: height,
                        width: width,
                    };
                    positionText = {
                        top: '0%',
                        left: left,
                        zIndex: 3,
                        height:  height,
                        width: width,
                        color: labelColor,
                        fontSize: fontSize,
                        transform: `rotate(${styleLabel}deg)`,
                        position: 'absolute',
                        lineHeight: `${height}px`,
                        textAlign:"center"
                        
                    };
                    break;
                case 'cl':
                    position = {
                        position: 'absolute',
                        left: 0,
                        top: topCenterLeft
                    };
                    break;
                case 'cc':
                    position = {};
                    break;
                case 'cr':
                    position = {
                        position: 'absotule',
                        left: `55%`,
                        top: topCenterLeft
                    };
                    break;
                case 'bl':
                    position = {
                        top: "70%",
                        left: 0,
                        zIndex: 2,
                        height: height,
                        width: width,
                        position: 'absolute'
                    };
                    positionText = {
                        top: "70%",
                        left: 0,
                        zIndex: 3,
                        height:  height,
                        width: width,
                        color: labelColor,
                        fontSize: fontSize,
                        transform: `rotate(${styleLabel}deg)  `,
                        position: 'absolute',
                        lineHeight: `${height}px`,
                        textAlign: "center"
                    };
                    break;
                case 'bc':
                    position = {};
                    break;
                case 'br':
                    position = {
                        top: "70%",
                        left: left,
                        zIndex: 2,
                        height: height,
                        width: width,
                        position: 'absolute'
                    };
                    positionText = {
                        top: "70%",
                        left: left,
                        zIndex: 3,
                        height:  height,
                        width: width,
                        color: labelColor,
                        fontSize: fontSize,
                        transform: `rotate(${styleLabel}deg)  `,
                        position: 'absolute',
                        lineHeight: `${height}px`,
                        textAlign: "center"
                    };
                    break;
            }
        } else {
            switch (listlabel[0].list_position_grid) {
                case 'tl':
                    position = {
                        top: '0%',
                        left: 0,
                        zIndex: 2,
                        width: widthMb
                        // height: height
                    };
                    positionText = {
                        top: topTextMb,
                        left: 0,
                        zIndex: 3,
                        color: labelColor,
                        fontSize: fontSize,
                        transform: `rotate(${styleLabel}deg)  translate(30%, 0%)`,
                        position: 'absolute'
                    };
                    break;
                case 'tc':
                    position = {};
                    break;
                case 'tr':
                    position = {
                        top: '0%',
                        left: left,
                        zIndex: 2,
                        height: height,
                        width: width,
                    };
                    positionText = {
                        top: '0%',
                        left: left,
                        zIndex: 3,
                        height:  height,
                        width: width,
                        color: labelColor,
                        fontSize: fontSize,
                        transform: `rotate(${styleLabel}deg)`,
                        position: 'absolute',
                        lineHeight: `${height}px`,
                        textAlign:"center"
                        
                    };
                    break;
                case 'cl':
                    position = {
                        position: 'absolute',
                        left: 0,
                        top: topCenterLeft
                    };
                    break;
                case 'cc':
                    position = {};
                    break;
                case 'cr':
                    position = {
                        position: 'absotule',
                        left: `55%`,
                        top: topCenterLeft
                    };
                    break;
                case 'bl':
                    position = {
                        top: '90%',
                        left: 0,
                        zIndex: 2,
                        width: widthMb
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
                        zIndex: 2,
                        width: '30%'
                        // height: height
                    };
                    break;
            }
        }
    } else {
        switch (listlabel[0].list_position_grid) {
            case 'tl':
                position = {
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    height: height*0.6,
                    width: width*0.6,
                    position: 'absolute'
                    // height: height
                };
                positionText = {
                    top: topTextMb,
                    left: 0,
                    zIndex: 3,
                    height: "auto",
                    width: "auto",
                    color: labelColor,
                    fontSize: 14,
                    transform: `rotate(${styleLabel}deg)`,
                    position: 'absolute',
                    lineHeight:"25px"
                };
                break;
            case 'tc':
                position = {};
                break;
            case 'tr':
                position = {
                    top: '0%',
                    left: leftMb,
                    zIndex: 2,
                    height: height*0.6,
                    width: width*0.6,
                };
                positionText = {
                    top: '0%',
                    left: leftMb,
                    zIndex: 3,
                    height:  height*0.6,
                    width: width*0.6,
                    color: labelColor,
                    fontSize: 14,
                    transform: `rotate(${styleLabel}deg)`,
                    position: 'absolute',
                    lineHeight: `${height*0.6}px`,
                    textAlign:"center"
                };
                break;
            case 'cl':
                position = {
                    position: 'absolute',
                    left: 0,
                    width: widthMb
                };
                break;
            case 'cc':
                position = {};
                break;
            case 'cr':
                position = {
                    position: 'absolute',
                    width: widthMb
                };
                break;
            case 'bl':
                position = {
                    top: "70%",
                    left: 0,
                    zIndex: 2,
                    height: height*0.6,
                    width: width*0.6,
                    position: 'absolute'
                };
                positionText = {
                    top: "70%",
                    left: 0,
                    zIndex: 3,
                    height:  height*0.6,
                    width: width*0.6,
                    color: labelColor,
                    fontSize: 14,
                    transform: `rotate(${styleLabel}deg)  `,
                    position: 'absolute',
                    lineHeight: `${height*0.6}px`,
                };
                break;
            case 'bc':
                position = {};
                break;
            case 'br':
                position = {
                    top: "70%",
                    left: leftMb,
                    zIndex: 2,
                    height: height*0.6,
                    width: width*0.6,
                    position: 'absolute'
                };
                positionText = {
                    top: "70%",
                    left: leftMb,
                    zIndex: 3,
                    height:  height*0.6,
                    width: width*0.6,
                    color: labelColor,
                    fontSize: 14,
                    transform: `rotate(${styleLabel}deg)  `,
                    position: 'absolute',
                    lineHeight: `${height*0.6}px`,
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
    return (
        <React.Fragment>
            <div style={positionText} className="productLabel">
                {listlabel[0].label}
            </div>
            <img
                className="label-image"
                src={src}
                alt="img-"
                style={position}
            />
        </React.Fragment>
    );
};

export default ProductLabel;
