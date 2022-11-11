import React, { useMemo, useCallback } from 'react';
import { string, shape, array } from 'prop-types';
import { GridItem } from 'src/simi/App/nativeInner/GridItem';

require('./gallery.scss');

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

const Gallery = props => {
    const { items, history, overRideClasses = {}, styles } = props;

    const handleLink = useCallback(link => {
        history.push(link);
    }, []);

    const galleryItems = useMemo(
        () =>
            items.map((item, index) => {
                if (item === null) {
                    return '';
                }
                return (
                    <GridItem
                        key={index}
                        item={mapGalleryItem(item)}
                        handleLink={handleLink}
                        classes={overRideClasses}
                        styles={styles}
                    />
                );
            }),
        [items, styles]
    );

    return (
        <div
            className={`${overRideClasses['gallery-root'] || ''} gallery-root`}
        >
            <div
                className={`${overRideClasses['gallery-items'] ||
                    ''} gallery-items`}
            >
                {galleryItems}
            </div>
        </div>
    );
};

Gallery.propTypes = {
    classes: shape({
        filters: string,
        items: string,
        pagination: string,
        root: string
    }),
    items: array.isRequired,
    overRideClasses: shape(),
    styles: shape()
};

export default Gallery;
