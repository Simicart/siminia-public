import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import Identify from "src/simi/Helper/Identify";
import memoize from 'memoize-one';
import isProductConfigurable from 'src/util/isProductConfigurable';
import { resourceUrl, getUrlBuffer } from 'src/simi/Helper/Url'
import findMatchingVariant from 'src/util/findMatchingProductVariant';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import ImageLightbox from "./ImageLightbox";

require('./style.scss');

const $ = window.$;

class ProductImage extends React.Component {
    state = {
        renderLightBox: false,
        autoToggleLightBox: false
    }

    constructor(props) {
        super(props);
        this.title = this.props.title || 'Alt';
        this.showThumbs = this.props.showThumbs || true;
        this.showArrows = this.props.showArrows || true;
        this.showIndicators = this.props.showIndicators || false;
        this.autoPlay = this.props.autoPlay || true;
        this.showStatus = this.props.showStatus || true;
        this.itemClick = this.props.itemClick || function (e) {
        };
        this.onChange = this.props.onChange || function (e) {
        };
        this.onClickThumb = this.props.onClickThumb || function (e) {
        };
        this.defaultStatusFormatter = function defaultStatusFormatter(current, total) {
            return Identify.__('%c of %t').replace('%c', current).replace('%t', total);
        };
        this.statusFormatter = this.props.statusFormatter || this.defaultStatusFormatter;
        this.infiniteLoop = this.props.infiniteLoop || false;
        this.imageWidth = (props && props.isPhone) ? 375 : 640;

    }

    openImageLightbox = (index) => {
        if (this.lightbox)
            this.lightbox.showLightbox(index);
        else
            this.setState({ renderLightBox: true, autoToggleLightBox: index });
    }

    componentDidUpdate() {
        if (this.lightbox && (this.state.autoToggleLightBox !== false)) {
            this.lightbox.showLightbox(this.state.autoToggleLightBox);
            this.setState({ autoToggleLightBox: false });
        }
    }

    renderImageLightboxBlock = () => {
        let images = this.images
        images = images.map((item) => {
            return {
                url: item.file ? resourceUrl(item.file, { type: 'image-product', width: 640 }) : transparentPlaceholder,
                fallBackUrl: getUrlBuffer() + '/media/catalog/product' + item.file
            }
        }, this);
        return (
            <ImageLightbox ref={(lightbox) => {
                this.lightbox = lightbox
            }} images={images} />
        );
    }

    renderImage() {
        const width = $('.left-layout.product-media').width();
        return this.images.map(function (item) {
            const src = item.file
                ? resourceUrl(item.file, { type: 'image-product', width: this.imageWidth })
                : transparentPlaceholder
            return (
                <div key={Identify.randomString(5)} style={{ cursor: 'pointer', backgroundColor: '#ffffff' }} className="carousel-image-container">
                    <img width={width} src={src} height={width} alt={item.url}
                        style={{ objectFit: 'scale-down' }}
                    />
                </div>
            );
        }, this)
    }

    onChangeItemDefault = () => {

    }

    onClickThumbDefault = () => {

    }

    sortAndFilterImages = memoize(items =>
        items
            .filter(i => !i.disabled)
            .sort((a, b) => {
                const aPos = isNaN(a.position) ? 9999 : a.position;
                const bPos = isNaN(b.position) ? 9999 : b.position;
                return aPos - bPos;
            })
    );

    mediaGalleryEntries = () => {
        const { props } = this;
        const { optionCodes, optionSelections, product } = props;
        const { variants } = product;
        const isConfigurable = isProductConfigurable(product);

        const media_gallery_entries = product.media_gallery_entries ?
            product.media_gallery_entries : product.small_image ?
                [{ file: product.small_image, disabled: false, label: '', position: 1 }] : []

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
        const returnedImages = []
        var obj = {};
        images.forEach(image => {
            if (!obj[image.file]) {
                obj[image.file] = true
                returnedImages.push(image)
            }
        })

        return returnedImages
    }


    sortedImages() {
        const images = this.mediaGalleryEntries();
        return this.sortAndFilterImages(images);
    }

    renderJs = () => {
        $(document).ready(function () {
            const carousel = $('.carousel.carousel-slider');
            const mediaWidth = carousel.width();
            carousel.height(mediaWidth);
            $('.carousel.carousel-slider img').height(mediaWidth);
        });
    }

    render() {
        this.images = this.sortedImages()
        const { images } = this;

        return (
            <div className="product-detail-carousel">
                <Carousel
                    key={(images && images[0] && images[0].file) ? images[0].file : Identify.randomString(5)}
                    showArrows={this.showArrows}
                    showThumbs={this.showThumbs}
                    showIndicators={this.showIndicators}
                    showStatus={this.showStatus}
                    onClickItem={(e) => this.openImageLightbox(e)}
                    onClickThumb={(e) => this.onClickThumbDefault(e)}
                    onChange={(e) => this.onChangeItemDefault(e)}
                    infiniteLoop={true}
                    autoPlay={this.autoPlay}
                    thumbWidth={80}
                    statusFormatter={this.statusFormatter}
                >
                    {this.renderImage()}
                </Carousel>
                {this.state.renderLightBox && this.renderImageLightboxBlock()}
                {this.renderJs()}
            </div>

        );
    }
}

export default ProductImage;
