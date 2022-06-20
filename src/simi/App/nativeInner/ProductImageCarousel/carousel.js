import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { Carousel } from 'react-responsive-carousel';
import ImageLightbox from './ImageLightbox';
import { resourceUrl, getUrlBuffer, logoUrl } from 'src/simi/Helper/Url';
import ProductLabel from '@simicart/siminia/src/simi/App/core/ProductFullDetail/ProductLabel';
import './style.css';
import { useWindowSize } from '@magento/peregrine';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useQuery } from '@apollo/client';
import getUrlKey from '../../../../../src/util/getUrlKey'
import DEFAULT_OPERATIONS from '../../core/ProductFullDetail/ProductLabel/productLabel.gql'
import ImageLoading from './imageLoading'
const IMAGE_WIDTH = 640;

/**
 * Carousel component for product images
 * Carousel - Component that holds number of images
 * where typically one image visible, and other
 * images can be navigated through previous and next buttons
 *
 * @typedef ProductImageCarousel
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element} React carousel component that displays a product image
 */
const ProductImageCarousel = props => {
    const { optionSelections, product, optionCodes, topInsets } = props;
    const { formatMessage } = useIntl();
    const lightbox = useRef(null);
    const [renderLightBox, setRenderLightBox] = useState(false);
    const [autoToggleLightBox, setAutoToggleLightBox] = useState(false);

    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getProductLabel } = operations;
    const [placeHoder, setPlaceholder] = useState(true);
    const { data, error, loading } = useQuery(getProductLabel, {
        fetchPolicy: 'cache-and-network',
        variables: {
            urlKey: getUrlKey()
        }
    });
   
   

    useEffect(() => {
        if (lightbox && lightbox.current && autoToggleLightBox !== false) {
            lightbox.current.showLightbox(autoToggleLightBox);
            setAutoToggleLightBox(false);
        }
    }, [lightbox, autoToggleLightBox]);

    const carouselImages = useMemo(() => {
        const { variants } = product;
        const isConfigurable = isProductConfigurable(product);

        const media_gallery_entries = product.media_gallery_entries
            ? product.media_gallery_entries
            : product.small_image
            ? [
                  {
                      file: product.small_image,
                      disabled: false,
                      label: '',
                      position: 1
                  }
              ]
            : [];

        if (
            !isConfigurable ||
            (isConfigurable && optionSelections.size === 0)
        ) {
            return media_gallery_entries;
        }

        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        if (!item) {
            return media_gallery_entries;
        }

        const images = [
            ...item.product.media_gallery_entries,
            ...media_gallery_entries
        ];
        const returnedImages = [];
        var obj = {};
        images.forEach(image => {
            if (!obj[image.file]) {
                obj[image.file] = true;
                returnedImages.push(image);
            }
        });
        returnedImages
            .filter(i => !i.disabled)
            .sort((a, b) => {
                const aPos = isNaN(a.position) ? 9999 : a.position;
                const bPos = isNaN(b.position) ? 9999 : b.position;
                return aPos - bPos;
            });
        return returnedImages;
    }, [optionCodes, product, optionSelections]);

    const renderImageLightboxBlock = () => {
        let images = carouselImages;
        images = images.map(item => {
            return {
                url: item.file
                    ? resourceUrl(item.file, {
                          type: 'image-product',
                          width: 640
                      })
                    : transparentPlaceholder,
                fallBackUrl:
                    getUrlBuffer() + '/media/catalog/product' + item.file
            };
        }, this);
        return <ImageLightbox ref={lightbox} images={images} />
    
    };

    const onChangeItemDefault = () => {};

    const onClickThumbDefault = () => {};

    const openImageLightbox = index => {
        if (lightbox && lightbox.current) {
            lightbox.current.showLightbox(index);
        } else {
            setAutoToggleLightBox(index);
            setRenderLightBox(true);
        }
    };
    const noImage = carouselImages.length === 0;
    const placeholder = (
        <img
            src={logoUrl()}
            alt={'loading'}
            style={
                !isPhone
                    ? { width: 240, height: 40 }
                    : { width: 180, height: 30 }
            }
        />
    );

    const imageWidth =document.querySelector(".product-detail-carousel") ? document.querySelector(".product-detail-carousel").offsetWidth : null

    return (
        <div className="product-detail-carousel" id="product-detail-carousel">
            <Carousel
                key={
                    carouselImages &&
                    carouselImages[0] &&
                    carouselImages[0].file
                        ? carouselImages[0].file
                        : 'pcarousel'
                }
                showArrows={true}
                showThumbs={true}
                showIndicators={false}
                showStatus={false}
                onClickItem={e => openImageLightbox(e)}
                onClickThumb={e => onClickThumbDefault(e)}
                onChange={e => onChangeItemDefault(e)}
                infiniteLoop={true}
                autoPlay={false}
                thumbWidth={80}
            >
               
                {noImage ? (
                    <img
                        src={logoUrl()}
                        alt={'loading'}
                        style={
                            !isPhone
                                ? { width: 240, height: 40 }
                                : { width: 180, height: 30 }
                        }
                    />
                    
                ) : (
                    carouselImages.map(function(item, index) {
                        const src = item.file
                            ? resourceUrl(item.file, {
                                  type: 'image-product',
                                  width: IMAGE_WIDTH
                              })
                            : logoUrl();
                        
                        return (
                            <div
                                key={item.file}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: '#ffffff'
                                }}
                                className="carousel-image-container"
                            >
                                {placeHoder ? <ImageLoading height={445}  /> : null}
                                <img
                                    src={src}
                                    width={IMAGE_WIDTH}
                                    alt={item.url}
                                    style={{ objectFit: 'contain' }}
                                    onLoad={()=> setPlaceholder(false)}
                                />

                                

                                {/* {index == 0 ? 
                                <ProductLabel productLabel = {product.mp_label_data.length > 0 ? product.mp_label_data : null} />
                            : null} */}

                            </div>
                        );
                    })
                )}
            </Carousel>
            
            {/* <ProductLabel imageWidth={imageWidth} productLabel = {loading ? null : data.products.items[0].mp_label_data} /> */}
            <ProductLabel imageWidth={imageWidth} productLabel = {data && data.products && data.products.items[0] && data.products.items[0].mp_label_data ? data.products.items[0].mp_label_data : null} />

            {renderLightBox && renderImageLightboxBlock()}
            
        </div>
    );
};

export default ProductImageCarousel;