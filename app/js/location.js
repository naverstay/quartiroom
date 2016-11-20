var interval = 10, redrawDelay;
setTimeout(function () {
    if (main_script) {
        continueLoading();
    } else {
        setTimeout(arguments.callee, interval);
    }
}, interval);


function continueLoading() {

    initLocationSlider();

    initTabScroller();

    initToddlers();

    drawCharts();

}

$(window).resize(function () {

    clearTimeout(redrawDelay);

    if (update_charts) {
        redrawDelay = setTimeout(function () {
            drawCharts();
        }, 10);
    }
});