var interval = 10; // ms

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

    initTabs();

    initComplexSliders();
}

function initComplexSliders() {

    $('.complexGallery').each(function (ind) {
        var sld = $(this);

        sld.find('.complexSlider').slick({
            dots: true,
            infinite: false,
            arrows: false,
            zIndex: 1,
            initialSlide: 0, 
            slidesToShow: 1,
            slide: '.slide',
            appendDots: sld.find('.complexPagination'),
            variableWidth: false,
            touchThreshold: 10,
            onInit: function (sld) {
               
            }
        })

    });
}

function initToddlers() {

    $('.filterToddler').each(function (ind) {
        var tdlr = $(this), min = parseInt(tdlr.attr('data-min')) || 0, max = parseInt(tdlr.attr('data-max')) || 10;

        noUiSlider.create(this, {
            start: [max * .2, max * .8],
            connect: true,
            range: {
                'min': min,
                'max': max
            }
        });

        this.noUiSlider.on('update', function (values, handle) {
            var target = $(this.target),
                plural = target.attr('data-plural'),
                format = target.attr('data-format') || '',
                suffix = target.attr('data-suffix') || '',
                filter = target.closest('.filterBlock'),
                val_1 = parseInt(values[0]),
                val_2 = parseInt(values[1]),
                plural_1 = '',
                plural_2 = '',
                arr = [];

            if (plural != void 0) {
                arr = plural.split(',');
                plural_1 = plural.length > 0 ? getPural(val_1, arr[0], arr[1], arr[2]) : '';
                plural_2 = plural.length > 0 ? getPural(val_2, arr[0], arr[1], arr[2]) : '';
            } else {
                plural = '';
            }

            filter.find('.start').text(
                (format ? ('money' == format ? moneyFormat(val_1.toString()) : val_1) : val_1)
            );

            filter.find('.end').text(
                (format ? ('money' == format ? moneyFormat(val_2.toString()) : val_2) : val_2) +
                suffix || ''
            );

            filter.find('.min').text(
                (format ? ('money' == format ? moneyFormat(val_1.toString()) : val_1) : val_1) + ' ' +
                plural_1
            );

            filter.find('.max').text(
                (format ? ('money' == format ? moneyFormat(val_2.toString()) : val_2) : val_2) + ' ' +
                plural_2
            );

        });


    });


}