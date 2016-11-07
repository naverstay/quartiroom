var interval = 10; // ms
setTimeout(function () {
    if (main_script) {
        continueLoading();
    } else {
        setTimeout(arguments.callee, interval);
    }
}, interval);


function continueLoading() {

    initTabs(function () {

        var gallery = $('.locationGallery');
        
        gallery.find('.locationSlider').slick({
            dots: false,
            infinite: false,
            arrows: true,
            zIndex: 1,
            initialSlide: 0,
            slide: '.slide',
            // variableWidth: false,
            touchThreshold: 10,
            onInit: function (sld) {

            }
        });


    });

}

