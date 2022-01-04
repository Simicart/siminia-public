import React, {useEffect, useRef, useState} from 'react';
import {FashionableDotPagination} from './FashionableDotPagination';
import {randomString} from "./randomString";
import defaultClasses from './index.module.css';

let slidedTheSlider = false;

export const CarefreeHorizontalScroll = (props) => {
    const {item, children, pagingStyle, _numberOfChildren} = props || {};
    const {name = 'Hello'} = item;
    const numberOfChildren =
        children instanceof Array ? children.length : children ? 1 : 0;

    const unqId = useRef(randomString()).current;

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (index) => {
        if (currentIndex !== index) {
            setCurrentIndex(index);
        }
    };

    const isPaginationBarVisible = !!(item.dataParsed &&
    item.dataParsed['showSliderIndicator'] !== undefined
        ? item.dataParsed['showSliderIndicator']
        : true);

    useEffect(() => {
        const index = currentIndex;
        if (index === 0) {
            if (!slidedTheSlider)
                return;
        } else
            slidedTheSlider = true;
            
        if (numberOfChildren <= 1) {
            // no where to scroll
        } else if (children[index]) {
            const elements = document.querySelector(
                `.${unqId}.${
                    defaultClasses ['child-container']
                }`,
            ).children;
            const target = elements.item(index);
            target.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
        }
    }, [children, currentIndex, numberOfChildren, unqId]);

    return (
        <React.Fragment>
            <div className={defaultClasses['carefree-container']}>
                <div className={defaultClasses['inner-container']}>
                    <div className={defaultClasses['title']}>{name}</div>
                    <div className={`${unqId} ${defaultClasses['child-container']}`}>{children}</div>
                </div>
                {isPaginationBarVisible && (
                    <FashionableDotPagination
                        pagingStyle={pagingStyle}
                        numberOfPages={_numberOfChildren !== undefined ? _numberOfChildren : numberOfChildren}
                        currentIndex={currentIndex}
                        onChangeIndex={handleScroll}
                    />
                )}
            </div>
        </React.Fragment>
    );
};
