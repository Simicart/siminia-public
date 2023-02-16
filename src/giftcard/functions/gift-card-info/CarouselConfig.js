//image style of carousel
const imgStyles = {
    width: "100%",
    height: 160,
    objectFit: "cover",
    cursor: 'pointer'
};

//selected image style
const selectedImgStyles = {
    width: "100%",
    height: 160,
    objectFit: "cover",
    cursor: 'pointer',
    border: '3px solid gold',
    padding: 5
}

//carousel configuration
const settings = {
    lazyload: true,
    nav: false,
    controlText: ['', ''],
    prevButton: '.gift-card-prev-template',
    nextButton: '.gift-card-next-template',
    mouseDrag: true,
    loop: false,
    items: 3,
    gutter: 10,
    responsive: {
    420: {
        items: 2
        }
    }
};

const loadingImage ="data:image/gif;base64,\R0lGODlhAQABAPAAAMzMzAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

export { imgStyles, selectedImgStyles, settings, loadingImage }