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

function initComplexSliders(callback) {

    $('.complexGallery').each(function (ind) {
        var sld = $(this);

        sld.find('.complexSlider').slick({
            dots: true,
            // infinite: false,
            arrows: false,
            zIndex: 1,
            // autoplay: true,
            autoplaySpeed: 1000,
            initialSlide: 0,
            slidesToShow: 1,
            slide: '.slide',
            appendDots: sld.find('.complexPagination'),
            variableWidth: false,
            touchThreshold: 10,
            onInit: function (sld) {
                setSlideBS(sld.$slider.find('.slideBS'));
            }
        });

        sld.on('mouseenter', function () {
            $(this).find('.complexSlider').slickPlay();
        }).on('mouseleave', function () {
            $(this).find('.complexSlider').slickPause();
        });

    });

    if (typeof callback == 'function') {
        setTimeout(function () {
            callback();
        }, 10);
    }
}

function initToddlers() {
    var canUpdate = true;

    $('.filterToddler').each(function (ind) {
        var tdlr = $(this),
            filter = tdlr.closest('.filterBlock'),
            min = parseInt(tdlr.attr('data-min')) || 0,
            max = parseInt(tdlr.attr('data-max')) || 10;

        initDynamicWidth(filter.find('input.val'));

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
                filter = target.closest('.filterBlock'),
                plural = target.attr('data-plural'),
                plural_text = target.attr('data-plural-text') || '',
                format = target.attr('data-format') || '',
                suffix_1 = target.attr('data-suffix_1') || '',
                suffix_2 = target.attr('data-suffix_2') || '',
                val_1 = parseInt(values[0]),
                val_2 = parseInt(values[1]),
                plural_1 = '',
                plural_2 = '',
                arr = [];

            if (plural != void 0) {
                arr = plural.split(',');
                plural_1 = plural.length > 0 ? getPural(val_1, arr[0], arr[1], arr[2]) : '';
                plural_2 = plural.length > 0 ? getPural(val_2, arr[0], arr[1], arr[2]) : '';

            } else if (plural_text.length) {
                plural_1 = plural_2 = plural_text;
            }

            if (canUpdate) {
                resize(filter.find('.start .val').val(
                    (format ? ('money' == format ? moneyFormat(val_1.toString()) : val_1) : val_1) +
                    suffix_1
                ));

                resize(filter.find('.end .val').val(
                    (format ? ('money' == format ? moneyFormat(val_2.toString()) : val_2) : val_2) +
                    suffix_2
                ));
            }

            filter.find('.min').html(
                (format ? ('money' == format ? moneyFormat(val_1.toString()) : val_1) : val_1) + ' ' +
                plural_1
            );

            filter.find('.max').html(
                (format ? ('money' == format ? moneyFormat(val_2.toString()) : val_2) : val_2) + ' ' +
                plural_2
            );
        });

        filter.find('.start input.val').on('keyup keypress change update', function () {
            canUpdate = false;
            tdlr[0].noUiSlider.set([toNum($(this).val()), null]);
        }).on('blur', function () {
            canUpdate = true;
            tdlr[0].noUiSlider.set([toNum($(this).val()), null]);
        });

        filter.find('.end input.val').on('keyup keypress change update', function () {
            canUpdate = false;
            tdlr[0].noUiSlider.set([null, toNum($(this).val())]);
        }).on('blur', function () {
            canUpdate = true;
            tdlr[0].noUiSlider.set([null, toNum($(this).val())]);
        });

        filter.find('.toddlerSelect').each(function (ind) {
            var slct = $(this), target = filter.find(slct.attr('data-target'));

            slct.on('change', function (e) {
                var _this = $(this);
                canUpdate = true;

                if (_this.attr('data-target') == '.start') {
                    tdlr[0].noUiSlider.set([_this.val(), null]);
                } else if ($(this).attr('data-target') == '.end') {
                    tdlr[0].noUiSlider.set([null, _this.val()]);
                }

            }).select2({
                minimumResultsForSearch: Infinity,
                dropdownParent: target,
                width: '100%',
                language: {
                    noResults: function (e, r) {
                        return 'Нет результатов';
                        // return "Город не найден. <a href='#' class='gl_link _clr_turqoise'>Список городов</a>";
                    }
                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                adaptDropdownCssClass: function () {
                    return slct.attr('data-dropdown-class');
                }
            });

            target.on('click', function () {
                slct.select2('open');
                return false;
            });
        });

    });
}

$(window).resize(function () {
    clearTimeout(bsTimer);
    
    bsTimer = setTimeout(function () {
        setSlideBS($('.slideBS'));
    }, 5);
});