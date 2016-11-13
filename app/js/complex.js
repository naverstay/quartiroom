var interval = 10, slickTimer, bsTimer;

setTimeout(function () {
    if (main_script) {
        continueLoading();
    } else {
        setTimeout(arguments.callee, interval);
    }
}, interval);

function continueLoading() {

    initToddlers();

    initTypeSelect();

    initComplexSliders(function () {
        initTabs();
    });

    if ($('#region_popup').length) {
        initRegionPopup();
    }
}

$(window).resize(function () {
    clearTimeout(bsTimer);
    
    bsTimer = setTimeout(function () {
        setSlideBS($('.slideBS'));
    }, 5);
});