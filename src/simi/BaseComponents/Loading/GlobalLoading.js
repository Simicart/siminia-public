export function showFogLoading() {
    $(document).ready(function () {
        $('#app-loading').css({display: 'flex'});
    });
}

export function hideFogLoading() {
    $(document).ready(function () {
        $('#app-loading').css({display: 'none'});
    });
}