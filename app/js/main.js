var body, html, doc, wnd,
    ie,
    header,
    main_script = false,
    closeMenuTimer,
    callback_popup,
    auth_popup,
    fail_popup,
    success_popup,
    quick_search_popup,
    add2cart_popup,
    recovery_popup;

function ieCheck() {

    var myNav = navigator.userAgent.toLowerCase(),
        html = document.documentElement;

    if ((myNav.indexOf('msie') != -1)) {
        ie = ((myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false);
        html.className += 'ie ie' + ie;
    } else if (!!myNav.match(/trident.*rv\:11\./)) {
        ie = 11;
        html.className += 'ie ie' + ie;
    }

    if (myNav.indexOf('safari') != -1) {
        if (myNav.indexOf('chrome') == -1) {
            html.className += ' safari';
        } else {
            html.className += ' chrome';
        }
    }

    if (myNav.indexOf('firefox') != -1) {
        html.className += ' firefox';
    }

    if ((myNav.indexOf('windows') != -1)) {
        html.className += ' windows';
    }
}

ieCheck();

if (ie == 8) {
    window.onload = new function () {  // дубль функции $(window).on('load'... для ИЕ 
        domReady();

        main_script = true;

        setTimeout(function () {
            svg_fallback();
        }, 1000);
    };
} else {
    $(function ($) {

        if (!main_script) {
            main_script = true;
            domReady();
        }
    });
}

function domReady() {

    doc = $(document);
    wnd = $(window);
    html = $('html');
    body = $('body');
    header = $('.header');

    body.delegate('.openMobMenu', 'click', function () {
        clearTimeout(closeMenuTimer);

        if (body.hasClass('menu_opened')) {
            closeMenuTimer = setTimeout(function () {
                body.removeClass('icon_close');
            }, 250);
        }

        body.addClass('icon_close').toggleClass('menu_opened');
        return false;

    }).delegate('.answerBtn', 'click', function () {
        var btn = $(this), txt = btn.attr('data-text-toggle');

        btn.attr('data-text-toggle', btn.text());

        btn.toggleClass('changed').text(txt).closest('.reviewFooter').find('.reviewAnswer').slideToggle(300);

        return false;
    }).delegate('.advSearchBtn', 'click', function () {
        var btn = $(this), txt = btn.attr('data-text-toggle');

        btn.attr('data-text-toggle', btn.text());

        btn.toggleClass('changed').text(txt);

        $('.advSearchBlock').slideToggle(300);

        return false;
    }).delegate('.collapseBlockBtn', 'click', function () {

        $(this).closest('.companyBlock').toggleClass('opened').find('.infoBlock').slideToggle(300);

        return false;

    }).delegate('.showMoreBtn', 'click', function () {

        $(this).hide().closest('.objectsList').toggleClass('show_all');

        return false;

    }).delegate('.moreInfoBtn', 'click', function () {

        $(this).hide().closest('.infoItem').find('.moreInfo').slideToggle(0);

        return false;

    }).delegate('.favBtn', 'click', function () {

        $(this).find('span').toggleClass('i-heart-filled');

        return false;

    }).delegate('.menuItem', 'mouseenter', function () {
        $(this).addClass('hovered');
    }).delegate('.menuItem', 'mouseleave', function () {
        $(this).removeClass('hovered');
    }).delegate('.menuItem', 'click', function () {
        $(this).toggleClass('hovered');
    }).delegate('.dropdownControl .dropdown-val', 'click', function () {
        $(this).closest('.dropdownControl').toggleClass('opened').find('input:first').focus();
    });

    doc.on('click', function (e) {
        if ($(e.target).parents().filter('.dropdownControl').length != 1) {
            $('.dropdownControl').removeClass('opened');
        }
    });

    $('.scrollTo').on('click', function () {
        docScrollTo($($(this).attr('href')).offset().top - header.height(), 500);

        return false;
    });

    initSelect2();

    initMask();

    all_dialog_close();

}

function initTabScroller() {

    var tabBlock = $('.scrollerTabs'), tabs, tabSlider;

    tabSlider = $('.tabScroller').slick({
        dots: false,
        infinite: false,
        arrows: false,
        zIndex: 1,
        initialSlide: 0,
        slide: '.filter-item',
        variableWidth: true,
        touchThreshold: 10,
        onInit: function (sld) {
            tabs = tabBlock.tabs({
                active: 0,
                activate: function (e, u) {
                    slickUpdate();
                }
            });
        }
    });
}

function svg_fallback() { // замена СВГ на ПНГ 
    if (html.hasClass('ie8')) {
        $('img[src$=".svg"]').each(function (ind) {
            var img = $(this);
            img.attr('src', img.attr('src').replace(/\.svg$/, '.png'));
        });
    }
}

function initAutoComplete(el, options) {

    el.easyAutocomplete(options);

}

function moneyFormat(str) {
    return str.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}

function getPural(n, str1, str2, str5) {
    return ' ' + ((((n % 10) == 1) && ((n % 100) != 11)) ? (str1) : (((((n % 10) >= 2) && ((n % 10) <= 4)) && (((n % 100) < 10) || ((n % 100) >= 20))) ? (str2) : (str5)))
}

function initPriceRange() {
    var range_val = $('#range_val'), range_start = $('#range_start'), range_end = $('#range_end');

    $('.searchRangeVal').on('change cut paste drop keydown', function () {
        setTimeout(function () {
            var start = (range_start.val()) || 0, end = (range_end.val()) || 0;

            if (!start && !end) {
                range_val.text('Цена');
            } else {
                range_val.text('от ' + start + ' до ' + end);
            }

        }, 5);
    });
}

function initTypeSelect() {
    $('.typeSelect').on('change', function () {
        var firedEl = $(this), val = firedEl.val(), str = '',
            multi = firedEl.attr('multiple'),
            slct = multi ? firedEl.next('.select2').find('.select2-search--inline') : firedEl.next('.select2').find('.select2-selection__rendered'),
            preservePlaceholder = firedEl.attr('data-preserve-placeholder');


        if (val) {
            for (var i = 0; i < val.length; i++) {
                str += ', ' + val[i];
            }

            str = str.replace(/^.{2}/, '');
        }

        if (multi) {
            if (slct.find('span').length) {
                slct.find('span').text(str);
            } else {
                slct.prepend('<span>' + str + '</span>')
            }
        }

        if (preservePlaceholder) {
            if (multi) {
                if (!slct.find('.placeholder').length) {
                    slct.find('span').prepend('<span class="placeholder">' + firedEl.attr('data-placeholder') + ' </span>')
                }
            } else {
                if (!slct.find('.placeholder').length) {
                    slct.prepend('<span class="placeholder">' + firedEl.attr('data-placeholder') + ' </span>')
                }
            }
        }

        if (str.length) {
            slct.find('input').hide();
            slct.find('.placeholder').show();
        } else {
            slct.find('input').show();
            slct.find('.placeholder').hide();
        }

    });
}

function setSectionBS() {
    var section = $('.sectionBS');

    section.each(function () {
        var sctn = $(this);
        sctn.backstretch(getBSImg(sctn), {fade: 0});
    });
}

function docScrollTo(pos, speed, callback) {

    $('html,body').animate({'scrollTop': pos}, speed, function () {
        if (typeof(callback) == 'function') {
            callback();
        }
    });
}

function getBSImg(el) {

    if (wnd.width() < 1024 && el.attr('data-bs-1024') != void 0) {
        return el.attr('data-bs-1024');
    }

    return el.attr('data-bs');

}

function initMask() {
    $("input").filter(function (i, el) {
        return $(el).attr('data-inputmask') != void 0;
    }).inputmask();
}

function initInputFillChecker() {
    $('input').on('change keyup blur', function () {
        var inp = $(this);

        if ('text' == inp[0].type && 'required' == inp.attr('required')) {
            inp.toggleClass('empty', inp.val() == 0);
        }
    });
}

function initQuickSearchPopup() {

    quick_search_popup = $('#quick_search_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'no_close_mod no_title dialog_fixed',
        //appendTo: '.wrapper',
        width: '100%',
        draggable: true,
        collision: "fit",
        position: {my: "top center", at: "top center", of: window},
        open: function (event, ui) {
            body.addClass('modal_opened overlay_v2');
        },
        close: function (event, ui) {
            body.removeClass('modal_opened overlay_v2');
        }
    });

    $('.quickSearchBtn').on('click', function () {

        quick_search_popup.dialog('open');

        return false;
    });

}

function initTabs() {

    $('.tabBlock').each(function (ind) {
        var tab = $(this);

        tab.tabs({
            active: 0,
            activate: function (e, u) {
                slickUpdate();
            }
        });
    });
}

function slickUpdate() {
    setTimeout(function () {
        $('.slick-initialized:visible').slick('setPosition');
    }, 10);
}

function initSelect2() {

    $('.select2').each(function (ind) {
        var slct = $(this);

        slct.select2({
            minimumResultsForSearch: 1,
            dropdownParent: slct.parent(),
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
    });
}

function all_dialog_close() {
    body.on('click', '.ui-widget-overlay, .popupClose', all_dialog_close_gl);
}

function all_dialog_close_gl() {
    $(".ui-dialog-content").each(function () {
        var $this = $(this);
        if (!$this.parent().hasClass('always_open')) {
            $this.dialog("close");
        }
    });
}