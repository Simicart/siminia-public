import React, { Component } from 'react';
import Image from 'src/simi/BaseComponents/Image';
require('./simiImageLightbox.scss');
import {
    X as XIcon,
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
    ChevronRight,
    ChevronLeft
} from 'react-feather';

class SimiImageLightbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            indexSlide: 0,
            zoom: 1
        };
    }

    handleZoom = type => {
        let { zoom } = this.state;
        if (type === 'in') {
            zoom = zoom + 1;
        } else {
            if (zoom === 1) return;
            zoom = zoom - 1;
        }
        this.setState({ zoom });
    };

    closeLightbox = () => {
        this.setState({ open: false, zoom: 1 });
    };

    showLightbox = (indexSlide = 0) => {
        this.setState({ open: true, indexSlide });
    };

    handlePlusSlide = n => {
        const { indexSlide } = this.state;
        const { images } = this.props;
        let newSlideIndex = indexSlide + n;
        if (newSlideIndex < 0) {
            newSlideIndex = images.length - 1;
        } else if (newSlideIndex > images.length - 1) {
            newSlideIndex = 0;
        }
        this.showSlides(newSlideIndex);
    };

    handleClickOutSideModal = e => {
        if (this.imageWrapper && !this.imageWrapper.contains(e.target)) {
            this.setState({ open: false });
        }
    };

    handleCurrentSlide = n => {
        this.showSlides((this.slideIndex = n));
    };

    showSlides = n => {
        this.setState({ indexSlide: n, zoom: 1 });
    };

    renderImages() {
        const { indexSlide, zoom } = this.state;
        const { images } = this.props;
        return images.map((image, index) => {
            let style = { display: 'none' };
            if (indexSlide === index) {
                style = {
                    display: 'block',
                    transform: `scale3d(${zoom}, ${zoom}, 1)`
                };
            }
            if (typeof image === 'object')
                return (
                    <Image
                        key={index}
                        src={image.url}
                        alt={image.url}
                        fallBackUrl={image.fallBackUrl}
                        style={style}
                    />
                );
            return <Image key={index} src={image} alt={image} style={style} />;
        });
    }

    render() {
        const { open } = this.state;

        return (
            <div
                id="myModal"
                className={`lighbox-modal modal ${open ? 'active' : ''}`}
            >
                <div className="bar-icon">
                    <button
                        className="zoom-in cursor"
                        onClick={() => this.handleZoom('in')}
                    >
                        <ZoomInIcon />
                    </button>
                    <button
                        className="zoom-out cursor"
                        onClick={() => this.handleZoom('out')}
                    >
                        <ZoomOutIcon />
                        <i className="icon-circle-minus" />
                    </button>
                    <button
                        className="close-icon cursor"
                        onClick={this.closeLightbox}
                    >
                        <XIcon />
                    </button>
                </div>

                <div className="modal-content">
                    <div className="images-wrapper">{this.renderImages()}</div>
                    <button
                        className="prev"
                        onClick={() => this.handlePlusSlide(-1)}
                    >
                        {/* &#10094; */}
                        <ChevronLeft/>
                    </button>
                    <button
                        className="next"
                        onClick={() => this.handlePlusSlide(1)}
                    >
                        {/* &#10095; */}
                        <ChevronRight/>
                    </button>
                </div>
            </div>
        );
    }
}

export default SimiImageLightbox;
