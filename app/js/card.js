var interval = 10, redrawDelay, bsTimer;

setTimeout(function () {
    if (main_script) {
        continueLoading();
    } else {
        setTimeout(arguments.callee, interval);
    }
}, interval);


function continueLoading() {

    initCardSliders();

    initTabScroller();

    initToddlers();

    drawCharts();

    setSlideBS($('.slideBS'));
}

$(window).resize(function () {

    clearTimeout(redrawDelay);
    
    clearTimeout(bsTimer);

    bsTimer = setTimeout(function () {
        setSlideBS($('.slideBS'));
    }, 5);
    
    if (update_charts) {
        redrawDelay = setTimeout(function () {
            drawCharts();
        }, 10);
    }
});
