export const showToastSuccess = (message, time = 4000) => {
    document.getElementById('toast-success-content').innerHTML = message;
    document.getElementById('toast-success-global').style.display = 'flex';
    setTimeout(function() {
        document.getElementById('toast-success-content').innerHTML = '';
        document.getElementById('toast-success-global').style.display = 'none';
    }, time);
};
