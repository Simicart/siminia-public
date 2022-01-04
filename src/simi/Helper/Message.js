export const showToastMessage = (message, time = 4000) => {
    document.getElementById('toast-message-content').innerHTML = message;
    document.getElementById('toast-message-global').style.display = 'flex';
    setTimeout(function() {
        document.getElementById('toast-message-content').innerHTML = '';
        document.getElementById('toast-message-global').style.display = 'none';
    }, time);
};
