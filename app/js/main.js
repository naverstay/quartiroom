var body, html, doc, wnd,
    ie,
    header,
    main_script = false,
    update_charts = true,
    click_event,
    close_menu_timer,
    region_popup,
    rate_popup;

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

    click_event = html.hasClass('touch') ? 'touchstart' : 'click';

    body.delegate('.openMobMenu', 'click', function () {
        clearTimeout(close_menu_timer);

        if (body.hasClass('menu_opened')) {
            close_menu_timer = setTimeout(function () {
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

        $('.simpleSearch').toggleClass('mob_hidden');

        // $('.advSearch').toggle();

        $('.advSearchBlock').slideToggle(300, function () {
            updateSizes();
        });

        return false;
    }).delegate('.collapseBlockBtn', 'click', function () {
        var firedEl = $(this);
        update_charts = false;

        $(this).closest('.companyBlock').toggleClass('opened').find('.infoBlock').slideToggle(300, function () {
            heightFiller();
            updateSizes();
            update_charts = true;

            if (firedEl.closest('.companyBlock').find('.d3graph').length) {
                drawCharts();
            }
        });

        setTimeout(function () {
            wnd.trigger('resize');
        }, 5);

        return false;

    }).delegate('.showMoreBtn', 'click', function () {

        $(this).hide().closest('.objectsList').toggleClass('show_all');

        return false;

    }).delegate('.sortToggle', 'click', function () {

        $(this).toggleClass('_desc');

        return false;

    }).delegate('.moreInfoBtn', 'click', function () {

        $(this).hide().closest('.infoItem').find('.moreInfo').slideToggle(0);

        return false;

    }).delegate('.formReset', 'click', function () {

        $($(this).attr('href')).click();

        return false;

    }).delegate('.favBtn', 'click', function () {

        $(this).find('span').eq(0).toggleClass('i-heart-filled');

        return false;

    }).delegate('.menuItem', 'mouseenter', function () {
        $(this).addClass('hovered just_hovered');
    }).delegate('.menuItem', 'mouseleave', function () {
        $(this).removeClass('hovered just_hovered');
    }).delegate('.menuItem', click_event, function () {
        var item = $(this);

        if (item.hasClass('just_hovered')) {
            item.removeClass('just_hovered');
        } else {
            item.toggleClass('hovered');
        }
        
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

    heightFiller();

    all_dialog_close();

}

$(window).resize(function () {

    heightFiller();

});

function drawCharts() {

    init_line_chart($('#chart_1'));

    init_pie_chart($('#chart_2'));

    init_pie_chart($('#chart_3'));

}

function init_pie_chart(el) {

    el.find('svg').remove();

    var margin = {top: 10, right: 248, bottom: 2, left: 0},
        height = el.height() - margin.top - margin.bottom,
        width = el.width() - margin.left - margin.right,
        // height = Math.max(0, width),
        labelSize = parseInt(window.getComputedStyle(el[0], ':before').getPropertyValue('content').replace(/\D*/g, '')),
        radius = (height / 2) - labelSize,
        inner = 0,
        total = 0;

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(0);

    var labelArc = d3.svg.arc()
        .outerRadius(radius + labelSize)
        .innerRadius(radius);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });

    var svg = d3.select(el[0]).append("svg")
            .attr("width", "100%")
            .attr("height", height)
        // .attr("preserveAspectRatio", "xMinYMin meet")
        // .attr("viewBox", "0 0 515 285")
        ;

    var svg_graph = svg.append("g")
        .attr("transform", "translate(" + height / 2 + "," + height / 2 + ")");

    svg_graph.append("circle")
        .attr("r", radius + labelSize)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("fill", 'none')
        .attr("stroke-width", 1)
        .attr("stroke", '#d6d6d6');

    var svg_legend = svg.append('g')
        .attr("transform", "translate(" + (radius + labelSize) * 2 + ",0)");

    d3.csv("data/data2.csv", type, function (error, data) {
        if (error) throw error;

        total = d3.sum(data, function (d) {
            return d3.sum(d3.values(d));
        });

        var g = svg_graph.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return (d.data.color);
            });

        g.append("text")
            .attr("transform", function (d) {
                return "translate(" + labelArc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .attr("startOffset", "50%")
            .style("text-anchor", "middle")
            .style("font-size", '11px')
            .style("font-family", 'Open Sans')
            .style("fill", '#333')
            .text(function (d, i) {
                return (d.data.value * 100 / total).toFixed() + '%';
            });

        var label = svg_legend.selectAll("g").data(pie(data))
            .enter()
            .append("g")
            .attr('class', 'label_row')
            .attr("transform", function (d, i) {
                return "translate(" + labelSize * 1.4 + "," + (i * labelSize + height / 4 ) + ")";
            });

        label.append('circle')
            .attr("r", 5)
            .attr("cx", 5)
            .attr("cy", 10)
            .style("fill", function (d, i) {
                return d.data.color;
            });

        label.append("text")
            .attr("x", 5 + (labelSize / 2))
            .attr("y", 10)
            .attr("class", 'legend_text')
            .attr("dy", ".35em")
            .style("font-family", 'Open Sans')
            .style("fill", '#333')
            .text(function (d) {
                return d.data.label;
            });

    });

    function type(d) {
        d.value = +d.value;
        return d;
    }

}

function init_line_chart(el) {

    el.find('svg').remove();

    var data = [
        // {"date": "19-Apr-12", "close": 3950000},
        // {"date": "18-Apr-12", "close": 3850000},
        // {"date": "17-Apr-12", "close": 3850000},
        // {"date": "16-Apr-12", "close": 3750000},
        // {"date": "15-Apr-12", "close": 3550000},
        // {"date": "14-Apr-12", "close": 3450000},
        {"date": "13-Apr-12", "close": 3350000},
        {"date": "12-Apr-12", "close": 3250000},
        {"date": "11-Apr-12", "close": 3150000},
        {"date": "10-Apr-12", "close": 3050000},
        {"date": "9-Apr-12", "close": 2950000},
        {"date": "8-Apr-12", "close": 2750000},
        {"date": "7-Apr-12", "close": 2670000},
        {"date": "6-Apr-12", "close": 2478000},
        {"date": "5-Apr-12", "close": 2340000},
        {"date": "4-Apr-12", "close": 2250000},
        {"date": "3-Apr-12", "close": 2150000},
        {"date": "2-Apr-12", "close": 1950000}
    ];

    var dates = [], values = [];

    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        dates.push(moment(obj.date));
        values.push(obj.close);
    }

    //console.log(Math.min.apply(null, values), Math.max.apply(null, values));

    //console.log(moment.min(data));

    var margin = {top: 10, right: 10, bottom: 10, left: 90},
        width = el.width() - margin.left - margin.right,
        height = el.height() - margin.top - margin.bottom;

    var bisectDate = d3.bisector(function (d) {
            //console.log(d);
            return d.date;
        }).left,
        parseDate = d3.time.format("%d-%b-%y").parse;

    //var currencyFormatter = d3.format(",.0f");

    var currencyFormatter = function (e) {
        return e.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    };

    var x = d3.time.scale()
        .domain([moment.min(dates), moment.max(dates)])
        .clamp(true)
        .range([0, width]);
    var y = d3.scale.linear()
        .domain([Math.floor((Math.min.apply(null, values))), Math.ceil((Math.max.apply(null, values)))])
        .clamp(true)
        .range([height, 0]);

    function make_y_axis() {
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(12)
    }

    function make_x_axis() {
        return d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(5)
    }

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.x);
        })
        .y(function (d) {
            return y(d.y);
        });

    var area_x = d3.time.scale().range([0, width]);
    var area_y = d3.scale.linear().range([height, 0]);

    var valueline = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });

    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(data.length - 1)
        .tickFormat(d3.time.format("%b %d"))
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(12)
        .tickFormat(function (d) {
            return d == 0 ? "" : currencyFormatter(d) + " руб.";
        })
        .orient("left");

    var svg = d3.select(el[0])
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .style("font-size", '0')
        // .style("fill", '#333')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        // .attr("transform", "translate(" + (-5) + ", 0)")
        .style("font-size", '11px')
        .style("fill", '#333')
        .attr("class", "grid")
        .call(yAxis);

    svg.append("g")
        .attr("class", "gray_grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        );


// Get the data
    data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
    });

