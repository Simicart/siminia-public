export const getBottomInsets = () => {
    let bottomInsets = 0;
    try {
        if (window.simicartRNinsets) {
            const simicartRNinsets = JSON.parse(window.simicartRNinsets);
            bottomInsets = parseInt(simicartRNinsets.bottom);
        } else if (window.simpifyRNinsets) {
            const simpifyRNinsets = JSON.parse(window.simpifyRNinsets);
            bottomInsets = parseInt(simpifyRNinsets.bottom);
        }
    } catch (err) {}

    return bottomInsets
}