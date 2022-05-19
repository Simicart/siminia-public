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

    return (
        <>
            {listlabel.map((item, index) => {
                // const styles = JSON.parse(item.list_position);

                let src;
                let styles;
                let styleLabel;
                let positionGrid;
                let labelText;
                let listFrontSize;
                let LabelFrontSize;
                if (item.same != 0) {
                    src = item.label_template;
                    styles = JSON.parse(item.list_position);
                    styleLabel = item.list_css
                        ? parseFloat(
                              item.list_css.split('rotate(')[1].split('de')
                          )
                        : 0;
                    positionGrid = item.list_position_grid;
                    labelText = item.label;
                    listFrontSize = item.list_font_size;
                    LabelFrontSize = parseInt(item.label_font_size);
                } else {
                    src = label_tyle ? item.list_template : item.label_template;
                    const list_css = item.list_css || '';
                    const label_css = item.label_css || '';
                    styles = label_tyle
                        ? JSON.parse(item.list_position)
                        : JSON.parse(item.label_position);
                    styleLabel = label_tyle
                        ? parseFloat(list_css.split('rotate(')[1].split('de'))
                        : parseFloat(label_css.split('rotate(')[1].split('de'));
                    positionGrid = label_tyle
                        ? item.list_position_grid
                        : item.label_position_grid;
                    labelText = label_tyle ? item.list_label : item.label;
                    listFrontSize = item.list_font_size;
                    LabelFrontSize = parseInt(item.label_font_size);
                }

                // const styleLabel = item.list_css
                //     ? parseFloat(item.list_css.split('rotate(')[1].split('de'))
                //     : null;

                const width = styles.label.width;
                const height = styles.label.height;
                // const rotateV = styleLabel > 0 ? 0 : height / 4;

                const topCenterLeft = 340 - height;

                const widthMb = 120;

                //-----------------------------------------

                const topText = styleLabel > 0 ? '17%' : '20%';
                const leftText = styleLabel > 0 ? '36%' : '4%';
                const topTextDT = styleLabel > 0 ? '22%' : '25%';
                const leftTextDT = styleLabel > 0 ? '33%' : '13%';
                const topTextMb = -6 + widthMb / 2 - 29;
                const labelColor = item.label_color;
                const fontSize = parseInt(item.label_font_size);
                const left = imageWidth - width;
                const leftMb =
                    window.innerWidth > 423
                        ? 240 - width * 0.6
                        : (240 - width * 0.6) / 2;

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
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            }
                            case 'tc':
                                position = {
                                    top: 0,
                                    left: `calc(50% - ${width / 2}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'tr':
                                position = {
                                    top: '0%',
                                    left: `calc(100% - ${width}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'cl':
                                position = {
                                    top: `calc(50% - ${height / 2}px)`,
                                    left: 0,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'cc':
                                position = {
                                    top: `calc(50% - ${height / 2}px)`,
                                    left: `calc(50% - ${width / 2}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'cr':
                                position = {
                                    top: `calc(50% - ${height / 2}px)`,
                                    left: `calc(100% - ${width}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'bl':
                                position = {
                                    top: `calc((100% - ${height}px - 20px))`,
                                    left: 0,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'bc':
                                position = {
                                    top: `calc((100% - ${height}px - 20px))`,
                                    left: `calc(50% - ${height / 2}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'br':
                                position = {
                                    top: `calc((100% - ${height}px - 20px))`,
                                    left: `calc(100% - ${height}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                        }
                    } else {
                        switch (positionGrid) {
                            case 'tl':
                                position = {
                                    top: 0,
                                    left: 0,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'tc':
                                position = {
                                    top: 0,
                                    left: `calc(50% - ${width / 2}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'tr':
                                position = {
                                    top: '0%',
                                    left: `calc(100% - ${width}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'cl':
                                position = {
                                    top: `calc(50% - ${height / 2}px)`,
                                    left: 0,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'cc':
                                position = {
                                    top: `calc(50% - ${height / 2}px)`,
                                    left: `calc(50% - ${width / 2}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'cr':
                                position = {
                                    top: `calc(50% - ${height / 2}px)`,
                                    left: `calc(100% - ${width}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'bl':
                                position = {
                                    top: `calc((100% - ${height}px - 20px))`,
                                    left: 0,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'bc':
                                position = {
                                    top: `calc((100% - ${height}px - 20px))`,
                                    left: `calc(50% - ${height / 2}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
                                };
                                break;
                            case 'br':
                                position = {
                                    top: `calc((100% - ${height}px - 20px))`,
                                    left: `calc(100% - ${height}px)`,
                                    zIndex: index + 2,
                                    height: height,
                                    width: width,
                                    position: 'absolute'
                                };
                                positionText = {
                                    top: topTextDT,
                                    left: leftTextDT,
                                    zIndex: index + 3,
                                    color: labelColor,
                                    fontSize: 17,
                                    transform: `rotate(${styleLabel}deg)`,
                                    position: 'absolute'
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
                                zIndex: index + 2,
                                height: height,
                                width: width,
                                position: 'absolute'
                                // height: height
                            };
                            positionText = {
                                top: topText,
                                left: leftText,
                                zIndex: index + 3,
                                height: 'auto',
                                width: 'auto',
                                color: labelColor,
                                fontSize: 14,
                                transform: `rotate(${styleLabel}deg)`,
                                position: 'absolute',
                                lineHeight: `${Math.sqrt(
                                    (height * height) / 8
                                )}px`
                            };
                            break;
                        case 'tc':
                            position = {
                                top: 0,
                                left: `calc(50% - ${width / 2}px)`,
                                zIndex: index + 2,
                                height: height,
                                width: width,
                                position: 'absolute'
                                // height: height
                            };
                            positionText = {
                                top: topText,
                                left: leftText,
                                zIndex: index + 3,
                                height: 'auto',
                                width: 'auto',
                                color: labelColor,
                                fontSize: LabelFrontSize,
                                transform: `rotate(${styleLabel}deg)`,
                                position: 'absolute',
                                lineHeight: `${Math.sqrt(
                                    (height * height) / 8
                                )}px`
                            };
                            break;
                        case 'tr':
                            position = {
                                top: 0,
                                left: `calc(100% - ${width}px)`,
                                zIndex: index + 2,
                                height: height,
                                width: width,
                                position: 'absolute'
                            };
                            positionText = {
                                top: topText,
                                left: leftText,
                                zIndex: index + 3,
                                height: 'auto',
                                width: 'auto',
                                color: labelColor,
                                fontSize: LabelFrontSize,
                                transform: `rotate(${styleLabel}deg)`,
                                position: 'absolute',
                                lineHeight: `${Math.sqrt(
                                    (height * height) / 8
                                )}px`,
                                textAlign: 'center'
                            };
                            break;
                        case 'cl':
                            position = {
                                top: `calc(50% - ${height / 2}px)`,
                                left: 0,
                                zIndex: index + 2,
                                height: height,
                                width: width,
                                position: 'absolute'
                                // height: height
                            };
                            positionText = {
                                top: topText,
                                left: leftText,
                                zIndex: index + 3,
                                height: 'auto',
                                width: 'auto',
                                color: labelColor,
                                fontSize: LabelFrontSize,
                                transform: `rotate(${styleLabel}deg)`,
                                position: 'absolute',
                                lineHeight: `${Math.sqrt(
                                    (height * height) / 8
                                )}px`
                            };
                            break;
                        case 'cc':
                            position = {
                                top: `calc(50% - ${height / 2}px)`,
                                left: `calc(50% - ${width / 2}px)`,
                                zIndex: index + 2,
                                height: height,
                                width: width,
                                position: 'absolute'
                                // height: height
                            };
                            positionText = {
                                top: topText,
                                left: leftText,
                                zIndex: index + 3,
                                height: 'auto',
                                width: 'auto',
                                color: labelColor,
                                fontSize: LabelFrontSize,
                                transform: `rotate(${styleLabel}deg)`,
                                position: 'absolute',
                                lineHeight: `${Math.sqrt(
                                    (height * height) / 8
                                )}px`
                            };
                            break;
                        case 'cr':
                            position = {
                                top: `calc(50% - ${height / 2}px)`,
                                left: `calc(100% - ${width}px)`,
                                zIndex: index + 2,
                                height: height,
                                width: width,
                                position: 'absolute'
                                // height: height
                            };
                            positionText = {
                                top: topText,
                                left: leftText,
                                zIndex: index + 3,
                                height: 'auto',
                                width: 'auto',
                                color: labelColor,
                                fontSize: LabelFrontSize,
                                transform: `rotate(${styleLabel}deg)`,
                                position: 'absolute',
                                lineHeight: `${Math.sqrt(
                                    (height * height) / 8
                                )}px`
                            };
                            break;
                        case 'bl':
                            position = {
                                top: `calc(100% - ${height}px)`,
                                left: 0,
                                zIndex: index + 2,
                                height: height,
                                width: width,
                                position: 'absolute'
                            };
                            positionText = {
                                top: topText,
                                left: leftText,
                                zIndex: index + 3,
                                height: 'auto',
                                width: 'auto',
                                color: labelColor,
                                fontSize: LabelFrontSize,
                                transform: `rotate(${styleLabel}deg)  `,
                                position: 'absolute',
                                lineHeight: `${Math.sqrt(
                                    (height * height) / 8
                                )}px`
                            };
                            break;
                        case 'bc':
                            position = {
                                top: `calc(100% - ${height}px)`,
                                left: `calc(50% - ${width / 2}px)`,
                                zIndex: index + 2,
                                height: height,
                                width: width,
                                position: 'absolute'
                                // height: height
                            };
                            positionText = {
                                top: topText,
                                left: leftText,
                                zIndex: index + 3,
                                height: 'auto',
                                width: 'auto',
                                color: labelColor,
                                fontSize: LabelFrontSize,
                                transform: `rotate(${styleLabel}deg)`,
                                position: 'absolute',
                                lineHeight: `${Math.sqrt(
                                    (height * height) / 8
                                )}px`
                            };
                            break;
                        case 'br':
                            position = {
                                top: `calc(100% - ${height}px)`,
                                left: `calc(100% - ${width}px)`,
                                zIndex: index + 2,
                                height: height,
                                width: width,
                                position: 'absolute'
                            };
                            positionText = {
                                top: topText,
                                left: leftText,
                                zIndex: index + 3,
                                height: 'auto',
                                width: 'auto',
                                color: labelColor,
                                fontSize: LabelFrontSize,
                                transform: `rotate(${styleLabel}deg)  `,
                                position: 'absolute',
                                lineHeight: `${Math.sqrt(
                                    (height * height) / 8
                                )}px`
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
                        {/* <div style={label_tyle ? position : null}> */}
                        <div style={position}>
                            <div style={positionText} className="productLabel">
                                {labelText}
                            </div>
                            <img
                                className="label-image"
                                src={src}
                                alt="img-"
                                style={position}
                            />
                        </div>
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default ProductLabel;
