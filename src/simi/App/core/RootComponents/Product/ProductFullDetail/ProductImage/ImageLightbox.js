import React from 'react';
import Lightbox from 'react-image-lightbox';

class ImageLightbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            photoIndex: 0,
            isOpen: false
        };
    }

    showLightbox = (index = 0) => {
        this.setState({
            photoIndex: index,
            isOpen: true
        });
    };

    render() {
        const { photoIndex, isOpen } = this.state;
        if (!this.props || !this.props.images) {
            return <div />;
        }
        const images = this.props.images.map(image => image.url);
        return (
            <div>
                {isOpen && (
                    <Lightbox
                        clickOutsideToClose={false}
                        mainSrc={images[photoIndex]}
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        prevSrc={
                            images[
                                (photoIndex + images.length - 1) % images.length
                            ]
                        }
                        mainSrcThumbnail={images[photoIndex]}
                        nextSrcThumbnail={
                            images[(photoIndex + 1) % images.length]
                        }
                        prevSrcThumbnail={
                            images[
                                (photoIndex + images.length - 1) % images.length
                            ]
                        }
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex:
                                    (photoIndex + images.length - 1) %
                                    images.length
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % images.length
                            })
                        }
                    />
                )}
            </div>
        );
    }
}
export default ImageLightbox;
