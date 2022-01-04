export const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const capitalizeEachWords = string => {
    let words = string.split(' ');
    words = words.map(word => capitalizeFirstLetter(word));
    return words.join(' ');
};

export const randomString = (charCount = 20) => {
    let text = '';
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < charCount; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return btoa(text + Date.now());
};
