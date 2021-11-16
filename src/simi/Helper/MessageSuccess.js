export const showToastSuccess = (message,time = 4000) => {
    $('#toast-success-content').text(message);
    $('#toast-success-global').show();
    setTimeout(function () {
        $('#toast-success-content').text("");
        $('#toast-success-global').hide();
    },time );
}