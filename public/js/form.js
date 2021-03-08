'use strict';
$(function () {
    $('#loginform').hide();
    $('#login').click(() => {
        $('#loginform').fadeToggle();
    })
    $('#profile').hide();
    $('#logged').click(() => {
        $('#profile').fadeToggle();
    })
})