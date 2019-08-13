export const showToastMessage = (message,time = 4000) => {
    $('#toast-message-content').text(message);
    $('#toast-message-global').show();
    setTimeout(function () {
        $('#toast-message-content').text("");
        $('#toast-message-global').hide();
    },time );
}