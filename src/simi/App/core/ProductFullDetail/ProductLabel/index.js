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

    const listlabel = [...productLabel].sort((a, b) =>
        a.priority > b.priority ? -1 : 1
    );
    console.log('haha', listlabel);

    return <>
    {listlabel.map((item, index) => {
    
        

    


    // const styles = JSON.parse(item.list_position);

    let src;
    let styles
    let styleLabel
    let positionGrid
    let labelText
    if (item.same != 0) {
        src = item.label_template;
        styles = JSON.parse(item.list_position);
        styleLabel = parseFloat(item.list_css.split('rotate(')[1].split('de'))
        positionGrid = item.list_position_grid
        labelText = item.label
    } else {
        src = label_tyle ?  item.list_template : item.label_template;
        styles = label_tyle ? JSON.parse(item.list_position) : JSON.parse(item.label_position);
        styleLabel = label_tyle  ? parseFloat(item.list_css.split('rotate(')[1].split('de')) : parseFloat(item.label_css.split('rotate(')[1].split('de'))
        positionGrid = label_tyle ? item.list_position_grid : item.label_position_grid
        labelText = label_tyle ? item.list_label : item.label

    }
   

    // const styleLabel = item.list_css
    //     ? parseFloat(item.list_css.split('rotate(')[1].split('de'))
    //     : null;

    

    const width = styles.label.width;
    const height = styles.label.height;

    const topCenterLeft = 340 - height;

    const widthMb = 120;

    //-----------------------------------------

    const topText = -6 + height / 2 - 14;
    const topTextMb = -6 + widthMb / 2 - 29;
    const labelColor = item.label_color;
    const fontSize = parseInt(item.label_font_size);
    const left = imageWidth - width;
    const leftMb =
        window.innerWidth > 423 ? 240 - width * 0.6 : (240 - width * 0.6) / 2;

    //-----------------------------------------

    let position;
    let positionText;
    if (!label_tyle) {
        if (window.innerWidth > 767) {
            switch (positionGrid) {
                case 'tl': {
                    position = {
                        top: 0,
                        left: 0,
                        zIndex: index+2,
                        width: width,
                        height: height,
                        position: 'absolute'
                    };
                    positionText = {
                        top: 0,
                        left: 0,
                        zIndex: index +3,
                        color: labelColor,
                        fontSize: fontSize,
                        transform: `rotate(${styleLabel}deg)  translate(50%, 0%)`,
                        position: 'absolute',
                        lineHeight: `${height-8}px`
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
                        zIndex: index+2,
                        height: height,
                        width: width
                    };
                    positionText = {
                        top: '0%',
                        left: left,
                        zIndex: index +3,
                        height: height,
                        width: width,
                        color: labelColor,
                        fontSize: fontSize,
                        transform: `rotate(${styleLabel}deg)`,
                        position: 'absolute',
                        lineHeight: `${height}px`,
                        textAlign: 'center'
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
                        top: '70%',
                        left: 0,
                        zIndex: index+2,
                        height: height,
                        width: width,
                        position: 'absolute'
                    };
                    positionText = {
                        top: '70%',
                        left: 0,
                        zIndex: index +3,
                        height: height,
                        width: width,
                        color: labelColor,
                        fontSize: fontSize,
                        transform: `rotate(${styleLabel}deg)  `,
                        position: 'absolute',
                        lineHeight: `${height}px`,
                        textAlign: 'center'
                    };
                    break;
                case 'bc':
                    position = {};
                    break;
                case 'br':
                    position = {
                        top: '70%',
                        left: left,
                        zIndex: index+2,
                        height: height,
                        width: width,
                        position: 'absolute'
                    };
                    positionText = {
                        top: '70%',
                        left: left,
                        zIndex: index +3,
                        height: height,
                        width: width,
                        color: labelColor,
                        fontSize: fontSize,
                        transform: `rotate(${styleLabel}deg)  `,
                        position: 'absolute',
                        lineHeight: `${height}px`,
                        textAlign: 'center'
                    };
                    break;
            }
        } else {
            switch (positionGrid) {
                case 'tl':
                    position = {
                        top: '0%',
                        left: 0,
                        zIndex: index+2,
                        width: widthMb
                        // height: height
                    };
                    positionText = {
                        top: topTextMb,
                        left: 0,
                        zIndex: index +3,
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
                        zIndex: index+2,
                        height: height,
                        width: width
                    };
                    positionText = {
                        top: '0%',
                        left: left,
                        zIndex: index +3,
                        height: height,
                        width: width,
                        color: labelColor,
                        fontSize: fontSize,
                        transform: `rotate(${styleLabel}deg)`,
                        position: 'absolute',
                        lineHeight: `${height}px`,
                        textAlign: 'center'
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
                        zIndex: index+2,
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
                        zIndex: index+2,
                        width: '30%'
                        // height: height
                    };
                    break;
            }
        }
    } else {
        switch (positionGrid) {
            case 'tl':
                position = {
                    top: 0,
                    left: 0,
                    zIndex: index+2,
                    height: height * 0.6,
                    width: width * 0.6,
                    position: 'absolute'
                    // height: height
                };
                positionText = {
                    top: 0,
                    left: 10,
                    zIndex: index +3,
                    height: 'auto',
                    width: 'auto',
                    color: labelColor,
                    fontSize: 14,
                    transform: `rotate(${styleLabel}deg)`,
                    position: 'absolute',
                    lineHeight: `${height * 0.6}px`
                };
                break;
            case 'tc':
                position = {};
                break;
            case 'tr':
                position = {
                    top: '0%',
                    left: leftMb,
                    zIndex: index+2,
                    height: height * 0.6,
                    width: width * 0.6
                };
                positionText = {
                    top: '0%',
                    left: leftMb,
                    zIndex: index +3,
                    height: height * 0.6,
                    width: width * 0.6,
                    color: labelColor,
                    fontSize: 14,
                    transform: `rotate(${styleLabel}deg)`,
                    position: 'absolute',
                    lineHeight: `${height * 0.6}px`,
                    textAlign: 'center'
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
                    top: '70%',
                    left: 0,
                    zIndex: index+2,
                    height: height * 0.6,
                    width: width * 0.6,
                    position: 'absolute'
                };
                positionText = {
                    top: '70%',
                    left: 0,
                    zIndex: index +3,
                    height: height * 0.6,
                    width: width * 0.6,
                    color: labelColor,
                    fontSize: 14,
                    transform: `rotate(${styleLabel}deg)  `,
                    position: 'absolute',
                    lineHeight: `${height * 0.6}px`
                };
                break;
            case 'bc':
                position = {};
                break;
            case 'br':
                position = {
                    top: '70%',
                    left: leftMb,
                    zIndex: index+2,
                    height: height * 0.6,
                    width: width * 0.6,
                    position: 'absolute'
                };
                positionText = {
                    top: '70%',
                    left: leftMb,
                    zIndex: index +3,
                    height: height * 0.6,
                    width: width * 0.6,
                    color: labelColor,
                    fontSize: 14,
                    transform: `rotate(${styleLabel}deg)  `,
                    position: 'absolute',
                    lineHeight: `${height * 0.6}px`
                };
                break;
        }
    }

    if (!item.label) {
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
                {labelText}
            </div>
            <img
                className="label-image"
                src={src}
                alt="img-"
                style={position}
            />
        </React.Fragment>
    );
    
})}
</>
}

export default ProductLabel;