// Scale the range of the data

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));

    y.domain([0, d3.max(data, function (d) {
        return Math.max(d.close);
    })]);

    area_x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    area_y.domain([0, d3.max(data, function (d) {
        return d.close;
    })]);

    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 4)
        .attr("data-y-value", function (d, i) {
            return y(d.close);
        })
        .attr('class', function (d, i) {
            return 'mark_v1 ';
        })
        .attr('id', function (d, i) {
            return 'dot_' + i;
        })
        .attr("cx", function (d) {
            return x(d.date);
        })
        .attr("cy", function (d) {
            return y(d.close);
        });

}

function initLocationSlider() {

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
                    breakpoint: 960,
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
            single = tdlr.attr('data-single'),
            min = parseInt(tdlr.attr('data-min')) || 0,
            max = parseInt(tdlr.attr('data-max')) || 10;

        initDynamicWidth(filter.find('input.val'));

        if (single) {
            console.log('single');
            noUiSlider.create(this, {
                start: max * .2,
                connect: [true, false],
                range: {
                    'min': min,
                    'max': max
                }
            });
        } else {
            console.log('connect');
            noUiSlider.create(this, {
                start: [max * .2, max * .8],
                connect: true,
                range: {
                    'min': min,
                    'max': max
                }
            });


        }

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
                plural_suffix_1 = target.attr('data-plural-suffix_1') || false,
                plural_suffix_2 = target.attr('data-plural-suffix_2') || false,
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
                    suffix_1 + (plural_suffix_1 ? getPural(val_1, arr[0], arr[1], arr[2]) : '')
                ));

                resize(filter.find('.end .val').val(
                    (format ? ('money' == format ? moneyFormat(val_2.toString()) : val_2) : val_2) +
                    suffix_2 + (plural_suffix_2 ? getPural(val_2, arr[0], arr[1], arr[2]) : '')
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

function initTabScroller() {

    $('.tabScroller').each(function (ind) {
        $(this).slick({
            dots: false,
            infinite: false,
            arrows: false,
            zIndex: 1,
            initialSlide: 0,
            slide: '.filter-item',
            variableWidth: true,
            touchThreshold: 10,
            onInit: function (sld) {

                $('.scrollerTabs[data-tab-context*="#' + $(sld.$slider).attr('id') + '"]').tabs({
                    active: 0,
                    activate: function (e, u) {
                        slickUpdate();
                        updateSizes();
                    }
                });
            }
        });
    })
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

function setSlideBS(slides) {
    slides.each(function () {
        var sctn = $(this);
        sctn.backstretch(sctn.find('img').attr('src'), {fade: 0});
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

function heightFiller() {
    $('.heightFiller').each(function () {
        var el = $(this).height('auto'), parent = el.closest('.heightFillerParent');

        el.height((parent.height() - (el.offset().top - parent.offset().top)));
    });
}

function updateSizes() {
    $('input.val').each(function () {
        resize(this);
    });
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

function initRegionPopup() {

    region_popup = $('#region_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'dialog_g_size_1 dialog_close_butt_mod_1 region_popup',
        appendTo: '.base',
        width: 1200,
        draggable: true,
        collision: "fit",
        position: {my: "top center", at: "top center", of: window},
        open: function (event, ui) {
            body.addClass('modal_opened overlay_v2');

            setTimeout(function () {
                initTabScroller();

                slickUpdate();
            }, 10);
        },
        close: function (event, ui) {
            body.removeClass('modal_opened overlay_v2');
        }
    });

    $('.regionPopupBtn').on('click', function () {

        region_popup.dialog('open');

        return false;
    });

}

function initRatePopup() {

    rate_popup = $('#rate_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'dialog_g_size_2 dialog_close_butt_mod_2 rate_popup',
        appendTo: '.base',
        width: 790,
        draggable: true,
        collision: "fit",
        position: {my: "top center", at: "top center", of: window},
        open: function (event, ui) {
            body.addClass('modal_opened overlay_v1');

            setTimeout(function () {
                initTabScroller();

                slickUpdate();
            }, 10);
        },
        close: function (event, ui) {
            body.removeClass('modal_opened overlay_v1');
        }
    });

    $('.ratePopupBtn').on('click', function () {

        rate_popup.dialog('open');

        return false;
    });

}

function initTabs(callback) {

    $('.tabBlock').each(function (ind) {
        $(this).tabs({
            active: 0,
            activate: function (e, u) {
                slickUpdate();
            }
        });
    });

    if (typeof callback == 'function') {
        callback();
    }

}

function slickUpdate() {
    setTimeout(function () {
        // wnd.trigger('resize');

        // console.log('upd');

        $('.popup .slick-track').css('width', 'auto');

        $('.slick-initialized:visible').each(function (ind) {
            if (!$(this).hasClass('noUpdate')) $(this).slick('setPosition');
        });
    }, 10);
}

function toNum(str) {
    return parseInt(str.toString().replace(/\D*/g, ''));
}

function resize(inp) {
    var el = $(inp), txt = el.nextAll('.widthPattern').text(el.val());
    el.attr('style', 'width:' + (txt.outerWidth() + 1) + 'px !important;');
}

function initDynamicWidth($el) {
    $el.each(function () {
        var inp = $(this), ptrn = $('<span class="widthPattern" />');

        ptrn.css({
            'position': 'absolute',
            'top': -99999,
            'left': -99999,
            // 'top': 0,
            // 'left': -300,
            'pointer-events': 'none',
            'white-space': 'nowrap',
            'padding': inp.css('padding'),
            'border': inp.css('border'),
            'font-size': inp.css('font-size'),
            'font-style': inp.css('font-style'),
            'font-family': inp.css('font-family'),
            'font-weight': inp.css('font-weight'),
            'letter-spacing': inp.css('letter-spacing')
        });

        inp.after(ptrn);

        var e = 'keyup,keypress,focus,blur,change,update'.split(',');
        for (var i in e) inp.on(e[i], function () {
            resize(this);
        });
        resize(this);
    });
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