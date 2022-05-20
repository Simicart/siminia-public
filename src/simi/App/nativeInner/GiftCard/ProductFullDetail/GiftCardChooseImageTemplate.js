import React, { useState, useEffect } from 'react';
import { uploadGiftCardImage } from '../talons/uploadGiftCardImage';
import Loading from '../images/loading.jpg';
import { useResizeDetector } from 'react-resize-detector';

const GiftCardChooseImageTemplate = props => {
    const { giftCardActions, giftCardData, classes } = props;

    const {
        setActiveImage,
        setUploadedImages,
        setUploadedImageUrls
    } = giftCardActions;

    const {
        activeImage,
        uploadedImages,
        uploadedImageUrls,
        currentTemplate
    } = giftCardData;

    const { width, ref } = useResizeDetector();

    const [translateOwlStage, setTranslateOwlStage] = useState(0);
    const [disabledPrev, setDisabledPrev] = useState(true);
    const [disabledNext, setDisabledNext] = useState(false);
    // const [uploadedImageUrl, setUploadedImageUrl] = useState()

    const {
        uploadGcImage,
        uploadGcImageLoading,
        uploadGcImageData,
        uploadGcImageErrorMessage
    } = uploadGiftCardImage();

    const canUpload = currentTemplate.canUpload || false;
    const images = currentTemplate.images || [];

    const initialTransDistance = (width - 75) * 0.5 - 5;
    const itemWidth = ((width + 75) / 2 - 20) / 3;
    const owlStageStep = itemWidth + 10;

    useEffect(() => {
        setTranslateOwlStage(initialTransDistance);
    }, [width, images]);

    useEffect(() => {
        setDisabledPrev(true);
        setDisabledNext(false);
        setActiveImage(0);
    }, [images]);

    useEffect(() => {
        if (uploadGcImageData) {
            let urls = uploadedImageUrls;
            urls.push(uploadGcImageData.uploadMpGiftCardImage.file);
            setUploadedImageUrls(urls);
        }
    }, [uploadGcImageData]);

    const prevTemplateImage = () => {
        setDisabledNext(false);
        if (
            translateOwlStage < 1.2 * initialTransDistance &&
            translateOwlStage > 0.8 * initialTransDistance
        ) {
            return;
        } else if (
            translateOwlStage < initialTransDistance - 0.8 * owlStageStep &&
            translateOwlStage > initialTransDistance - 1.2 * owlStageStep
        ) {
            setDisabledPrev(true);
            setTranslateOwlStage(translateOwlStage + owlStageStep);
        } else {
            setTranslateOwlStage(translateOwlStage + owlStageStep);
        }
    };

    const nextTemplateImage = () => {
        setDisabledPrev(false);
        if (
            translateOwlStage <
                initialTransDistance - (images.length - 1.2) * owlStageStep &&
            translateOwlStage >
                initialTransDistance - (images.length - 0.8) * owlStageStep
        ) {
            return;
        } else if (
            translateOwlStage <
                initialTransDistance - (images.length - 2.2) * owlStageStep &&
            translateOwlStage >
                initialTransDistance - (images.length - 1.8) * owlStageStep
        ) {
            setDisabledNext(true);
            setTranslateOwlStage(translateOwlStage - owlStageStep);
        } else {
            setTranslateOwlStage(translateOwlStage - owlStageStep);
        }
    };

    const handleUploadImage = e => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            const name = e.target.files[0].name;
            reader.onload = event => {
                // setUploadedImageUrl(event.target.result)
                uploadGcImage({
                    variables: {
                        url: event.target.result,
                        name: name
                    }
                })
                    .then(() => {})
                    .catch(() => {});
                let srcs = uploadedImages;
                srcs.push(event.target.result);
                setUploadedImages(srcs);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <React.Fragment>
            <div
                className={classes['giftcard-template-choose-images']}
                style={{ height: !images.length ? '0px' : 'unset' }}
                ref={ref}
            >
                <link
                    href="https://use.fontawesome.com/releases/v5.0.2/css/all.css"
                    rel="stylesheet"
                />
                <div className={classes['owl-stage-outer']}>
                    <div
                        className={classes['owl-stage']}
                        style={{
                            transform: `translateX(${translateOwlStage}px)`
                        }}
                    >
                        {images.map((image, i) => {
                            let active = '';
                            if (activeImage === i) {
                                active = classes['active-image'];
                            }
                            return (
                                <div
                                    className={classes['owl-item']}
                                    style={{ width: `${itemWidth}px` }}
                                    key={i + 1}
                                >
                                    <div className={classes.image}>
                                        <div
                                            className={
                                                classes[
                                                    'template-image-wrapper'
                                                ] +
                                                ' ' +
                                                active
                                            }
                                            onClick={() => setActiveImage(i)}
                                        >
                                            <img
                                                className={
                                                    classes['template-image']
                                                }
                                                src={image.src}
                                                alt={image.alt}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {images.length > 3 && (
                    <div className={classes['owl-nav']}>
                        <button
                            type="button"
                            role="presentation"
                            className={`${classes['owl-prev']} ${
                                disabledPrev ? classes.disable : ''
                            }`}
                            onClick={prevTemplateImage}
                        >
                            <i className="fa fa-chevron-left" />
                        </button>
                        <button
                            type="button"
                            role="presentation"
                            className={`${classes['owl-next']} ${
                                disabledNext ? classes.disable : ''
                            }`}
                            onClick={nextTemplateImage}
                        >
                            <i className="fa fa-chevron-right" />
                        </button>
                    </div>
                )}
            </div>
            {canUpload && (
                <div className={classes['giftcard-template-upload']}>
                    <label>
                        <span>Or upload your photo</span>
                        <div className="field-tooltip toggle">
                            <span
                                className="field-tooltip-action"
                                data-bind="mageInit: {'dropdown':{'activeClass': '_active'}}"
                                aria-expanded="false"
                                role="button"
                                tabIndex="0"
                            />
                            {/*<div className="field-tooltip-content" data-bind="html: uploadTooltip">Acceptable formats are jpg, png and gif. Limit Image Size Upload (2MB)</div>*/}
                        </div>
                    </label>
                    <div
                        id={classes['giftcard-template-upload-image']}
                        className={classes['giftcard-template-upload-image']}
                    >
                        {uploadedImages.length
                            ? uploadedImages.map((image, i) => {
                                  let active = '';
                                  if (activeImage === images.length + i) {
                                      active = classes['active-image'];
                                  }
                                  return (
                                      <div
                                          className={classes.image}
                                          key={i + 1}
                                      >
                                          <div
                                              className={
                                                  classes[
                                                      'template-image-wrapper'
                                                  ] +
                                                  ' ' +
                                                  active
                                              }
                                              onClick={() =>
                                                  setActiveImage(
                                                      images.length + i
                                                  )
                                              }
                                          >
                                              <img
                                                  className={
                                                      classes['template-image']
                                                  }
                                                  src={image}
                                                  alt="Gift Card Image"
                                              />
                                          </div>
                                      </div>
                                  );
                              })
                            : null}
                        <div
                            className={
                                classes['image'] +
                                ' ' +
                                classes['item-template']
                            }
                        >
                            <div className={classes['fileinput-button']}>
                                {!uploadGcImageLoading ? (
                                    <i
                                        className={`fa fa-camera + ${
                                            classes['image-placeholder']
                                        }`}
                                    />
                                ) : (
                                    <img
                                        src={Loading}
                                        alt="loading"
                                        style={{ width: '100%' }}
                                    />
                                )}
                                <input
                                    id={classes.fileupload}
                                    type="file"
                                    name="image"
                                    onChange={handleUploadImage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default GiftCardChooseImageTemplate;
