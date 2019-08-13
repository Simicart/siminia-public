export const smoothScrollToView = (querySelector, duration = 350) => {
    if(querySelector && querySelector.offset() instanceof Object){
        const offsetTop = querySelector.offset().top;
        const offset = offsetTop;
        $('html, body').animate({
            scrollTop: offset
        }, duration);
    }
}

