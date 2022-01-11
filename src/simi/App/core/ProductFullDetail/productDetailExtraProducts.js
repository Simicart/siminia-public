import React, { useEffect, useMemo, useRef, useState } from 'react';
import Gallery from '../../../BaseComponents/Products/Gallery';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClass from './ProductDetailExtraProducts.module.css';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';

export const checkElementVisible = elem => {
    const rect = elem.getBoundingClientRect();

    // only check left and right, for visibility within an overflow scroll
    return (
        rect.left >= 0 &&
        rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
    );
};

export const HoveringButton = props => {
    const {
        icon: Icon,
        containerClass,
        onClick,
        defaultIconColor = '#333',
        hoveringIconColor = '#fff',
        iconSize = 16
    } = props;

    const [color, setColor] = useState(defaultIconColor);

    return (
        <div
            className={containerClass}
            onClick={onClick}
            onMouseEnter={() => setColor(hoveringIconColor)}
            onMouseLeave={() => setColor(defaultIconColor)}
        >
            <Icon color={color} size={iconSize} />
        </div>
    );
};

export const defaultIfNull = (value, defaultVal) =>
    value === null ? defaultVal : value;

export const ProductDetailExtraProducts = props => {
    const { classes: _classes, products, history, children } = props;

    const containerRef = useRef(null);
    const [test, setTest] = useState(
        containerRef.current ? containerRef.current.clientWidth : null
    );

    const { innerWidth } = useWindowSize();

    const numberOfEntries = useMemo(() => {
        if (innerWidth > 1024) {
            return 4;
        } else if (innerWidth > 540) {
            return 3;
        } else {
            return 2;
        }
    }, [innerWidth]);
    useEffect(() => {
        const containerVisibleWidth = containerRef.current
            ? containerRef.current.clientWidth
            : null;
        if (containerVisibleWidth != test) {
            setTest(containerVisibleWidth);
        }
    }, [containerRef]);

    if (products.length === 0) {
        return null;
    }

    const containerVisibleWidth = containerRef.current
        ? containerRef.current.clientWidth
        : null;

    const classes = mergeClasses(defaultClass, _classes);

    const move = direction => () => {
        const outerContainer = containerRef.current;
        const container = outerContainer.querySelector(
            `.${classes['gallery-items']}`
        );
        const productLength = container.children
            ? container.children.length
            : 0;
        if (!container || productLength === 0) {
            return null;
        }
        let firstVisibleProductIndex = null;
        let lastVisibleProductIndex = null;

        for (let i = 0; i < productLength; i++) {
            const target = container.childNodes[i];
            if (checkElementVisible(target)) {
                if (firstVisibleProductIndex === null) {
                    firstVisibleProductIndex = i;
                }
                lastVisibleProductIndex = i;
            }
        }
        const scrollToTargetIndex =
            direction === 'left'
                ? (defaultIfNull(firstVisibleProductIndex, 0) - 1) %
                  productLength
                : (defaultIfNull(lastVisibleProductIndex, 0) + 1) %
                  productLength;

        const finalTargetToScrollTo = container.childNodes[scrollToTargetIndex];

        if (finalTargetToScrollTo) {
            finalTargetToScrollTo.scrollIntoView({
                block: 'nearest',
                inline: direction === 'left' ? 'end' : 'start',
                behavior: 'smooth'
            });
        }
    };

    const moveBackward = move('left');
    const moveForward = move('right');

    return (
        <div className={classes['upsell-crosssell-container']}>
            <div className={classes['container-title']}>
                <div className={classes['intro-title']}>{children}</div>
                <div className={classes['container-controller']}>
                    <HoveringButton
                        icon={ChevronLeft}
                        containerClass={[
                            classes['backward-arrow-button'],
                            classes['arrow-button']
                        ].join(' ')}
                        onClick={moveBackward}
                    />
                    <HoveringButton
                        icon={ChevronRight}
                        containerClass={[
                            classes['forward-arrow-button'],
                            classes['arrow-button']
                        ].join(' ')}
                        onClick={moveForward}
                    />
                </div>
            </div>
            <div className={classes['upsell-container']} ref={containerRef}>
                {numberOfEntries && containerVisibleWidth ? (
                    <Gallery
                        items={products}
                        history={history}
                        overRideClasses={classes}
                        styles={{
                            'siminia-product-grid-item': {
                                minWidth:
                                    containerVisibleWidth / numberOfEntries
                            }
                        }}
                    />
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};
