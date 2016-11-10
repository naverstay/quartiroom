var interval = 10; // ms
setTimeout(function () {
    if (main_script) {
        continueLoading();
    } else {
        setTimeout(arguments.callee, interval);
    }
}, interval);


function continueLoading() {

    initCardSliders();


}


function initCardSliders(callback) {

    initTabs(function () {

        $('.objectCardSlider').slick({
            dots: false,
            // infinite: false,
            arrows: false,
            zIndex: 1,
            // autoplay: true,
            // autoplaySpeed: 1000,
            initialSlide: 0,
            slidesToShow: 1,
            slide: '.slide',
            variableWidth: false,
            touchThreshold: 10,
            asNavFor: '.objectThumbsSlider',
            responsive: [
                {
                    breakpoint: 600,
                    settings: {
                        arrows: true
                    }
                }
            ],
            onInit: function (sld) {

            }
        });

        $('.objectThumbsSlider').slick({
            dots: false,
            // infinite: false,
            arrows: true,
            zIndex: 1,
            // autoplay: true,
            // autoplaySpeed: 1000,
            initialSlide: 0,
            slide: '.slide',
            variableWidth: false,
            touchThreshold: 10,
            asNavFor: '.objectCardSlider',
            slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ],
            onInit: function (slick) {
                slick.$slides.eq(slick.currentSlide).addClass('current');

            },
            onBeforeChange: function (slick, event, currentSlide, nextSlide) {
                slick.$slides.removeClass('current').eq(currentSlide).addClass('current');
            }
        });

    });

    if (typeof callback == 'function') {
        setTimeout(function () {
            callback();
        }, 10);
    }
}