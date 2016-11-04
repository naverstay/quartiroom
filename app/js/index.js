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


