import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { XSquare, X } from 'react-feather';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
require('./styles.scss');
import { DEFAULT_WIDTH_TO_HEIGHT_RATIO } from '@magento/venia-ui/lib/util/images';
import defaultClasses from './Label.css'
import { transform } from 'lodash';

const IMAGE_WIDTH = 640;

const ProductLabel = props => {
    const { productLabel, label_tyle, width, height } = props;
    const classes = defaultClasses
    
    if (!productLabel || productLabel.length == 0) {
        return null;
    }
    const list = [...productLabel].sort((a,b) => (a.priority > b.priority) ? 1: -1)
    console.log('productlabel', list);
    // list.sort((a,b) => (a.priority < b.priority) ? 1: -1)
    // console.log('productlabel', list);

    const rotation = (list[0].list_position_grid == "tl" || list[0].list_position_grid == "cl" || list[0].list_position_grid == "bl") ? "-42" : "42"
    const src = list[0].label_template;
    const styles = JSON.parse(list[0].list_position);
   const widthMb  = 90
    let position;
    if (!label_tyle) {
        if (window.innerWidth > 767) {
            switch (list[0].list_position_grid) {
                case 'tl':
                    position = {
                        top: 0,
                        left: 0,
                        zIndex: 3,
                        width: "auto",
                        height: "auto"
                    };
                    break;
                case 'tc':
                    position = {};
                    break;
                case 'tr':
                    position = {
                        width: "auto",
                        height: "auto",
                        top: 0,
                        left: "73%"
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
                        top: '70%',
                        left: 0,
                        zIndex: 3,
                        width: 200,
                        
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
            switch (list[0].list_position_grid) {
                case 'tl':
                    position = {
                        top: '0%',
                        left: 0,
                        zIndex: 3,
                        width: widthMb
                        // height: height
                    };
                    break;
                case 'tc':
                    position = {};
                    break;
                case 'tr':
                    position = {
                        top: '0%',
                        left: '67%',
                        zIndex: 3,
                        width: widthMb
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
                        width: widthMb
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
                        width: widthMb
                        // height: height
                    };
                    break;
            }
        }
    } else {
        switch (list[0].list_position_grid) {
            case 'tl':
                position = {
                    top: '-31%',
                    left: 0,
                    zIndex: 3,
                    width: widthMb
                    // height: height
                };
                break;
            case 'tc':
                position = {};
                break;
            case 'tr':
                position = {
                    top: "0%",
                    left: "69%",
                    zIndex: 3,
                    width: 80,
                    height: "auto",
                    position: "absolute"
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
                    width: widthMb
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
                    width: widthMb
                    // height: height
                };
                break;
        }
    }
    if (!list[0].label) {
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
    } else {
        const font = list[0].label_font;
        const fontSize = `${list[0].label_font_size}px`;
        const color = list[0].label_color;
        const textStyle = {
            fontFamily: "Poppins",
            fontSize: fontSize,
            color: color,
            transform: `translateX(-8px) translateY(28px) rotate(${rotation}deg)`,
            position:"absolute",
            zIndex: 3,
        };
        const labelStyle = {
            ...position,
            position: "absolute",
            width: `${label_tyle ? "80px" : "auto"}`,
            height: "auto",
            zIndex:2
        }
        const style = { ...position, ...textStyle, height: "auto", width: "auto"};
        return (
            <div
                key={list[0].rule_id}
                className={classes.template}
                
               
            >
                <div  style={style} className={classes.textItem}>{list[0].label}</div>
                <img
                    src={list[0].label_template}
                    // style={{ height: '100%', width: '100%' }}
                    style={labelStyle}
                    alt="label"
                />
            </div>
        );
    }
};

export default ProductLabel;
