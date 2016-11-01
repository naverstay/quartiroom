var autoCompleteOptions = {
    url: "autocomplete.json",

    getValue: "name",

    cssClasses: "autocomplete_v1",

    template: {
        type: "custom",
        method: function (value, item) {

            if (item.icon != void 0) {
                return "<div  class='eac_img'><img src='" + item.icon + "' /></div> <div class='eac_text clr_black'> <div class='gl_link'><span>" + item.name + "</span></div></div> ";
            } else {
                return "<div class='eac_text clr_black'> <div class='gl_link'><span>" + item.name + "</span></div></div> ";
            }

        }
    },

    list: {
        match: {
            enabled: true
        },
        showAnimation: {
            type: "slide"
        },
        hideAnimation: {
            type: "slide"
        }
    }
}

var interval = 10; // ms
setTimeout(function () {
    if (main_script) {
        continueLoading();
    } else {
        setTimeout(arguments.callee, interval);
    }
}, interval);

function continueLoading() {

    setSectionBS();

    initTypeSelect();

    initPriceRange();

    // initAutoComplete($('.searchField'), autoCompleteOptions);

}


