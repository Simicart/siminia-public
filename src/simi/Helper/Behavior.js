export const smoothScrollToView = querySelector => {
    if (
        querySelector &&
        (querySelector.offsetTop || querySelector.offsetTop === 0)
    ) {
        window.scroll({
            top: querySelector.offsetTop,
            left: 0,
            behavior: 'smooth'
        });
    }
};
