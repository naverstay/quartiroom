var interval = 10;

setTimeout(function () {
    if (main_script) {
        continueLoading();
    } else {
        setTimeout(arguments.callee, interval);
    }
}, interval);


function continueLoading() {

    initRatePopup();    

}
