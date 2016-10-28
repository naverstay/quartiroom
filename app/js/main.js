var body, html, doc, wnd,
    header,
    closeMenuTimer,
    callback_popup,
    auth_popup,
    fail_popup,
    success_popup,
    quick_search_popup,
    add2cart_popup,
    recovery_popup;

$(function ($) {

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

    }).delegate('.menuItem', 'mouseenter', function () {
        $(this).addClass('hovered');
    }).delegate('.menuItem', 'mouseleave', function () {
        $(this).removeClass('hovered');
    }).delegate('.menuItem', 'click', function () {
        $(this).toggleClass('hovered');
    });

    $('.scrollTo').on('click', function () {
        docScrollTo($($(this).attr('href')).offset().top - header.height(), 500);

        return false;
    });

    initSelect2();

    all_dialog_close();
});

function setSectionBS() {
    var section = $('.BSsection');

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
            tabContext: tab.attr('data-tab-context'),
            activate: function (e, u) {

            }
        });
    });
}

function initSelect2() {

    $('.select2').each(function (ind) {
        var slct = $(this);

        slct.select2({
            minimumResultsForSearch: Infinity,
            dropdownParent: slct.parent(),
            width: '100%',
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